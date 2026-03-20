interface VartaaLogoProps {
  size?: number
  showText?: boolean
  textSize?: number
}

export default function VartaaLogo({ size = 32, showText = true, textSize = 16 }: VartaaLogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#111110" stroke="rgba(212,168,67,0.15)" strokeWidth="1" />
        <path
          d="M10 28 C10 20 16 15 22 19 C25 21 27 25 28 28 C29 31 31 35 34 37 C40 41 46 36 46 28 C46 20 40 15 34 19 C31 21 29 25 28 28 C27 31 25 35 22 37 C16 41 10 36 10 28 Z"
          fill="none"
          stroke="#d4a843"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: textSize + 4,
            color: '#d4a843',
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            lineHeight: 1,
          }}>वार्ता</span>
          <div style={{ width: 1, height: textSize + 2, background: 'rgba(212,168,67,0.3)' }} />
          <span style={{
            fontSize: textSize,
            color: '#f0ede6',
            fontFamily: 'Geist, sans-serif',
            fontWeight: 500,
            letterSpacing: '-0.3px',
          }}>Vartaa</span>
        </div>
      )}
    </div>
  )
}