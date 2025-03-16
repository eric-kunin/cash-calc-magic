
/**
 * Formats a number as currency with the Israeli Shekel symbol based on language
 */
export const formatCurrency = (value: number, language: string = 'en'): string => {
  let locale = 'en-US';
  
  if (language === 'he') {
    locale = 'he-IL';
  } else if (language === 'ru') {
    locale = 'ru-RU';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Safely parses string input to a number, returning 0 for invalid inputs
 */
export const safeParseInt = (value: string): number => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Fixes image paths to ensure they are correctly formatted
 */
export const fixImagePath = (path: string): string => {
  // Remove any 'public/' prefix that might be in the path
  return path.replace(/^public\//, '/');
};
