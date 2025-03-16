import { useState, useCallback, useRef } from "react";
import { DenominationTotals } from "@/types/cashCounter";
import { useTotalsCalculation } from "./useTotalsCalculation";
import { useHistoryManagement } from "./useHistoryManagement";
import { useCurrentState } from "./useCurrentState";

const useCashCounter = () => {
  const [totals, setTotals] = useState<DenominationTotals>({});
  const [activeTab, setActiveTab] = useState("counter");
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const previousUpdatesRef = useRef<{[key: number]: number}>({});
  
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

  const handleDenominationChange = useCallback((value: number, count: number, total: number) => {
    // Skip updates for invalid values
    if (isNaN(value) || isNaN(count) || count < 0) {
      return;
    }
    
    // Apply reasonable limits
    const safeCount = Math.min(count, 9999);
    
    // Skip if the count hasn't changed from the last update for this denomination
    if (previousUpdatesRef.current[value] === safeCount) {
      return;
    }
    
    // Update our tracking of previous values
    previousUpdatesRef.current[value] = safeCount;
    
    setTotals(prev => {
      // If count is 0, remove this denomination from totals object
      if (safeCount === 0) {
        const newTotals = { ...prev };
        delete newTotals[value];
        return newTotals;
      }
      
      // Check if the value is already in totals with the same count
      if (prev[value]?.count === safeCount) {
        return prev; // No change needed
      }
      
      // Otherwise update or add the denomination
      return {
        ...prev,
        [value]: { 
          count: safeCount, 
          total: total
        }
      };
    });
  }, []);

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
