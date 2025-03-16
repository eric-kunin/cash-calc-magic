
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [total, setTotal] = useState<number>(0);
  
  // Calculate total when count changes
  useEffect(() => {
    const parsedCount = parseInt(count) || 0;
    const calculatedTotal = value * parsedCount;
    setTotal(calculatedTotal);
    onChange(parsedCount, calculatedTotal);
  }, [count, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setCount(newValue);
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
        "denomination-row dark:hover:bg-gray-700/50",
        className
      )}
      style={{ animationDelay: `${(value * 10) % 200}ms` }}
    >
      <div className="flex items-center">
        {image ? (
          <div className="relative mr-3">
            <img 
              src={image} 
              alt={label} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-800 drop-shadow-sm">
                {value.toFixed(value % 1 === 0 ? 0 : 2)}
              </span>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white shadow-sm mr-3",
              bgColor,
            )}
          >
            {isCoin 
              ? `₪${value.toFixed(value % 1 === 0 ? 0 : 2)}` 
              : `₪${value}`}
          </div>
        )}
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px]">
            {label}
          </span>
          <div className="flex-1 flex items-center">
            <div className="flex-1 flex items-center space-x-2">
              <div className="w-full max-w-[90px]">
                <input
                  type="number"
                  value={count}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="money-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  aria-label={`Count of ${label}`}
                />
              </div>
              <span className="text-gray-400 dark:text-gray-500 px-2">×</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                ₪{value.toFixed(value % 1 === 0 ? 0 : 2)}
              </span>
              <span className="text-gray-400 dark:text-gray-500 px-2">=</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium min-w-[80px] text-right">
                ₪{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenominationRow;
