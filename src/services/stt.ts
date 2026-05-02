const STT_ENDPOINT = '/stt'

export function isSTTConfigured(): boolean {
  return true // Cloudflare Function is always available
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData()
  formData.append('file', audioBlob, 'recording.m4a')

  const response = await fetch(STT_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    console.error('STT error:', response.status, errData)
    throw new Error(errData.error || `STT error: ${response.status}`)
  }

  const data = await response.json()
  return data.text || ''
}
