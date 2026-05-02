'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import StartButton from '@/components/StartButton'
import ChatBubble from '@/components/ChatBubble'
import { useSpeech } from '@/hooks/useSpeech'
import { sendMessage } from '@/services/doubao-api'
import { transcribeAudio, isSTTConfigured } from '@/services/stt'

interface Message {
  text: string
  sender: 'ai' | 'user'
}

export default function AIChatPage() {
  const { info, level } = useAgeLevel()
  const { speak, stop } = useSpeech()
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [speechError, setSpeechError] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isAutoMode, setIsAutoMode] = useState(false)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const readyForInputRef = useRef(false)
  const gotResultRef = useRef(false)
  const retryCountRef = useRef(0)
  const stoppedRef = useRef(false)
  const MAX_RETRIES = 5
  // Silence detection refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceStartRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const isAutoModeRef = useRef(false)

  // iOS detection — webkitSpeechRecognition exists but never captures audio on iOS 17+
  const isIOS = useMemo(() => typeof navigator !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ), [])

  const speechSupported = !isIOS && typeof window !== 'undefined' &&
    (!!((window as any).SpeechRecognition) || !!((window as any).webkitSpeechRecognition))

  const recordingSupported = typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined'

  const messagesRef = useRef<Message[]>([])
  const sendToDoubaoRef = useRef<((text: string) => Promise<void>) | null>(null)
  const startRecordingRef = useRef<(autoMode: boolean) => Promise<void>>(null as any)

  const addMessage = useCallback((text: string, sender: 'ai' | 'user') => {
    const newMsg = { text, sender }
    messagesRef.current = [...messagesRef.current, newMsg]
    setMessages(prev => [...prev, newMsg])
  }, [])

  // Send transcript to Doubao and display reply
  const sendToDoubao = useCallback(async (transcript: string) => {
    addMessage(transcript, 'user')
    setIsLoading(true)
    readyForInputRef.current = false
    try {
      // Build full conversation history for the API
      const apiMessages = messagesRef.current.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      }))
      const reply = await sendMessage(apiMessages, level)
      addMessage(reply, 'ai')
      setAiSpeaking(true)
      speak(reply, undefined, () => {
        setAiSpeaking(false)
        readyForInputRef.current = true
        // In auto mode, restart recording after AI finishes
        if (isAutoModeRef.current && startRecordingRef.current) {
          setTimeout(() => startRecordingRef.current(true), 300)
        }
      })
    } catch {
      const fallback = "That's great! Tell me more! 😊"
      addMessage(fallback, 'ai')
      setAiSpeaking(true)
      speak(fallback, undefined, () => {
        setAiSpeaking(false)
        readyForInputRef.current = true
        // In auto mode, restart recording after AI finishes
        if (isAutoModeRef.current && startRecordingRef.current) {
          setTimeout(() => startRecordingRef.current(true), 300)
        }
      })
    }
    setIsLoading(false)
  }, [level, speak, addMessage])

  // Handle user voice input (from SpeechRecognition)
  const handleUserSpeech = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    await sendToDoubao(text.trim())
  }, [isLoading, sendToDoubao])

  // Keep ref in sync
  useEffect(() => { sendToDoubaoRef.current = sendToDoubao }, [sendToDoubao])

  // === Silence detection for auto mode ===
  function startSilenceDetection(stream: MediaStream) {
    try {
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      silenceStartRef.current = null

      const detect = () => {
        if (!analyserRef.current || mediaRecorderRef.current?.state !== 'recording') return
        analyserRef.current.getByteTimeDomainData(dataArray)
        const max = Math.max.apply(null, Array.from(dataArray))
        const normalized = Math.abs(max - 128) / 128

        if (normalized < 0.05) {
          if (!silenceStartRef.current) silenceStartRef.current = Date.now()
          else if (Date.now() - silenceStartRef.current >= 3000) {
            silenceStartRef.current = null
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop()
            }
            return
          }
        } else {
          silenceStartRef.current = null
        }
        animFrameRef.current = requestAnimationFrame(detect)
      }
      detect()
    } catch {
      // Silence detection not supported
    }
  }

  function stopSilenceDetection() {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    analyserRef.current = null
    silenceStartRef.current = null
  }
  // ====================================

  // Start speech recognition (triggered by user tap)
  const startListening = useCallback(() => {
    if (isListening || isLoading) return
    setSpeechError('')
    gotResultRef.current = false
    retryCountRef.current = 0
    stoppedRef.current = false
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const startRecognizer = () => {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = true

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1]
        if (result.isFinal) {
          const transcript = result[0].transcript
          if (transcript.trim()) {
            gotResultRef.current = true
            retryCountRef.current = MAX_RETRIES // stop retrying
            recognitionRef.current = null
            setIsListening(false)
            handleUserSpeech(transcript.trim())
          }
        }
      }

      recognition.onerror = () => {
        // On iOS, error fires frequently — retry unless stopped or exceeded limit
        retryCountRef.current++
        if (!stoppedRef.current && retryCountRef.current <= MAX_RETRIES) {
          setTimeout(startRecognizer, 300)
        } else if (!stoppedRef.current) {
          recognitionRef.current = null
          setIsListening(false)
          setSpeechError('语音识别失败，请重试')
        }
      }

      recognition.onend = () => {
        recognitionRef.current = null
        // If we got a result or user stopped, don't retry
        if (gotResultRef.current || stoppedRef.current) {
          if (!gotResultRef.current) setIsListening(false)
          return
        }
        // iOS: onend fires immediately after start without capturing audio.
        // Retry automatically until we get a result or exceed limit.
        retryCountRef.current++
        if (retryCountRef.current <= MAX_RETRIES) {
          startRecognizer()
        } else {
          setIsListening(false)
          setSpeechError('语音识别失败，请重试')
        }
      }

      recognitionRef.current = recognition
      try {
        recognition.start()
      } catch {
        retryCountRef.current++
        if (retryCountRef.current <= MAX_RETRIES) {
          setTimeout(startRecognizer, 300)
        } else {
          setIsListening(false)
          setSpeechError('语音识别启动失败')
        }
      }
    }

    startRecognizer()
    setIsListening(true)
    // Timeout: auto-stop after 15s to prevent getting stuck on iOS
    setTimeout(() => {
      if (!gotResultRef.current) {
        try { recognitionRef.current?.abort() } catch {}
        recognitionRef.current = null
        setIsListening(false)
        setSpeechError('语音识别超时，请重试')
      }
    }, 15000)
  }, [isListening, isLoading, handleUserSpeech])

  // Stop speech recognition
  const stopListening = useCallback(() => {
    stoppedRef.current = true
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  // Start recording (uses getUserMedia + STT API)
  const startRecording = useCallback(async (autoMode = false) => {
    if (isRecording || isLoading) return
    setSpeechError('')
    stoppedRef.current = false
    if (autoMode) {
      isAutoModeRef.current = true
      setIsAutoMode(true)
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm;codecs=opus'
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stopSilenceDetection()
        stream.getTracks().forEach(t => t.stop())
        setIsRecording(false)
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        if (blob.size === 0) return

        setIsLoading(true)
        try {
          const transcript = await transcribeAudio(blob)
          if (transcript.trim()) {
            await sendToDoubaoRef.current?.(transcript.trim())
          } else {
            setSpeechError('未识别到语音，请重试')
            setIsLoading(false)
            // Retry recording in auto mode
            if (isAutoModeRef.current) {
              setTimeout(() => startRecording(true), 500)
            }
          }
        } catch {
          setSpeechError('语音识别失败，请重试')
          setIsLoading(false)
          // Retry recording in auto mode
          if (isAutoModeRef.current) {
            setTimeout(() => startRecording(true), 1000)
          }
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)

      // Start silence detection for auto mode
      if (autoMode) {
        startSilenceDetection(stream)
      }
    } catch {
      setSpeechError('无法访问麦克风，请允许麦克风权限')
      setIsAutoMode(false)
      isAutoModeRef.current = false
    }
  }, [isRecording, isLoading])

  // Sync startRecording ref for use in earlier callbacks
  useEffect(() => { startRecordingRef.current = startRecording }, [startRecording])

  // Stop recording
  const stopRecording = useCallback(() => {
    stopSilenceDetection()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
  }, [])

  const handleStart = () => {
    setStarted(true)
    readyForInputRef.current = false
    const greeting = "Hi there! I'm Elizabeth! Let's learn English together! 🎉"
    addMessage(greeting, 'ai')
    setAiSpeaking(true)
    speak(greeting, undefined, () => {
      setAiSpeaking(false)
      readyForInputRef.current = true
      // Auto-start recording after greeting if STT configured
      if (recordingSupported && isSTTConfigured()) {
        startRecording(true)
      }
    })
  }

  const handleStop = () => {
    stop()
    stopListening()
    stopRecording()
    stopSilenceDetection()
    setAiSpeaking(false)
    readyForInputRef.current = false
    setStarted(false)
    setIsAutoMode(false)
    isAutoModeRef.current = false
    setMessages([])
    messagesRef.current = []
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
      stopListening()
      stopRecording()
      stopSilenceDetection()
    }
  }, [stop, stopListening, stopRecording])

  const speakMessage = (text: string) => speak(text)

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-gray-600">🤖 Elizabeth · {info.label}</span>
      </div>

      {!started ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Image src="/images/teacher.png" alt="Elizabeth" width={160} height={160}
            className="rounded-full object-cover shadow-xl mb-4" />
          <div className="text-2xl font-bold text-blue-700">Elizabeth</div>
          <div className="text-base text-gray-400 mt-1">Your AI English Teacher</div>
          <div className="text-sm text-gray-400 mt-4 text-center max-w-xs">
            {speechSupported ? '🎤 Tap the mic to speak, Elizabeth will reply!' : '💬 Type a message, Elizabeth will reply!'}
          </div>
          <div className="mt-8">
            <StartButton onClick={handleStart} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Header with stop button */}
          <div className="flex justify-end mb-2">
            <button onClick={handleStop}
              className="text-xs text-red-500 border border-red-200 rounded-full px-3 py-1 hover:bg-red-50">
              ✕ End Class
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-[400px] max-h-[450px] overflow-y-auto mb-4">
            {messages.map((m, i) => (
              <div key={i} onClick={() => m.sender === 'ai' && speakMessage(m.text)}
                className={m.sender === 'ai' ? 'cursor-pointer' : ''}>
                <ChatBubble message={m.text} sender={m.sender} />
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-400 py-2">
                <span className="animate-pulse">Elizabeth is thinking...</span>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 pt-3 text-center">
            {speechError && (
              <p className="text-xs text-red-500 mb-2">{speechError}</p>
            )}
            {isAutoMode && !isRecording && !isLoading && !aiSpeaking && (
              <div className="text-sm text-green-500 py-4">🎤 Listening... waiting for speech</div>
            )}
            {isRecording ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="flex flex-col items-center gap-2 mx-auto">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-3xl text-white">🎤</span>
                  </div>
                  <span className="text-sm text-red-500 font-medium">
                    {isAutoMode ? 'Recording... auto-submit on silence' : 'Recording...'}
                  </span>
                  {!isAutoMode && (
                    <button onClick={stopRecording}
                      className="text-xs text-gray-500 underline mt-1">
                      Tap to stop
                    </button>
                  )}
                </div>
              </div>
            ) : isListening ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-3xl text-white">🎤</span>
                </div>
                <span className="text-sm text-red-500 font-medium">Listening...</span>
              </div>
            ) : isLoading ? (
              <div className="text-sm text-gray-400 py-4">⏳ {recordingSupported ? 'Transcribing...' : 'Waiting for Elizabeth...'}</div>
            ) : aiSpeaking ? (
              <div className="text-sm text-gray-400 py-4">🔊 Elizabeth is speaking...</div>
            ) : isAutoMode ? (
              <div className="text-sm text-gray-400 py-4">⏳ Preparing microphone...</div>
            ) : speechSupported ? (
              <button onClick={startListening}
                className="flex flex-col items-center gap-2 mx-auto active:scale-95 transition-transform">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600">
                  <span className="text-3xl text-white">🎤</span>
                </div>
                <span className="text-sm text-blue-500 font-medium">Tap to speak</span>
              </button>
            ) : recordingSupported && isSTTConfigured() ? (
              <button onClick={() => startRecording(false)}
                className="flex flex-col items-center gap-2 mx-auto active:scale-95 transition-transform">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600">
                  <span className="text-3xl text-white">🎤</span>
                </div>
                <span className="text-sm text-blue-500 font-medium">Tap to record</span>
              </button>
            ) : recordingSupported ? (
              <div className="text-sm text-amber-500 py-4">
                <p>⚠️ Speech-to-text API not configured</p>
                <p className="text-xs mt-1">Set NEXT_PUBLIC_STT_API_KEY in Cloudflare Pages env vars</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4">Speech not supported in this browser</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
