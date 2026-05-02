// Cloudflare Pages Function — STT proxy
// Accepts POST with FormData { file: audioBlob }
// Returns JSON { text: "<transcript>" }

async function callVolcengineASR(
  audioBuffer: ArrayBuffer,
  mimeType: string,
  apiUrl: string,
  apiKey: string,
): Promise<string> {
  // 火山引擎语音识别 (openspeech.bytedance.com) HTTP API
  // Docs: https://www.volcengine.com/docs/6561/341796
  const formData = new FormData()
  formData.append(
    'audio',
    new File([audioBuffer], 'recording.m4a', { type: mimeType || 'audio/mp4' }),
  )
  formData.append('cluster', 'volc_audio_v2') // uses the user's configured ASR engine

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer;access_token=${apiKey}` },
    body: formData,
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('Volcengine ASR error:', response.status, errText)
    throw new Error(`语音识别服务错误 (${response.status})`)
  }

  const data = await response.json()
  // Response format: { payload: { text: "..." } } or { text: "..." } or { result: "..." }
  return data?.payload?.text || data?.text || data?.result || ''
}

async function callOpenAICompatibleASR(
  audioBuffer: ArrayBuffer,
  mimeType: string,
  apiUrl: string,
  apiKey: string,
): Promise<string> {
  const formData = new FormData()
  formData.append('file', new File([audioBuffer], 'recording.m4a', { type: mimeType }))
  formData.append('model', 'whisper-1')
  formData.append('language', 'en')

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('STT API error:', response.status, errText)
    throw new Error(`语音识别服务错误 (${response.status})`)
  }

  const data = await response.json()
  return data?.text || ''
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

    // Option 1: Cloudflare Workers AI Whisper
    if (env.AI) {
      const bytes = new Uint8Array(audioBuffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const base64 = btoa(binary)
      const dataUri = `data:${mimeType};base64,${base64}`

      const result = await (env.AI as any).run('@cf/openai/whisper', { audio: dataUri })
      return new Response(JSON.stringify({ text: result?.text || '' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Option 2: HTTP-based STT API
    const sttUrl = env.STT_API_URL || env.NEXT_PUBLIC_STT_ENDPOINT
    const sttKey = env.STT_API_KEY || env.NEXT_PUBLIC_STT_API_KEY

    if (sttUrl && sttKey) {
      let text: string

      if (sttUrl.includes('openspeech.bytedance.com')) {
        // 火山引擎语音识别
        text = await callVolcengineASR(audioBuffer, mimeType, sttUrl, sttKey)
      } else {
        // OpenAI-compatible (Azure, OpenAI, etc.)
        text = await callOpenAICompatibleASR(audioBuffer, mimeType, sttUrl, sttKey)
      }

      return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // No backend configured
    return new Response(
      JSON.stringify({ error: 'STT 未配置。请在 Cloudflare 添加 AI binding 或设置 STT_API_URL。' }),
      { status: 501, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || '语音识别失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
