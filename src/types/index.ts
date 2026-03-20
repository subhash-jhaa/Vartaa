export type Language = {
  code: string
  name: string
  native: string
}

export type MessageType = 'text' | 'voice' | 'image' | 'file'
export type TranslationMap = Record<string, string>
export type UserPresence = 'online' | 'away' | 'dnd' | 'offline'

export const INDIAN_LANGUAGE_CODES: Language[] = [
  { code: 'hi-IN', name: 'Hindi',     native: 'हिंदी' },
  { code: 'bn-IN', name: 'Bengali',   native: 'বাংলা' },
  { code: 'te-IN', name: 'Telugu',    native: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi',   native: 'मराठी' },
  { code: 'ta-IN', name: 'Tamil',     native: 'தமிழ்' },
  { code: 'gu-IN', name: 'Gujarati',  native: 'ગુજરાતી' },
  { code: 'ur-IN', name: 'Urdu',      native: 'اردو' },
  { code: 'kn-IN', name: 'Kannada',   native: 'ಕನ್ನಡ' },
  { code: 'or-IN', name: 'Odia',      native: 'ଓڈ଼ିଆ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi',   native: 'ਪੰਜਾਬੀ' },
  { code: 'as-IN', name: 'Assamese',  native: 'অসমীয়া' },
  { code: 'mai-IN',name: 'Maithili',  native: 'मैथिली' },
  { code: 'kok-IN',name: 'Konkani',   native: 'कोंकणी' },
  { code: 'en-IN', name: 'English',   native: 'English' },
]
