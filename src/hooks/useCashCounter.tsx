import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/utils/translations";

// Types
export interface DenominationTotals {
  [key: string]: {
    count: number;
    total: number;
  };
}

export interface HistoryEntry {
  id: string;
  date: string;
  totals: DenominationTotals;
  grandTotal: number;
  coinTotal: number;
  noteTotal: number;
}

const useCashCounter = () => {
  const { t, language } = useLanguage();
  const [totals, setTotals] = useState<DenominationTotals>({});
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [coinTotal, setCoinTotal] = useState<number>(0);
  const [noteTotal, setNoteTotal] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState("counter");
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  
  const STORAGE_KEY = "cash-counter-history";
  const CURRENT_STATE_KEY = "cash-counter-current-state";

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing history from localStorage:", e);
      }
    }

    const savedState = localStorage.getItem(CURRENT_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setTotals(parsedState.totals || {});
      } catch (e) {
        console.error("Error parsing current state from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    let coinsSum = 0;
    let notesSum = 0;
    
    Object.entries(totals).forEach(([key, { total }]) => {
      const denomValue = parseFloat(key);
      if (denomValue < 20) {
        coinsSum += total;
      } else {
        notesSum += total;
      }
    });
    
    setCoinTotal(coinsSum);
    setNoteTotal(notesSum);
    setGrandTotal(coinsSum + notesSum);

    if (Object.keys(totals).length > 0) {
      saveCurrentState();
    }
  }, [totals]);

  const saveCurrentState = () => {
    try {
      const currentState = {
        totals,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Error saving current state to localStorage:", e);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [totals]);

  const handleDenominationChange = (value: number, count: number, total: number) => {
    setTotals(prev => ({
      ...prev,
      [value]: { count, total }
    }));
  };

  const saveToHistory = () => {
    if (grandTotal <= 0) {
      toast.error(t('noAmountToSave') || 'Nothing to save');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(language === 'he' ? 'he-IL' : language === 'ru' ? 'ru-RU' : 'en-US'),
      totals: { ...totals },
      grandTotal,
      coinTotal,
      noteTotal
    };
    
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      toast.success(t('calculationSaved'));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      toast.error("Failed to save calculation");
    }
  };

  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error updating localStorage:", e);
      toast.error("Failed to update history");
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
      toast.error("Failed to clear history");
    }
  };

  const handleReset = () => {
    setTotals({});
    
    setTimeout(() => {
      setResetTrigger(prev => prev + 1);
    }, 10);
    
    try {
      localStorage.removeItem(CURRENT_STATE_KEY);
      toast.info(t('counterReset'));
    } catch (e) {
      console.error("Error removing from localStorage:", e);
    }
  };

  const restoreFromHistory = (entry: HistoryEntry) => {
    setTotals(entry.totals);
    setActiveTab("counter");
    toast.success(t('calculationRestored'));
  };

  return {
    totals,
    grandTotal,
    coinTotal,
    noteTotal,
    history,
    activeTab,
    resetTrigger,
    
    setActiveTab,
    handleDenominationChange,
    saveToHistory,
    deleteHistoryEntry,
    clearAllHistory,
    handleReset,
    restoreFromHistory
  };
};

export default useCashCounter;
