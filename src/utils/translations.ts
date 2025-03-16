
type Language = 'en' | 'he' | 'ru';

interface Translations {
  [key: string]: {
    [language in Language]: string;
  };
}

// All translatable text content
export const translations: Translations = {
  // App title and general texts
  'appTitle': {
    en: 'Cash Counter',
    he: 'סופר מזומנים',
    ru: 'Счетчик Наличных'
  },
  'appSubtitle': {
    en: 'Calculate your cash totals effortlessly',
    he: 'חשב את סך המזומנים שלך בקלות',
    ru: 'Легко подсчитайте свои наличные деньги'
  },
  'reset': {
    en: 'Reset',
    he: 'איפוס',
    ru: 'Сброс'
  },
  'save': {
    en: 'Save',
    he: 'שמור',
    ru: 'Сохранить'
  },
  'counter': {
    en: 'Counter',
    he: 'מונה',
    ru: 'Счетчик'
  },
  'history': {
    en: 'History',
    he: 'היסטוריה',
    ru: 'История'
  },
  
  // Denominations
  'coins': {
    en: 'Coins',
    he: 'מטבעות',
    ru: 'Монеты'
  },
  'notes': {
    en: 'Notes',
    he: 'שטרות',
    ru: 'Банкноты'
  },
  '10Agorot': {
    en: '10 Agorot',
    he: '10 אגורות',
    ru: '10 Агорот'
  },
  '50Agorot': {
    en: '50 Agorot',
    he: '50 אגורות',
    ru: '50 Агорот'
  },
  '1Shekel': {
    en: '1 Shekel',
    he: 'שקל 1',
    ru: '1 Шекель'
  },
  '2Shekel': {
    en: '2 Shekel',
    he: 'שקל 2',
    ru: '2 Шекеля'
  },
  '5Shekel': {
    en: '5 Shekel',
    he: 'שקל 5',
    ru: '5 Шекелей'
  },
  '10Shekel': {
    en: '10 Shekel',
    he: 'שקל 10',
    ru: '10 Шекелей'
  },
  '20Note': {
    en: '₪20 Note',
    he: 'שטר ₪20',
    ru: 'Банкнота ₪20'
  },
  '50Note': {
    en: '₪50 Note',
    he: 'שטר ₪50',
    ru: 'Банкнота ₪50'
  },
  '100Note': {
    en: '₪100 Note',
    he: 'שטר ₪100',
    ru: 'Банкнота ₪100'
  },
  '200Note': {
    en: '₪200 Note',
    he: 'שטר ₪200',
    ru: 'Банкнота ₪200'
  },
  
  // Totals and calculations
  'coinsSubtotal': {
    en: 'Coins Subtotal',
    he: 'סה״כ מטבעות',
    ru: 'Промежуточный итог по монетам'
  },
  'notesSubtotal': {
    en: 'Notes Subtotal',
    he: 'סה״כ שטרות',
    ru: 'Промежуточный итог по банкнотам'
  },
  'grandTotal': {
    en: 'Grand Total',
    he: 'סה״כ כללי',
    ru: 'Общий итог'
  },
  
  // History
  'savedCalculations': {
    en: 'Saved Calculations',
    he: 'חישובים שמורים',
    ru: 'Сохраненные расчеты'
  },
  'clearAll': {
    en: 'Clear All',
    he: 'נקה הכל',
    ru: 'Очистить все'
  },
  'date': {
    en: 'Date',
    he: 'תאריך',
    ru: 'Дата'
  },
  'total': {
    en: 'Total',
    he: 'סה״כ',
    ru: 'Итого'
  },
  'actions': {
    en: 'Actions',
    he: 'פעולות',
    ru: 'Действия'
  },
  'noHistoryYet': {
    en: 'No History Yet',
    he: 'אין היסטוריה עדיין',
    ru: 'История пока отсутствует'
  },
  'noHistoryDescription': {
    en: 'Your saved calculations will appear here. Click "Save" after counting to add to history.',
    he: 'החישובים השמורים שלך יופיעו כאן. לחץ על "שמור" לאחר הספירה כדי להוסיף להיסטוריה.',
    ru: 'Здесь будут отображаться ваши сохраненные расчеты. Нажмите "Сохранить" после подсчета, чтобы добавить в историю.'
  },
  'confirmClearHistory': {
    en: 'Are you sure you want to clear all history?',
    he: 'האם אתה בטוח שברצונך לנקות את כל ההיסטוריה?',
    ru: 'Вы уверены, что хотите очистить всю историю?'
  },
  'recordDeleted': {
    en: 'Record deleted from history',
    he: 'הרשומה נמחקה מההיסטוריה',
    ru: 'Запись удалена из истории'
  },
  'calculationSaved': {
    en: 'Calculation saved successfully!',
    he: 'החישוב נשמר בהצלחה!',
    ru: 'Расчет успешно сохранен!'
  },
  'calculationRestored': {
    en: 'Calculation restored successfully',
    he: 'החישוב שוחזר בהצלחה',
    ru: 'Расчет успешно восстановлен'
  },
  'counterReset': {
    en: 'Counter reset',
    he: 'המונה אופס',
    ru: 'Счетчик сброшен'
  },
  'madeBy': {
    en: 'Made by Eric Kunin',
    he: 'נוצר על ידי אריק קונין',
    ru: 'Создано Эриком Куниным'
  }
};

// Get translation for a key in specified language
export const getTranslation = (key: string, language: Language): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translations[key][language];
};

// Language context to manage the selected language
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
