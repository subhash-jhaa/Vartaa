interface AvatarProps {
  name: string
  imageUrl?: string
  size?: number
  presence?: 'online' | 'away' | 'dnd' | 'offline'
}
export function Avatar({ name, imageUrl, size = 32, presence }: AvatarProps) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const presenceColors = { online: '#4ade80', away: '#facc15', dnd: '#f87171', offline: 'rgba(240,237,230,0.2)' }
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} style={{ width: size, height: size, borderRadius: size * 0.25, objectFit: 'cover' }} />
      ) : (
        <div style={{ width: size, height: size, borderRadius: size * 0.25, background: '#1a1a18', border: '1px solid rgba(240,237,230,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 500, color: '#c8c5be' }}>
          {initials}
        </div>
      )}
      {presence && (
        <span style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: presenceColors[presence], border: '2px solid #0c0c0b' }} />
      )}
    </div>
  )
}
