
import { useState } from "react";
import { toast } from "sonner";
import { HistoryEntry, DenominationTotals } from "@/types/cashCounter";
import { useLocalStorage } from "./useLocalStorage";
import { useLanguage } from "@/utils/translations";

interface UseHistoryManagementProps {
  setTotals: React.Dispatch<React.SetStateAction<DenominationTotals>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  grandTotal: number;
  coinTotal: number;
  noteTotal: number;
  totals: DenominationTotals;
}

export const useHistoryManagement = ({
  setTotals,
  setActiveTab,
  grandTotal,
  coinTotal,
  noteTotal,
  totals
}: UseHistoryManagementProps) => {
  const { t, language } = useLanguage();
  const STORAGE_KEY = "cash-counter-history";
  
  const [storedHistory, setStoredHistory, _] = useLocalStorage<HistoryEntry[]>(STORAGE_KEY, []);
  const [history, setHistory] = useState<HistoryEntry[]>(storedHistory || []);
  
  // Update local state when storedHistory changes
  useState(() => {
    if (storedHistory) {
      setHistory(storedHistory);
    }
  });

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
      setStoredHistory(updatedHistory);
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
      setStoredHistory(updatedHistory);
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

  const restoreFromHistory = (entry: HistoryEntry) => {
    setTotals(entry.totals);
    setActiveTab("counter");
    toast.success(t('calculationRestored'));
  };

  return {
    history,
    saveToHistory,
    deleteHistoryEntry,
    clearAllHistory,
    restoreFromHistory
  };
};
