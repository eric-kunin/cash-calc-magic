
import { Language } from './types';
import { translations } from './translationData';

// Get translation for a key in specified language
export const getTranslation = (key: string, language: Language): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translations[key][language];
};
