
import { useState, useRef, useEffect } from "react";

interface UseDenominationStateProps {
  value: number;
  initialCount: number;
  resetTrigger: number;
  onChange: (value: number, count: number, total: number) => void;
}

export function useDenominationState({
  value, 
  initialCount, 
  resetTrigger,
  onChange
}: UseDenominationStateProps) {
  // Split the count and multiplier state to avoid cross-interference
  const [countInput, setCountInput] = useState<string>(initialCount > 0 ? initialCount.toString() : "0");
  const [multiplierInput, setMultiplierInput] = useState<string>("1");
  const [total, setTotal] = useState<number>(0);
  
  // Use separate refs to track the actual source of changes
  const isCountChangingRef = useRef(false);
  const isMultiplierChangingRef = useRef(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialSyncRef = useRef(true);
  const resetTriggerRef = useRef(resetTrigger);
  
  // Track the last reported values to avoid unnecessary updates
  const lastReportedValues = useRef({
    count: parseInt(countInput) || 0,
    multiplier: parseInt(multiplierInput) || 1,
    total: 0
  });
  
  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger > resetTriggerRef.current) {
      setCountInput("0");
      setMultiplierInput("1");
      setTotal(0);
      lastReportedValues.current = { count: 0, multiplier: 1, total: 0 };
      
      // Explicitly notify parent of zero values after reset
      onChange(value, 0, 0);
    }
    
    // Update the ref to current reset trigger
    resetTriggerRef.current = resetTrigger;
  }, [resetTrigger, value, onChange]);
  
  // Handle initialCount changes from props - only sync from parent when needed
  useEffect(() => {
    // Only update if this is initial sync or a reset was not just triggered
    if (isInitialSyncRef.current && initialCount > 0) {
      setCountInput(initialCount.toString());
      lastReportedValues.current.count = initialCount;
      isInitialSyncRef.current = false;
    }
  }, [initialCount]);
  
  // Calculate the total and notify parent immediately when inputs change
  useEffect(() => {
    // Parse inputs with careful validation
    const count = parseInt(countInput) || 0;
    const multiplier = parseInt(multiplierInput) || 1;
    
    // Calculate new total
    const calculatedTotal = parseFloat((value * count * multiplier).toFixed(2));
    
    // Update local total
    setTotal(calculatedTotal);
    
    // Notify parent of changes immediately for real-time updates
    const effectiveCount = count * multiplier;
    
    // Only notify if values actually changed
    if (effectiveCount !== lastReportedValues.current.count || 
        calculatedTotal !== lastReportedValues.current.total) {
      
      // Update our tracking of reported values
      lastReportedValues.current = {
        count: effectiveCount,
        multiplier,
        total: calculatedTotal
      };
      
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      // Notify parent immediately
      onChange(value, effectiveCount, calculatedTotal);
    }
  }, [countInput, multiplierInput, value, onChange]);
  
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    isCountChangingRef.current = true;
    
    // Allow empty string (for typing) or valid numbers
    if (newValue === '') {
      setCountInput('');
    } else {
      const parsed = parseInt(newValue);
      if (!isNaN(parsed) && parsed <= 9999) {
        setCountInput(newValue);
      }
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isCountChangingRef.current = false;
    }, 50);
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    isMultiplierChangingRef.current = true;
    
    // Allow empty string (for typing) or valid numbers
    if (newValue === '') {
      setMultiplierInput('');
    } else {
      const parsed = parseInt(newValue);
      if (!isNaN(parsed) && parsed <= 999) {
        setMultiplierInput(newValue);
      }
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isMultiplierChangingRef.current = false;
    }, 50);
  };

  const handleCountBlur = () => {
    if (countInput === "") {
      setCountInput("0");
    }
  };

  const handleMultiplierBlur = () => {
    if (multiplierInput === "") {
      setMultiplierInput("1");
    }
  };

  return {
    countInput,
    multiplierInput,
    total,
    handleCountChange,
    handleMultiplierChange,
    handleCountBlur,
    handleMultiplierBlur
  };
}
