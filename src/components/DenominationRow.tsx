
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { motion } from "framer-motion";

interface DenominationRowProps {
  value: number;
  label: string;
  isCoin: boolean;
  image?: string;
  onChange: (amount: number, total: number) => void;
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
  const [count, setCount] = useState<string>(initialCount.toString());
  const [multiplier, setMultiplier] = useState<string>("1");
  const [total, setTotal] = useState<number>(0);
  
  // Reset fields when resetTrigger changes, preventing flicker
  useEffect(() => {
    if (resetTrigger > 0) {
      // Directly set to initial values without causing a UI flicker
      setCount("0");
      setMultiplier("1");
    }
  }, [resetTrigger]);
  
  // Update when initialCount changes but not on reset
  useEffect(() => {
    if (resetTrigger === 0) {
      setCount(initialCount.toString());
    }
  }, [initialCount]);
  
  // Calculate total when count or multiplier changes
  useEffect(() => {
    // Convert empty strings to default values for calculation
    const parsedCount = count === "" ? 0 : parseInt(count) || 0;
    const parsedMultiplier = multiplier === "" ? 1 : parseInt(multiplier) || 1;
    
    // Calculate the total with fixed precision to avoid floating point errors
    const calculatedTotal = parseFloat((value * parsedCount * parsedMultiplier).toFixed(2));
    setTotal(calculatedTotal);
    onChange(parsedCount * parsedMultiplier, calculatedTotal);
  }, [count, multiplier, value, onChange]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input and empty string
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setCount(newValue);
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input and empty string
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    // Use "1" as default if empty
    setMultiplier(newValue === "" ? "1" : newValue);
  };

  // Color scheme variants
  const getBgColor = () => {
    if (colorScheme === "purple") {
      if (isCoin) {
        return value < 1 
          ? "bg-purple-300 dark:bg-purple-700" 
          : "bg-purple-400 dark:bg-purple-600";
      } else {
        return value <= 50 
          ? "bg-purple-600 dark:bg-purple-500" 
          : "bg-purple-700 dark:bg-purple-400";
      }
    } else {
      if (isCoin) {
        return value < 1 ? "bg-coin-silver" : "bg-coin-gold";
      } else {
        return value <= 20 ? "bg-note-blue" : "bg-note-purple";
      }
    }
  };

  const bgColor = getBgColor();

  return (
    <motion.div 
      className={cn(
        "denomination-row p-2 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: value * 0.04 }}
      style={{ animationDelay: `${(value * 10) % 200}ms` }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center">
        {image ? (
          <div className="relative mr-2 flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11">
            <motion.img 
              src={image} 
              alt={label} 
              className={cn(
                "w-full h-full object-contain rounded-full border-2 shadow-sm", 
                isCoin ? "border-yellow-300" : "border-blue-300"
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </div>
        ) : (
          <motion.div 
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white shadow-sm mr-2",
              bgColor,
            )}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-xs">
              {isCoin 
                ? `₪${value.toFixed(value % 1 === 0 ? 0 : 2)}` 
                : `₪${value}`}
            </span>
          </motion.div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <div className="w-10 sm:w-12">
              <Input
                type="text"
                inputMode="numeric"
                value={count}
                onChange={handleCountChange}
                placeholder="0"
                className="money-input text-center py-0 px-1 h-7 sm:h-8 text-xs"
                aria-label={`Count of ${label}`}
              />
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs">×</span>
            <div className="w-10 sm:w-12">
              <Input
                type="text"
                inputMode="numeric"
                value={multiplier}
                onChange={handleMultiplierChange}
                placeholder="1"
                className="money-input text-center py-0 px-1 h-7 sm:h-8 text-xs"
                aria-label={`Multiplier for ${label}`}
              />
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs">×</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-xs whitespace-nowrap">
              ₪{value.toFixed(value % 1 === 0 ? 0 : 2)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">=</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-xs whitespace-nowrap ml-auto">
              ₪{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DenominationRow;
