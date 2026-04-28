const SPEECH_KEY = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || ''
const SPEECH_REGION = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || 'eastasia'

/**
 * Azure Speech SDK wrapper for TTS and Pronunciation Assessment.
 * Falls back to Web Speech API when credentials are not configured.
 */

export function isAzureConfigured(): boolean {
  return !!(SPEECH_KEY && SPEECH_REGION)
}

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer | null> {
  if (!isAzureConfigured()) return null

  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="en-US-AnaNeural">
        <prosody rate="+10%" pitch="+15%">
          ${text}
        </prosody>
      </voice>
    </speak>`

  try {
    const tokenRes = await fetch(
      `https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': SPEECH_KEY } }
    )
    const token = await tokenRes.text()

    const ttsRes = await fetch(
      `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        },
        body: ssml,
      }
    )
    return ttsRes.arrayBuffer()
  } catch (err) {
    console.warn('Azure TTS failed, falling back to Web Speech API:', err)
    return null
  }
}

export async function assessPronunciation(_audioBlob: Blob, _referenceText: string): Promise<{
  score: number
  phonemes: Array<{ phoneme: string; status: 'correct' | 'needs-work' | 'incorrect' }>
} | null> {
  if (!isAzureConfigured()) return null

  try {
    // Azure Pronunciation Assessment API integration
    // Requires Speech SDK (microsoft.cognitiveservices.speech) in browser
    // For MVP, this returns null to trigger mock fallback
    return null
  } catch (err) {
    console.warn('Azure assessment failed:', err)
    return null
  }
}
