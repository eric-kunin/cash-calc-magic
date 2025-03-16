
import React from "react";
import { Input } from "../ui/input";
import { formatCurrency } from "@/utils/formatters";
import { useLanguage } from "@/utils/translations";

interface DenominationInputsProps {
  countInput: string;
  multiplierInput: string;
  value: number;
  label: string;
  handleCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMultiplierChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountBlur: () => void;
  onMultiplierBlur: () => void;
  total: number;
}

const DenominationInputs: React.FC<DenominationInputsProps> = ({
  countInput,
  multiplierInput,
  value,
  label,
  handleCountChange,
  handleMultiplierChange,
  onCountBlur,
  onMultiplierBlur,
  total,
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
      <div className="w-10 sm:w-12">
        <Input
          type="text"
          inputMode="numeric"
          value={countInput}
          onChange={handleCountChange}
          placeholder="0"
          className="money-input text-center py-0 px-1 h-7 sm:h-8 text-xs"
          aria-label={`Count of ${label}`}
          onBlur={onCountBlur}
        />
      </div>
      <span className="text-gray-400 dark:text-gray-500 text-xs">×</span>
      <div className="w-10 sm:w-12">
        <Input
          type="text"
          inputMode="numeric"
          value={multiplierInput}
          onChange={handleMultiplierChange}
          placeholder="1"
          className="money-input text-center py-0 px-1 h-7 sm:h-8 text-xs"
          aria-label={`Multiplier for ${label}`}
          onBlur={onMultiplierBlur}
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
  );
};

export default DenominationInputs;
