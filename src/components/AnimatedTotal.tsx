
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface AnimatedTotalProps {
  total: number;
  className?: string;
}

const AnimatedTotal: React.FC<AnimatedTotalProps> = ({ total, className }) => {
  const [displayValue, setDisplayValue] = useState<string>(formatCurrency(total));
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  useEffect(() => {
    setIsAnimating(true);
    setDisplayValue(formatCurrency(total));
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [total]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div 
        className={cn(
          "text-3xl md:text-4xl font-bold transition-all duration-300 ease-out text-purple-900 dark:text-purple-200",
          isAnimating ? "transform scale-110 text-purple-600 dark:text-purple-300" : ""
        )}
      >
        {displayValue}
      </div>
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-purple-600 dark:bg-purple-400 rounded-full transition-all duration-500 ease-out",
          isAnimating ? "w-full opacity-100" : "w-0 opacity-0"
        )}
      />
    </div>
  );
};

export default AnimatedTotal;
