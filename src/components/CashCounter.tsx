
import React, { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import DenominationRow from "./DenominationRow";
import AnimatedTotal from "./AnimatedTotal";
import CurrencySymbol from "./CurrencySymbol";
import { formatCurrency } from "@/utils/formatters";

// Define our denominations
const COINS = [
  { value: 0.10, label: "10 Agorot" },
  { value: 0.50, label: "50 Agorot" },
  { value: 1, label: "1 Shekel" },
  { value: 2, label: "2 Shekel" },
  { value: 5, label: "5 Shekel" },
  { value: 10, label: "10 Shekel" },
];

const NOTES = [
  { value: 20, label: "₪20 Note" },
  { value: 50, label: "₪50 Note" },
  { value: 100, label: "₪100 Note" },
  { value: 200, label: "₪200 Note" },
];

interface DenominationState {
  [key: string]: {
    count: number;
    total: number;
  };
}

const CashCounter: React.FC = () => {
  const [totals, setTotals] = useState<DenominationState>({});
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [coinTotal, setCoinTotal] = useState<number>(0);
  const [noteTotal, setNoteTotal] = useState<number>(0);

  // Update the grand total whenever the totals change
  useEffect(() => {
    let coinsSum = 0;
    let notesSum = 0;
    
    // Calculate subtotals
    Object.entries(totals).forEach(([key, { total }]) => {
      const denomValue = parseFloat(key);
      if (denomValue < 20) {
        coinsSum += total;
      } else {
        notesSum += total;
      }
    });
    
    setCoinTotal(coinsSum);
    setNoteTotal(notesSum);
    setGrandTotal(coinsSum + notesSum);
  }, [totals]);

  // Handle changes for a denomination
  const handleDenominationChange = (value: number, count: number, total: number) => {
    setTotals(prev => ({
      ...prev,
      [value]: { count, total }
    }));
  };

  // Handle reset
  const handleReset = () => {
    setTotals({});
  };

  return (
    <div className="max-w-xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <CurrencySymbol className="mr-4" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cash Counter</h1>
            <p className="text-sm text-gray-500">Calculate your cash totals effortlessly</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          Reset
        </button>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 glass-morphism animate-slide-up">
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-8 h-8 rounded-full bg-coin-gold flex items-center justify-center mr-2">
                <span className="text-white font-bold">₪</span>
              </span>
              Coins
            </h2>
          </div>
          {COINS.map((coin) => (
            <DenominationRow
              key={`coin-${coin.value}`}
              value={coin.value}
              label={coin.label}
              isCoin={true}
              onChange={(count, total) => 
                handleDenominationChange(coin.value, count, total)
              }
              className="animate-slide-up"
            />
          ))}
          <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
            <div className="text-right">
              <div className="text-sm text-gray-500">Coins Subtotal</div>
              <div className="text-lg font-semibold">
                {formatCurrency(coinTotal)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-5 glass-morphism animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-8 h-8 rounded-full bg-note-purple flex items-center justify-center mr-2">
                <span className="text-white font-bold">₪</span>
              </span>
              Notes
            </h2>
          </div>
          {NOTES.map((note) => (
            <DenominationRow
              key={`note-${note.value}`}
              value={note.value}
              label={note.label}
              isCoin={false}
              onChange={(count, total) => 
                handleDenominationChange(note.value, count, total)
              }
              className="animate-slide-up"
            />
          ))}
          <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
            <div className="text-right">
              <div className="text-sm text-gray-500">Notes Subtotal</div>
              <div className="text-lg font-semibold">
                {formatCurrency(noteTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="rounded-2xl p-6 bg-gradient-to-r from-money-light to-accent shadow-sm border border-accent animate-slide-up" 
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-money-dark mb-1">Grand Total</h2>
            <AnimatedTotal total={grandTotal} />
          </div>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
            <Calculator size={24} />
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-8 mb-4">
        Built with 💚 for cashiers everywhere
      </div>
    </div>
  );
};

export default CashCounter;
