
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CurrencySymbolProps {
  className?: string;
}

const CurrencySymbol: React.FC<CurrencySymbolProps> = ({ className }) => {
  return (
    <motion.div 
      className={cn(className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
        <motion.div 
          className="absolute inset-0 bg-purple-100 dark:bg-purple-800 rounded-full shadow-sm" 
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-200"
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            ₪
          </motion.span>
        </div>
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 dark:bg-purple-300 rounded-full shadow-sm"
          animate={{ 
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity
          }}
        />
      </div>
    </motion.div>
  );
};

export default CurrencySymbol;
