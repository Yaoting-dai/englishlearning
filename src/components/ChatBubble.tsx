interface ChatBubbleProps {
  message: string
  sender: 'ai' | 'user'
}

export default function ChatBubble({ message, sender }: ChatBubbleProps) {
  const isAI = sender === 'ai'
  return (
    <div className={`flex gap-3 mb-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base shrink-0 ${
        isAI ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-orange-400'
      }`}>
        {isAI ? 'E' : '👤'}
      </div>
      <div className={`${isAI ? 'bg-blue-50 rounded-r-2xl rounded-bl-2xl' : 'bg-orange-50 rounded-l-2xl rounded-br-2xl'} px-4 py-3 max-w-[75%]`}>
        <div className="text-lg leading-relaxed">{message}</div>
        {isAI && <div className="text-xs text-gray-400 mt-2">🔊 点击听发音</div>}
      </div>
    </div>
  )
}
