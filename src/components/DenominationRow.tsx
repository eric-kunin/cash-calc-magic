
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DenominationRowProps {
  value: number;
  label: string;
  isCoin: boolean;
  onChange: (amount: number, total: number) => void;
  className?: string;
}

const DenominationRow: React.FC<DenominationRowProps> = ({
  value,
  label,
  isCoin,
  onChange,
  className,
}) => {
  const [count, setCount] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  
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

  const bgColor = isCoin
    ? value < 1 ? "bg-coin-silver" : "bg-coin-gold"
    : value <= 20 ? "bg-note-blue" : "bg-note-purple";

  return (
    <div 
      className={cn(
        "denomination-row",
        className
      )}
      style={{ animationDelay: `${(value * 10) % 200}ms` }}
    >
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white shadow-sm",
          bgColor,
        )}
      >
        {isCoin 
          ? `₪${value.toFixed(value % 1 === 0 ? 0 : 2)}` 
          : `₪${value}`}
      </div>
      <div className="flex-1 flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 min-w-[50px]">
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
                className="money-input"
                aria-label={`Count of ${label}`}
              />
            </div>
            <span className="text-gray-400 px-2">×</span>
            <span className="text-gray-900 font-medium">
              ₪{value.toFixed(value % 1 === 0 ? 0 : 2)}
            </span>
            <span className="text-gray-400 px-2">=</span>
            <span className="text-gray-900 font-medium min-w-[80px] text-right">
              ₪{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DenominationRow;
