type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'ai'
const styles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: 'rgba(240,237,230,0.06)', color: '#c8c5be', border: '1px solid rgba(240,237,230,0.1)' },
  success: { background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
  warning: { background: 'rgba(250,204,21,0.08)', color: '#facc15', border: '1px solid rgba(250,204,21,0.2)' },
  danger:  { background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' },
  ai:      { background: 'rgba(240,237,230,0.06)', color: '#c8c5be', border: '1px solid rgba(240,237,230,0.13)' },
}
export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500, ...styles[variant] }}>
      {children}
    </span>
  )
}
