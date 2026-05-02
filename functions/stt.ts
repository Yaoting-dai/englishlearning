// Cloudflare Pages Function — STT proxy
// Accepts POST with FormData { file: audioBlob }
// Returns JSON { text: "<transcript>" }

interface Env {
  AI?: {
    run: (model: string, input: any) => Promise<{ text?: string; [key: string]: any }>
  }
  STT_API_URL?: string
  STT_API_KEY?: string
}

export async function onRequest(context: { request: Request; env: Env }) {
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

    // Option 1: Cloudflare Workers AI Whisper
    if (env.AI) {
      const bytes = new Uint8Array(audioBuffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const base64 = btoa(binary)
      const dataUri = `data:${file.type || 'audio/mp4'};base64,${base64}`

      const result = await env.AI.run('@cf/openai/whisper', {
        audio: dataUri,
      })

      return new Response(JSON.stringify({ text: result?.text || '' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Option 2: Custom HTTP-based STT API (configured via env vars)
    if (env.STT_API_URL) {
      const formDataForward = new FormData()
      formDataForward.append('file', new File([audioBuffer], 'recording.m4a', { type: file.type }))
      formDataForward.append('model', 'whisper-1')
      formDataForward.append('language', 'en')

      const response = await fetch(env.STT_API_URL, {
        method: 'POST',
        headers: env.STT_API_KEY
          ? { Authorization: `Bearer ${env.STT_API_KEY}` }
          : undefined,
        body: formDataForward,
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`STT API error (${response.status}): ${errText}`)
      }

      const data = await response.json()
      return new Response(JSON.stringify({ text: data.text || '' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // No backend configured
    return new Response(
      JSON.stringify({ error: 'STT backend not configured. Add AI binding or set STT_API_URL.' }),
      { status: 501, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
