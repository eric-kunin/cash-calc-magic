
export type Language = 'en' | 'he' | 'ru';

export interface Translations {
  [key: string]: {
    [language in Language]: string;
  };
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
