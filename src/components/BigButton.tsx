interface BigButtonProps {
  icon: string
  label: string
  color: string
  onClick?: () => void
  size?: 'md' | 'lg'
}

export default function BigButton({ icon, label, color, onClick, size = 'lg' }: BigButtonProps) {
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
  return (
    <button onClick={onClick}
      className={`${dim} ${color} rounded-full flex flex-col items-center justify-center text-white shadow-lg active:scale-95 transition-transform`}>
      <span className="text-3xl">{icon}</span>
      <span className="text-[10px] mt-0.5">{label}</span>
    </button>
  )
}
