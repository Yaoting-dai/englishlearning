// Cloudflare Pages Function — STT proxy
// Accepts POST with FormData { file: audioBlob }
// Returns JSON { text: "<transcript>" }

async function base64FromBuffer(buf: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function callWhisper(audioBuffer: ArrayBuffer, ai: any): Promise<string> {
  const base64 = await base64FromBuffer(audioBuffer)

  // whisper-large-v3-turbo has best format support (m4a, mp3, wav, etc.)
  const result = await ai.run('@cf/openai/whisper-large-v3-turbo', {
    audio: base64,
  })
  return result?.text || ''
}

export async function onRequest(context: { request: Request; env: Record<string, string> }) {
  const { request, env } = context

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return new Response(JSON.stringify({ error: 'No audio file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const audioBuffer = await file.arrayBuffer()
    const mimeType = file.type || 'audio/mp4'

    // Option 1 (recommended): Cloudflare Workers AI Whisper
    // Requires AI binding in Cloudflare Pages dashboard
    if (env.AI) {
      const text = await callWhisper(audioBuffer, (env as any).AI)
      return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Option 2: OpenAI-compatible API (used when AI binding is unavailable)
    const sttUrl = env.STT_API_URL || env.NEXT_PUBLIC_STT_ENDPOINT
    const sttKey = env.STT_API_KEY || env.NEXT_PUBLIC_STT_API_KEY
    if (sttUrl && sttKey) {
      const fd = new FormData()
      fd.append('file', new File([audioBuffer], 'recording.m4a', { type: mimeType }))
      fd.append('model', 'whisper-1')
      fd.append('language', 'en')

      const response = await fetch(sttUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sttKey}` },
        body: fd,
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('STT API error:', response.status, errText)
        throw new Error(`语音识别服务错误 (${response.status})`)
      }

      const data = await response.json()
      return new Response(JSON.stringify({ text: data?.text || '' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // No backend configured — tell user exactly what to do
    return new Response(
      JSON.stringify({
        error:
          'STT 未配置。请前往 Cloudflare Pages → learningenglish → Settings → Functions → 添加 AI binding（变量名: AI），然后重新部署。',
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || '语音识别失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
