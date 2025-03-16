
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import DenominationIcon from "./DenominationIcon";
import DenominationInputs from "./DenominationInputs";

interface DenominationRowProps {
  value: number;
  label: string;
  isCoin: boolean;
  image?: string;
  onChange: (value: number, count: number, total: number) => void;
  className?: string;
  colorScheme?: "green" | "purple";
  initialCount?: number;
  resetTrigger?: number;
}

const DenominationRow: React.FC<DenominationRowProps> = ({
  value,
  label,
  isCoin,
  image,
  onChange,
  className,
  colorScheme = "green",
  initialCount = 0,
  resetTrigger = 0,
}) => {
  // Split the count and multiplier state to avoid cross-interference
  const [countInput, setCountInput] = useState<string>(initialCount > 0 ? initialCount.toString() : "0");
  const [multiplierInput, setMultiplierInput] = useState<string>("1");
  const [total, setTotal] = useState<number>(0);
  
  // Use separate refs to track the actual source of changes
  const isCountChangingRef = useRef(false);
  const isMultiplierChangingRef = useRef(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialSyncRef = useRef(true);
  
  // Track the last reported values to avoid unnecessary updates
  const lastReportedValues = useRef({
    count: parseInt(countInput) || 0,
    multiplier: parseInt(multiplierInput) || 1,
    total: 0
  });
  
  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      setCountInput("0");
      setMultiplierInput("1");
      setTotal(0);
      lastReportedValues.current = { count: 0, multiplier: 1, total: 0 };
    }
  }, [resetTrigger]);
  
  // Handle initialCount changes from props - only sync from parent when needed
  useEffect(() => {
    // Only update if this is initial sync or a reset was triggered
    if ((isInitialSyncRef.current || resetTrigger > 0) && initialCount > 0) {
      setCountInput(initialCount.toString());
      lastReportedValues.current.count = initialCount;
      isInitialSyncRef.current = false;
    }
  }, [initialCount, resetTrigger]);
  
  // Calculate the total only when inputs change - this doesn't notify the parent
  useEffect(() => {
    // Parse inputs with careful validation
    const count = parseInt(countInput) || 0;
    const multiplier = parseInt(multiplierInput) || 1;
    
    // Calculate new total
    const calculatedTotal = parseFloat((value * count * multiplier).toFixed(2));
    
    // Only update local total if it's different
    if (total !== calculatedTotal) {
      setTotal(calculatedTotal);
    }
  }, [countInput, multiplierInput, value]);
  
  // Separate effect only for notifying the parent of changes
  useEffect(() => {
    // Skip if we're resetting or during initial sync
    if (resetTrigger > 0 || isInitialSyncRef.current) {
      return;
    }
    
    const notifyParent = () => {
      const count = parseInt(countInput) || 0;
      const multiplier = parseInt(multiplierInput) || 1;
      const newTotal = value * count * multiplier;
      const effectiveCount = count * multiplier;
      
      // Only notify if values actually changed
      if (effectiveCount !== lastReportedValues.current.count ||
          newTotal !== lastReportedValues.current.total) {
        
        // Update our tracking of reported values
        lastReportedValues.current = {
          count: effectiveCount,
          multiplier,
          total: newTotal
        };
        
        // Notify the parent component
        onChange(value, effectiveCount, newTotal);
      }
    };
    
    // Clear any existing timeout to prevent multiple notifications
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    // Delay notification to batch updates and break cycles
    notificationTimeoutRef.current = setTimeout(notifyParent, 300);
    
    // Cleanup
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [total, value, onChange, countInput, multiplierInput, resetTrigger]);
  
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

  return (
    <div 
      className={cn(
        "denomination-row p-2 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors",
        className
      )}
    >
      <div className="flex items-center">
        <DenominationIcon 
          value={value} 
          isCoin={isCoin} 
          image={image} 
          colorScheme={colorScheme} 
        />
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </div>
          <DenominationInputs 
            countInput={countInput}
            multiplierInput={multiplierInput}
            value={value}
            label={label}
            handleCountChange={handleCountChange}
            handleMultiplierChange={handleMultiplierChange}
            onCountBlur={handleCountBlur}
            onMultiplierBlur={handleMultiplierBlur}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default DenominationRow;
