
import React from "react";
import { cn } from "@/lib/utils";
import DenominationIcon from "./DenominationIcon";
import DenominationInputs from "./DenominationInputs";
import { useDenominationState } from "./hooks/useDenominationState";

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
  const {
    countInput,
    multiplierInput,
    total,
    handleCountChange,
    handleMultiplierChange,
    handleCountBlur,
    handleMultiplierBlur
  } = useDenominationState({
    value,
    initialCount,
    resetTrigger,
    onChange
  });

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
