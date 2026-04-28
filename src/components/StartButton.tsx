interface StartButtonProps {
  onClick: () => void
  label?: string
}

export default function StartButton({ onClick, label = 'START' }: StartButtonProps) {
  return (
    <button onClick={onClick}
      className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl active:scale-95 transition-transform mx-auto">
      <span className="text-4xl">▶</span>
      <span className="text-base font-bold mt-1">{label}</span>
    </button>
  )
}
