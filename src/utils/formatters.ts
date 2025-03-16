
/**
 * Formats a number as currency with the Israeli Shekel symbol
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('he-IL', {
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
