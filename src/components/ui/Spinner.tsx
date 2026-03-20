export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, border: `${size * 0.1}px solid rgba(240,237,230,0.15)`, borderTopColor: '#c8c5be', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  )
}
