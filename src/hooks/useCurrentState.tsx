
import { useEffect } from "react";
import { DenominationTotals } from "@/types/cashCounter";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";
import { useLanguage } from "@/utils/translations";

interface CurrentState {
  totals: DenominationTotals;
  timestamp: string;
}

export const useCurrentState = (
  totals: DenominationTotals,
  setTotals: React.Dispatch<React.SetStateAction<DenominationTotals>>,
  resetTrigger: number,
  setResetTrigger: React.Dispatch<React.SetStateAction<number>>
) => {
  const { t } = useLanguage();
  const CURRENT_STATE_KEY = "cash-counter-current-state";
  
  const [storedState, setStoredState, removeStoredState] = 
    useLocalStorage<CurrentState>(CURRENT_STATE_KEY);
  
  // Initialize from stored state
  useEffect(() => {
    if (storedState && Object.keys(totals).length === 0 && resetTrigger === 0) {
      setTotals(storedState.totals || {});
    }
  }, [storedState]);
  
  // Save current state when totals change
  useEffect(() => {
    if (Object.keys(totals).length > 0) {
      saveCurrentState();
    }
  }, [totals]);
  
  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [totals]);
  
  const saveCurrentState = () => {
    try {
      const currentState = {
        totals,
        timestamp: new Date().toISOString()
      };
      setStoredState(currentState);
    } catch (e) {
      console.error("Error saving current state to localStorage:", e);
    }
  };
  
  const handleReset = () => {
    // First clear the totals state
    setTotals({});
    removeStoredState();
    
    // Then trigger reset in child components
    setTimeout(() => {
      setResetTrigger(prev => prev + 1);
      toast.info(t('counterReset'));
    }, 10);
  };
  
  return {
    handleReset
  };
};
