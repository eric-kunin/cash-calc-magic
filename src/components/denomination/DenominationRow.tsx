
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
  const isUpdatingRef = useRef(false);
  
  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      setCountInput("0");
      setMultiplierInput("1");
      setTotal(0);
    }
  }, [resetTrigger]);
  
  // Handle initialCount changes only when component receives new props
  useEffect(() => {
    if (resetTrigger === 0 && 
        initialCount > 0 && 
        initialCount.toString() !== countInput && 
        !isUpdatingRef.current) {
      setCountInput(initialCount.toString());
    }
  }, [initialCount, resetTrigger, countInput]);
  
  // Calculate total but don't call onChange from this effect
  useEffect(() => {
    const numCount = countInput === "" ? 0 : Math.min(parseInt(countInput) || 0, 9999);
    const numMultiplier = multiplierInput === "" ? 1 : Math.min(parseInt(multiplierInput) || 1, 999);
    
    const calculatedTotal = parseFloat((value * numCount * numMultiplier).toFixed(2));
    setTotal(calculatedTotal);
  }, [countInput, multiplierInput, value]);

  // Separate effect to notify parent with debounce to break circular updates
  useEffect(() => {
    if (isUpdatingRef.current) return;

    const numCount = countInput === "" ? 0 : Math.min(parseInt(countInput) || 0, 9999);
    const numMultiplier = multiplierInput === "" ? 1 : Math.min(parseInt(multiplierInput) || 1, 999);
    const calculatedTotal = parseFloat((value * numCount * numMultiplier).toFixed(2));
    
    // Use a timeout to break the synchronous update cycle
    const timeoutId = setTimeout(() => {
      isUpdatingRef.current = true;
      onChange(value, numCount * numMultiplier, calculatedTotal);
      isUpdatingRef.current = false;
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [total, value, onChange]);

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
