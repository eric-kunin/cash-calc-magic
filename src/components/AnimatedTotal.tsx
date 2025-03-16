
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTotalProps {
  total: number;
  className?: string;
}

const AnimatedTotal: React.FC<AnimatedTotalProps> = ({ total, className }) => {
  const [displayValue, setDisplayValue] = useState<string>(formatCurrency(total));
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  
  useEffect(() => {
    setIsAnimating(true);
    setDisplayValue(formatCurrency(total));
    setKey(prev => prev + 1);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [total]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-200",
            isAnimating ? "text-purple-600 dark:text-purple-300" : ""
          )}
        >
          {displayValue}
        </motion.div>
      </AnimatePresence>
      
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isAnimating ? "100%" : "0%",
          opacity: isAnimating ? 1 : 0
        }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
};

export default AnimatedTotal;
