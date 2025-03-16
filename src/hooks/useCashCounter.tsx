
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
    // Validate the count (should already be validated in the component)
    if (count > 9999) {
      count = 9999;
    }
    
    // Calculate total directly from value and count to ensure consistency
    const calculatedTotal = parseFloat((value * count).toFixed(2));
    
    setTotals(prev => ({
      ...prev,
      [value]: { 
        count, 
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
