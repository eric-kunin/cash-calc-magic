
import React from 'react';
import { cn } from '@/lib/utils';

interface CurrencySymbolProps {
  className?: string;
}

const CurrencySymbol: React.FC<CurrencySymbolProps> = ({ className }) => {
  return (
    <div className={cn("animate-float", className)}>
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <div className="absolute inset-0 bg-money-light rounded-full shadow-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-bold text-money-green">₪</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-coin-gold rounded-full shadow-sm animate-pulse-subtle" />
      </div>
    </div>
  );
};

export default CurrencySymbol;
