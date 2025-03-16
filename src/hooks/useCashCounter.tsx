
import { useState } from "react";
import { DenominationTotals } from "@/types/cashCounter";
import { useTotalsCalculation } from "./useTotalsCalculation";
import { useHistoryManagement } from "./useHistoryManagement";
import { useCurrentState } from "./useCurrentState";

const useCashCounter = () => {
  const [totals, setTotals] = useState<DenominationTotals>({});
  const [activeTab, setActiveTab] = useState("counter");
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  
  // Calculate totals based on denominations
  const { grandTotal, coinTotal, noteTotal } = useTotalsCalculation(totals);
  
  // Handle current state (persistence between sessions)
  const { handleReset } = useCurrentState(totals, setTotals, resetTrigger, setResetTrigger);
  
  // Handle history management
  const { 
    history, 
    saveToHistory, 
    deleteHistoryEntry, 
    clearAllHistory, 
    restoreFromHistory 
  } = useHistoryManagement({
    setTotals,
    setActiveTab,
    grandTotal,
    coinTotal,
    noteTotal,
    totals
  });

  const handleDenominationChange = (value: number, count: number, total: number) => {
    // Basic validation to prevent unreasonable values
    if (count > 9999 || isNaN(count)) {
      count = 0;
    }
    
    // Make sure total is consistent with the value and count
    // This calculation acts as a safeguard against inconsistent values
    const calculatedTotal = parseFloat((value * count).toFixed(2));
    
    setTotals(prev => ({
      ...prev,
      [value]: { 
        count: count, 
        total: calculatedTotal 
      }
    }));
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
export type { DenominationTotals, HistoryEntry } from "@/types/cashCounter";
