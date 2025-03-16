
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

interface DenominationRowProps {
  value: number;
  label: string;
  isCoin: boolean;
  image?: string;
  onChange: (amount: number, total: number) => void;
  className?: string;
  colorScheme?: "green" | "purple";
  initialCount?: number; // Added initialCount prop
}

const DenominationRow: React.FC<DenominationRowProps> = ({
  value,
  label,
  isCoin,
  image,
  onChange,
  className,
  colorScheme = "green",
  initialCount = 0, // Default to 0
}) => {
  const [count, setCount] = useState<string>(initialCount.toString());
  const [multiplier, setMultiplier] = useState<string>("1");
  const [total, setTotal] = useState<number>(0);
  
  // Calculate total when count or multiplier changes
  useEffect(() => {
    const parsedCount = parseInt(count) || 0;
    const parsedMultiplier = parseInt(multiplier) || 1;
    const calculatedTotal = value * parsedCount * parsedMultiplier;
    setTotal(calculatedTotal);
    onChange(parsedCount * parsedMultiplier, calculatedTotal);
  }, [count, multiplier, value, onChange]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setCount(newValue);
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setMultiplier(newValue === '' ? '1' : newValue);
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
    <div 
      className={cn(
        "denomination-row p-2 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors",
        className
      )}
      style={{ animationDelay: `${(value * 10) % 200}ms` }}
    >
      <div className="flex items-center">
        {image ? (
          <div className="relative mr-2 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12">
            <img 
              src={image} 
              alt={label} 
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-gray-800 drop-shadow-sm">
                {value.toFixed(value % 1 === 0 ? 0 : 2)}
              </span>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white shadow-sm mr-2 sm:mr-3",
              bgColor,
            )}
          >
            <span className="text-xs sm:text-sm">
              {isCoin 
                ? `₪${value.toFixed(value % 1 === 0 ? 0 : 2)}` 
                : `₪${value}`}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <div className="w-14 sm:w-16">
              <Input
                type="text"
                inputMode="numeric"
                value={count}
                onChange={handleCountChange}
                placeholder="0"
                className="money-input text-center py-0 px-1 h-7 sm:h-8 text-xs sm:text-sm"
                aria-label={`Count of ${label}`}
              />
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">×</span>
            <div className="w-14 sm:w-16">
              <Input
                type="text"
                inputMode="numeric"
                value={multiplier}
                onChange={handleMultiplierChange}
                placeholder="1"
                className="money-input text-center py-0 px-1 h-7 sm:h-8 text-xs sm:text-sm"
                aria-label={`Multiplier for ${label}`}
              />
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">×</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-xs sm:text-sm whitespace-nowrap">
              ₪{value.toFixed(value % 1 === 0 ? 0 : 2)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">=</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-xs sm:text-sm whitespace-nowrap ml-auto">
              ₪{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenominationRow;
