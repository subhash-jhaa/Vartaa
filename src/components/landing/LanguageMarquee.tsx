
'use client'

export default function LanguageMarquee() {
  const indianLangs = [
    { native: 'हिंदी', english: 'Hindi' },
    { native: 'தமிழ்', english: 'Tamil' },
    { native: 'বাংলা', english: 'Bengali' },
    { native: 'తెలుగు', english: 'Telugu' },
    { native: 'मराठी', english: 'Marathi' },
    { native: 'ಕನ್ನಡ', english: 'Kannada' },
    { native: 'ગુજરાતી', english: 'Gujarati' },
    { native: 'മലയാളം', english: 'Malayalam' },
    { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
    { native: 'اردو', english: 'Urdu' },
    { native: 'ଓଡ଼ିଆ', english: 'Odia' },
    { native: 'অসমীয়া', english: 'Assamese' },
    { native: 'मैथिली', english: 'Maithili' },
    { native: 'संस्कृतम्', english: 'Sanskrit' },
    { native: 'डोगरी', english: 'Dogri' },
    { native: 'कोंकणी', english: 'Konkani' },
    { native: 'नेपाली', english: 'Nepali' },
    { native: 'বড়ো', english: 'Bodo' },
    { native: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali' },
    { native: 'মৈতৈলোন্', english: 'Manipuri' },
    { native: 'سنڌي', english: 'Sindhi' },
    { native: 'कॉशुर', english: 'Kashmiri' },
  ]

  const foreignLangs = [
    { native: 'Español', english: 'Spanish' },
    { native: 'Français', english: 'French' },
    { native: 'Deutsch', english: 'German' },
    { native: '日本語', english: 'Japanese' },
    { native: '中文', english: 'Chinese' },
    { native: '한국어', english: 'Korean' },
    { native: 'العربية', english: 'Arabic' },
    { native: 'Português', english: 'Portuguese' },
    { native: 'Русский', english: 'Russian' },
    { native: 'Italiano', english: 'Italian' },
    { native: 'Türkçe', english: 'Turkish' },
    { native: 'Nederlands', english: 'Dutch' },
    { native: 'Polski', english: 'Polish' },
    { native: 'Svenska', english: 'Swedish' },
    { native: 'Bahasa', english: 'Indonesian' },
    { native: 'Tiếng Việt', english: 'Vietnamese' },
    { native: 'ภาษาไทย', english: 'Thai' },
    { native: 'Українська', english: 'Ukrainian' },
  ]

  const doubled = (arr: { native: string; english: string }[]) => [...arr, ...arr]

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: '#0c0c0b',
      overflow: 'hidden',
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      marginTop: '-30px',
      position: 'relative',
      zIndex: 10,
    }}>
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .mleft {
          display: flex;
          gap: 8px;
          width: max-content;
          animation: marqueeLeft 45s linear infinite;
        }
        .mleft:hover { animation-play-state: paused; }
        .mright {
          display: flex;
          gap: 8px;
          width: max-content;
          animation: marqueeRight 50s linear infinite;
        }
        .mright:hover { animation-play-state: paused; }
        .tag-indian {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 6px;
          background: #111110;
          border-left: 2px solid rgba(229,192,123,0.4);
          flex-shrink: 0;
          transition: all 0.2s;
          cursor: default;
        }
        .tag-indian:hover {
          background: #161614;
          border-left-color: #e5c07b;
        }
        .tag-foreign {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 6px;
          background: #0f0f0e;
          border-left: 2px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
          transition: all 0.2s;
          cursor: default;
        }
        .tag-foreign:hover {
          background: #131312;
          border-left-color: rgba(255,255,255,0.2);
        }
        .nat-in { font-size: 15px; color: var(--color-accent-a); font-family: sans-serif; }
        .nat-fo { font-size: 13px; color: var(--color-text-dim); font-family: sans-serif; }
        .eng-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--color-text-faint); font-family: sans-serif; }
      `}</style>

      {/* Row 1 — Indian languages scrolling left */}
      <div style={{ overflow: 'hidden', padding: '8px 0' }}>
        <div className="mleft">
          {doubled(indianLangs).map((lang, i) => (
            <div key={i} className="tag-indian">
              <span className="nat-in">{lang.native}</span>
              <span className="eng-label">{lang.english}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — Foreign languages scrolling right */}
      <div style={{ overflow: 'hidden', padding: '8px 0' }}>
        <div className="mright">
          {doubled(foreignLangs).map((lang, i) => (
            <div key={i} className="tag-foreign">
              <span className="nat-fo">{lang.native}</span>
              <span className="eng-label">{lang.english}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
