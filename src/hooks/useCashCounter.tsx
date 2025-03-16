
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
    // Ensure values are valid numbers and prevent large/unexpected numbers
    const safeCount = isNaN(count) ? 0 : Math.min(9999, Math.max(0, count));
    
    // Format total with 2 decimal places to avoid floating point errors
    let safeTotal = isNaN(total) ? 0 : total;
    safeTotal = parseFloat(safeTotal.toFixed(2));
    
    // Detect and prevent unreasonably large totals (sanity check)
    if (safeTotal > 1000000000) {
      safeTotal = 0;
    }
    
    setTotals(prev => ({
      ...prev,
      [value]: { 
        count: safeCount, 
        total: safeTotal 
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
