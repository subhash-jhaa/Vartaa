export const INDIAN_LANGUAGES = [
  { code: 'en-IN', native: 'English',     label: 'English' },
  { code: 'hi-IN', native: 'हिन्दी',      label: 'Hindi' },
  { code: 'bn-IN', native: 'বাংলা',        label: 'Bengali' },
  { code: 'te-IN', native: 'తెలుగు',       label: 'Telugu' },
  { code: 'mr-IN', native: 'मराठी',        label: 'Marathi' },
  { code: 'ta-IN', native: 'தமிழ்',        label: 'Tamil' },
  { code: 'gu-IN', native: 'ગુજરાતી',      label: 'Gujarati' },
  { code: 'kn-IN', native: 'ಕನ್ನಡ',        label: 'Kannada' },
  { code: 'ml-IN', native: 'മലയാളം',       label: 'Malayalam' },
  { code: 'pa-IN', native: 'ਪੰਜਾਬੀ',       label: 'Punjabi' },
  { code: 'or-IN', native: 'ଓଡ଼ିଆ',         label: 'Odia' },
  { code: 'as-IN', native: 'অসমীয়া',      label: 'Assamese' },
  { code: 'ur-IN', native: 'اردو',         label: 'Urdu' },
  { code: 'sa-IN', native: 'संस्कृतम्',    label: 'Sanskrit' },
  { code: 'ne-IN', native: 'नेपाली',       label: 'Nepali' },
  { code: 'kok-IN', native: 'कोंकणी',      label: 'Konkani' },
  { code: 'mai-IN', native: 'मैथिली',      label: 'Maithili' },
  { code: 'doi-IN', native: 'डोगरी',       label: 'Dogri' },
  { code: 'sd-IN',  native: 'سنڌي',        label: 'Sindhi' },
  { code: 'ks-IN',  native: 'کٲشُر',       label: 'Kashmiri' },
  { code: 'mni-IN', native: 'মেইতেই',      label: 'Manipuri' },
  { code: 'brx-IN', native: 'बर\'',        label: 'Bodo' },
  { code: 'sat-IN', native: 'ᱥᱟᱱᱛᱟᱲᱤ',   label: 'Santali' },
] as const

export const FOREIGN_LANGUAGES = [
  { code: 'ja-JP', native: '日本語',   label: 'Japanese' },
  { code: 'zh-CN', native: '中文',     label: 'Chinese' },
  { code: 'es-ES', native: 'Español',  label: 'Spanish' },
  { code: 'fr-FR', native: 'Français', label: 'French' },
  { code: 'de-DE', native: 'Deutsch',  label: 'German' },
  { code: 'ar-SA', native: 'العربية',  label: 'Arabic' },
  { code: 'ru-RU', native: 'Русский',  label: 'Russian' },
  { code: 'pt-PT', native: 'Português',label: 'Portuguese' },
  { code: 'ko-KR', native: '한국어',   label: 'Korean' },
] as const

export type Language = {
  code: string
  native: string
  label: string
}

export const ALL_LANGUAGES = [
  ...INDIAN_LANGUAGES,
  ...FOREIGN_LANGUAGES,
]
