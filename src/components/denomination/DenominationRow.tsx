
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
  const skipEffectRef = useRef(false);
  const prevValuesRef = useRef({ count: countInput, multiplier: multiplierInput });
  
  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      setCountInput("0");
      setMultiplierInput("1");
      setTotal(0);
    }
  }, [resetTrigger]);
  
  // Handle initialCount changes from props - only when needed
  useEffect(() => {
    if (resetTrigger === 0 && 
        initialCount > 0 && 
        initialCount.toString() !== countInput && 
        !skipEffectRef.current) {
      setCountInput(initialCount.toString());
    }
  }, [initialCount, resetTrigger, countInput]);
  
  // Calculate total internally only - no parent notification here
  useEffect(() => {
    // Skip if values haven't changed to avoid needless recalculations
    if (prevValuesRef.current.count === countInput && 
        prevValuesRef.current.multiplier === multiplierInput) {
      return;
    }
    
    // Update previous values reference
    prevValuesRef.current = { count: countInput, multiplier: multiplierInput };
    
    const numCount = countInput === "" ? 0 : Math.min(parseInt(countInput) || 0, 9999);
    const numMultiplier = multiplierInput === "" ? 1 : Math.min(parseInt(multiplierInput) || 1, 999);
    const calculatedTotal = parseFloat((value * numCount * numMultiplier).toFixed(2));
    
    setTotal(calculatedTotal);
    
    // Set skipEffect flag to prevent total recalculation from triggering initialCount effect
    skipEffectRef.current = true;
    
    // Debounce to notify parent of changes, preventing update loops
    const notifyTimeout = setTimeout(() => {
      onChange(value, numCount * numMultiplier, calculatedTotal);
      skipEffectRef.current = false;
    }, 50);
    
    return () => clearTimeout(notifyTimeout);
  }, [countInput, multiplierInput, value, onChange]);

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
