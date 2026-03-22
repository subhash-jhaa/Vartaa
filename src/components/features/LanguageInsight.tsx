'use client'

interface LanguageInsightProps {
  insight: string
  isOwn: boolean
}

export default function LanguageInsight({ insight, isOwn }: LanguageInsightProps) {
  return (
    <div
      className="language-insight-wrapper"
      style={{
        position: 'absolute',
        top: -6,
        [isOwn ? 'right' : 'left']: -6,
        zIndex: 50,
      }}
    >
      {/* Badge */}
      <div
        className="insight-badge"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'var(--obsidian-surface)',
          border: '1px solid var(--obsidian-border)',
          fontSize: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default',
          color: 'var(--obsidian-text-muted)',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        i
      </div>

      {/* Tooltip */}
      <div
        className="insight-tooltip"
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          [isOwn ? 'right' : 'left']: 0,
          width: 220,
          background: 'var(--obsidian-surface)',
          border: '1px solid var(--obsidian-border)',
          borderRadius: 10,
          padding: 12,
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease-in-out',
          opacity: 0,
          transform: 'translateY(4px)',
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            paddingBottom: 8, 
            borderBottom: '1px solid var(--obsidian-border)',
            marginBottom: 8 
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--obsidian-primary)' }} />
          <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--obsidian-text-faint)', letterSpacing: '0.1em' }}>
            Language Insight
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--obsidian-text)', lineHeight: 1.6 }}>
          {insight}
        </div>
      </div>

      <style jsx>{`
        .language-insight-wrapper {
          opacity: 0;
          transition: opacity 0.2s;
        }
        :global(.message-bubble-group:hover) .language-insight-wrapper {
          opacity: 1;
        }
        .language-insight-wrapper:hover .insight-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
        .language-insight-wrapper:hover .insight-badge {
          border-color: var(--obsidian-primary-alpha);
          color: var(--obsidian-primary);
        }
      `}</style>
    </div>
  )
}
