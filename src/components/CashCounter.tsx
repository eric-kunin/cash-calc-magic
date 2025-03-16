import React, { useEffect, useState } from "react";
import { Calculator, Coins, Receipt, History, RefreshCcw, Save } from "lucide-react";
import DenominationRow from "./DenominationRow";
import AnimatedTotal from "./AnimatedTotal";
import CurrencySymbol from "./CurrencySymbol";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryDisplay from "./HistoryDisplay";
import { toast } from "sonner";
import { Button } from "./ui/button";

const COINS = [
  { value: 0.10, label: "10 Agorot", image: "/lovable-uploads/29d9897e-e276-43ce-9d8e-e908d3f1be27.png" },
  { value: 0.50, label: "50 Agorot", image: "/lovable-uploads/5015f44e-5e08-407c-a23d-42ed6dc42401.png" },
  { value: 1, label: "1 Shekel", image: "/lovable-uploads/639999d8-f0f3-4bbb-8fc9-a040412b6dc5.png" },
  { value: 2, label: "2 Shekel", image: "/lovable-uploads/43ff1416-5eb2-403f-ac30-4cf3d01bb0c1.png" },
  { value: 5, label: "5 Shekel", image: "/lovable-uploads/e53c39a9-d94a-4348-a899-b96b6f925616.png" },
  { value: 10, label: "10 Shekel", image: "/lovable-uploads/f83c66d7-e502-4ad0-a4b0-1cc2502ef7bf.png" },
];

const NOTES = [
  { value: 20, label: "₪20 Note", image: "/lovable-uploads/232c4beb-07a5-42f0-a3fb-39efe6cacdd6.png" },
  { value: 50, label: "₪50 Note", image: "/lovable-uploads/8c86f073-89f2-4b82-942c-5e46f0a7ed54.png" },
  { value: 100, label: "₪100 Note", image: "/lovable-uploads/12384e86-2021-4796-b631-10a1ea264d03.png" },
  { value: 200, label: "₪200 Note", image: "/public/lovable-uploads/8c86f073-89f2-4b82-942c-5e46f0a7ed54.png" },
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

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing history from localStorage:", e);
      }
    }

    const savedState = localStorage.getItem(CURRENT_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setTotals(parsedState.totals || {});
      } catch (e) {
        console.error("Error parsing current state from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    let coinsSum = 0;
    let notesSum = 0;
    
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

    if (Object.keys(totals).length > 0) {
      saveCurrentState();
    }
  }, [totals]);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [totals]);

  const handleDenominationChange = (value: number, count: number, total: number) => {
    setTotals(prev => ({
      ...prev,
      [value]: { count, total }
    }));
  };

  const saveToHistory = () => {
    if (grandTotal === 0) return;

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
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      toast.success("Calculation saved successfully!");
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      toast.error("Failed to save calculation");
    }
  };

  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error updating localStorage:", e);
      toast.error("Failed to update history");
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing localStorage:", e);
      toast.error("Failed to clear history");
    }
  };

  const handleReset = () => {
    setTotals({});
    localStorage.removeItem(CURRENT_STATE_KEY);
    toast.info("Counter reset");
  };

  const restoreFromHistory = (entry: HistoryEntry) => {
    setTotals(entry.totals);
    setActiveTab("counter");
    toast.success("Calculation restored successfully");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="max-w-xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <motion.div 
          className="flex items-center"
          variants={itemVariants}
        >
          <CurrencySymbol className="mr-3 sm:mr-4" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Cash Counter</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calculate your cash totals effortlessly</p>
          </div>
        </motion.div>
        <motion.div 
          className="flex space-x-2"
          variants={itemVariants}
        >
          <Button
            onClick={handleReset}
            variant="destructive"
            size="sm"
            className="gap-1 bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center"
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            onClick={saveToHistory}
            size="sm"
            className="gap-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 flex items-center"
            disabled={grandTotal === 0}
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
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
          
          <TabsContent value="counter" className="space-y-4 sm:space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-5 glass-morphism dark:glass-morphism-dark"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                    <Coins size={18} className="text-white" />
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">Coins</span>
                </h2>
              </div>
              {COINS.map((coin) => (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-5 glass-morphism dark:glass-morphism-dark"
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
                  image={note.image}
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
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 shadow-sm border border-purple-200 dark:border-purple-700"
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
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8 mb-4"
      >
        Made by Eric Kunin
      </motion.div>
    </motion.div>
  );
};

export default CashCounter;
