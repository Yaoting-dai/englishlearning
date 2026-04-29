export interface VoiceOption {
  id: string
  name: string
  label: string
  description: string
}

export const voiceOptions: VoiceOption[] = [
  { id: 'Samantha', name: 'Samantha', label: 'Samantha', description: '标准美语女声，清晰自然' },
  { id: 'Flo', name: 'Flo', label: 'Flo', description: '温暖女声' },
  { id: 'Sandy', name: 'Sandy', label: 'Sandy', description: '美式女声' },
  { id: 'Shelley', name: 'Shelley', label: 'Shelley', description: '美式女声' },
  { id: 'Junior', name: 'Junior', label: 'Junior', description: '童声（小男孩）' },
]

export function getSavedVoice(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ttsVoice')
}

export function saveVoice(voiceId: string) {
  localStorage.setItem('ttsVoice', voiceId)
}
