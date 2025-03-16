
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
    // Skip updates for invalid values
    if (isNaN(value) || isNaN(count) || count < 0) {
      return;
    }
    
    // Apply reasonable limits
    const safeCount = Math.min(count, 9999);
    
    setTotals(prev => {
      // Check if the new value is same as current to prevent unnecessary updates
      const currentCount = prev[value]?.count;
      if (currentCount === safeCount) {
        return prev; // No change needed
      }
      
      // If count is 0, remove this denomination from totals object
      if (safeCount === 0) {
        const newTotals = { ...prev };
        delete newTotals[value];
        return newTotals;
      }
      
      // Otherwise update or add the denomination
      return {
        ...prev,
        [value]: { 
          count: safeCount, 
          total: total // Use the calculated total that's passed in
        }
      };
    });
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
