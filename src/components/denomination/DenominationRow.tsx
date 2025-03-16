
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
  const [countInput, setCountInput] = useState<string>(initialCount > 0 ? initialCount.toString() : "0");
  const [multiplierInput, setMultiplierInput] = useState<string>("1");
  const [total, setTotal] = useState<number>(0);
  const updateInProgressRef = useRef(false);
  const lastNotifiedValuesRef = useRef({ count: 0, multiplier: 1 });
  
  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      setCountInput("0");
      setMultiplierInput("1");
      setTotal(0);
    }
  }, [resetTrigger]);
  
  // Handle initialCount changes from props - only sync from parent when needed
  useEffect(() => {
    // Only update if we're not currently editing and value is different
    if (resetTrigger === 0 && 
        initialCount > 0 && 
        initialCount.toString() !== countInput && 
        !updateInProgressRef.current) {
      setCountInput(initialCount.toString());
    }
  }, [initialCount, resetTrigger, countInput]);
  
  // Calculate total and notify parent
  useEffect(() => {
    // Parse inputs with careful validation
    const numCount = countInput === "" ? 0 : Math.min(parseInt(countInput) || 0, 9999);
    const numMultiplier = multiplierInput === "" ? 1 : Math.min(parseInt(multiplierInput) || 1, 999);
    
    // Calculate new total
    const calculatedTotal = parseFloat((value * numCount * numMultiplier).toFixed(2));
    
    // Only update local total if it's different
    if (total !== calculatedTotal) {
      setTotal(calculatedTotal);
    }
    
    // Check if we need to notify parent of changes
    const newCount = numCount * numMultiplier;
    if (lastNotifiedValuesRef.current.count !== newCount) {
      // Set flag to prevent initialCount from overriding our value during the update
      updateInProgressRef.current = true;
      
      // Use debounced approach to notify parent
      const notifyTimeout = setTimeout(() => {
        lastNotifiedValuesRef.current = { 
          count: newCount, 
          multiplier: numMultiplier 
        };
        onChange(value, newCount, calculatedTotal);
        updateInProgressRef.current = false;
      }, 100);
      
      return () => clearTimeout(notifyTimeout);
    }
  }, [countInput, multiplierInput, value, onChange, total]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Allow empty string (for typing) or valid numbers
    if (newValue === '') {
      setCountInput('');
    } else {
      const parsed = parseInt(newValue);
      if (!isNaN(parsed) && parsed <= 9999) {
        setCountInput(newValue);
      }
    }
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Allow empty string (for typing) or valid numbers
    if (newValue === '') {
      setMultiplierInput('');
    } else {
      const parsed = parseInt(newValue);
      if (!isNaN(parsed) && parsed <= 999) {
        setMultiplierInput(newValue);
      }
    }
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
