const STT_ENDPOINT = process.env.NEXT_PUBLIC_STT_ENDPOINT || 'https://api.openai.com/v1/audio/transcriptions'
const STT_API_KEY = process.env.NEXT_PUBLIC_STT_API_KEY || ''
const STT_MODEL = process.env.NEXT_PUBLIC_STT_MODEL || 'whisper-1'

export function isSTTConfigured(): boolean {
  return !!STT_API_KEY
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!STT_API_KEY) {
    throw new Error('STT API key not configured')
  }

  const formData = new FormData()
  formData.append('file', audioBlob, 'recording.m4a')
  formData.append('model', STT_MODEL)
  formData.append('language', 'en')

  const response = await fetch(STT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STT_API_KEY}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('STT API error:', response.status, errText)
    throw new Error(`STT API error: ${response.status}`)
  }

  const data = await response.json()
  return data.text || ''
}
