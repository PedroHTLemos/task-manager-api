interface Props {
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ size = 'md' }: Props) {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 32
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'

  return (
    <div className="flex items-center gap-2.5">
      <svg width={iconSize} height={iconSize} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#1a1a2e"/>
        <rect x="8" y="16" width="4" height="12" rx="2" fill="#4a3fa0"/>
        <rect x="14" y="11" width="4" height="17" rx="2" fill="#6b5fd0"/>
        <rect x="20" y="7" width="4" height="21" rx="2" fill="#8b7cf8"/>
        <rect x="26" y="13" width="4" height="15" rx="2" fill="#6b5fd0"/>
      </svg>
      <span className={`${textSize} font-medium text-white tracking-tight`}>
        Ork<span style={{ color: '#8b7cf8' }}>est</span>
      </span>
    </div>
  )
}
