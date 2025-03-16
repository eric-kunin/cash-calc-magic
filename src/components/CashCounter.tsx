
import React, { useEffect, useState } from "react";
import { Calculator, Coins, Receipt, History } from "lucide-react";
import DenominationRow from "./DenominationRow";
import AnimatedTotal from "./AnimatedTotal";
import CurrencySymbol from "./CurrencySymbol";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryDisplay from "./HistoryDisplay";
import { Toaster, toast } from "sonner";

// Define our denominations
const COINS = [
  { value: 0.10, label: "10 Agorot", image: "/lovable-uploads/68c94da5-4b33-4d60-aca7-7c2d4e81841a.png" },
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

interface HistoryEntry {
  id: string;
  date: string;
  totals: DenominationState;
  grandTotal: number;
  coinTotal: number;
  noteTotal: number;
}

const STORAGE_KEY = "cash-counter-history";
const CURRENT_STATE_KEY = "cash-counter-current-state";

const CashCounter: React.FC = () => {
  const [totals, setTotals] = useState<DenominationState>({});
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [coinTotal, setCoinTotal] = useState<number>(0);
  const [noteTotal, setNoteTotal] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState("counter");

  // Load history and current state from localStorage on component mount
  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing history from localStorage:", e);
      }
    }

    // Load current state
    const savedState = localStorage.getItem(CURRENT_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setTotals(parsedState.totals || {});
        // Don't need to set grandTotal, coinTotal, or noteTotal as they will be calculated in the next useEffect
      } catch (e) {
        console.error("Error parsing current state from localStorage:", e);
      }
    }
  }, []);

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

    // Save current state to localStorage when it changes
    if (Object.keys(totals).length > 0) {
      saveCurrentState();
    }
  }, [totals]);

  // Save current state to localStorage
  const saveCurrentState = () => {
    try {
      const currentState = {
        totals,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.error("Error saving current state to localStorage:", e);
    }
  };

  // Add event listener for beforeunload to save state when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [totals]);

  // Handle changes for a denomination
  const handleDenominationChange = (value: number, count: number, total: number) => {
    setTotals(prev => ({
      ...prev,
      [value]: { count, total }
    }));
  };

  // Handle save to history
  const saveToHistory = () => {
    if (grandTotal === 0) return; // Don't save empty calculations
    
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      totals: { ...totals },
      grandTotal,
      coinTotal,
      noteTotal
    };
    
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      toast.success("Calculation saved successfully!");
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      toast.error("Failed to save calculation");
    }
  };

  // Handle delete history entry
  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    
    // Update localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error updating localStorage:", e);
      toast.error("Failed to update history");
    }
  };

  // Handle clear all history
  const clearAllHistory = () => {
    setHistory([]);
    
    // Clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
      toast.error("Failed to clear history");
    }
  };

  // Handle reset
  const handleReset = () => {
    setTotals({});
    localStorage.removeItem(CURRENT_STATE_KEY);
    toast.info("Counter reset");
  };

  // Handle restore from history
  const restoreFromHistory = (entry: HistoryEntry) => {
    setTotals(entry.totals);
    setActiveTab("counter");
    toast.success("Calculation restored successfully");
  };

  return (
    <div className="max-w-xl mx-auto p-4 animate-fade-in">
      <Toaster position="top-center" richColors />
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <CurrencySymbol className="mr-4" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Cash Counter</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calculate your cash totals effortlessly</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={saveToHistory}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            disabled={grandTotal === 0}
          >
            Save
          </button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full mb-6 bg-purple-100 dark:bg-gray-800">
          <TabsTrigger 
            value="counter" 
            className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Calculator size={16} className="mr-2" />
            Counter
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <History size={16} className="mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="counter" className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 glass-morphism dark:glass-morphism-dark animate-slide-up"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                  <Coins size={18} className="text-white" />
                </span>
                <span className="text-gray-900 dark:text-gray-100">Coins</span>
              </h2>
            </div>
            {COINS.map((coin, index) => (
              <DenominationRow
                key={`coin-${coin.value}`}
                value={coin.value}
                label={coin.label}
                isCoin={true}
                image={coin.image}
                onChange={(count, total) => 
                  handleDenominationChange(coin.value, count, total)
                }
                initialCount={totals[coin.value]?.count || 0}
                className="animate-slide-up"
                colorScheme="purple"
              />
            ))}
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Coins Subtotal</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(coinTotal)}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 glass-morphism dark:glass-morphism-dark"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-2">
                  <Receipt size={18} className="text-white" />
                </span>
                <span className="text-gray-900 dark:text-gray-100">Notes</span>
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
                initialCount={totals[note.value]?.count || 0}
                className="animate-slide-up"
                colorScheme="purple"
              />
            ))}
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Notes Subtotal</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(noteTotal)}
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="history">
          <HistoryDisplay 
            history={history} 
            onDelete={deleteHistoryEntry} 
            onRestore={restoreFromHistory}
            onClearAll={clearAllHistory}
          />
        </TabsContent>
      </Tabs>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl p-6 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 shadow-sm border border-purple-200 dark:border-purple-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">Grand Total</h2>
            <AnimatedTotal total={grandTotal} />
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <Calculator size={24} />
          </div>
        </div>
      </motion.div>
      
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8 mb-4">
        Built with 💜 for cashiers everywhere
      </div>
    </div>
  );
};

export default CashCounter;
