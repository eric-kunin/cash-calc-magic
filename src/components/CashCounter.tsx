
import React from "react";
import { Calculator, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryDisplay from "./HistoryDisplay";
import { useLanguage } from "@/utils/translations";
import useCashCounter from "@/hooks/useCashCounter";

// Import refactored components
import CounterHeader from "./cash-counter/CounterHeader";
import CoinsSection from "./cash-counter/CoinsSection";
import NotesSection from "./cash-counter/NotesSection";
import GrandTotalDisplay from "./cash-counter/GrandTotalDisplay";
import CounterFooter from "./cash-counter/CounterFooter";

const CashCounter: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    totals,
    grandTotal,
    coinTotal,
    noteTotal,
    history,
    activeTab,
    resetTrigger,
    setActiveTab,
    handleDenominationChange,
    saveToHistory,
    deleteHistoryEntry,
    clearAllHistory,
    handleReset,
    restoreFromHistory
  } = useCashCounter();

  const isRTL = language === 'he';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div 
      className="max-w-xl mx-auto p-4"
      dir={dir}
    >
      <CounterHeader 
        onReset={handleReset} 
        onSave={saveToHistory} 
        grandTotal={grandTotal} 
      />
      
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
          <TabsList className="w-full mb-6 bg-purple-100 dark:bg-gray-800">
            <TabsTrigger 
              value="counter" 
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Calculator size={16} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('counter')}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <History size={16} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('history')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="counter" className="space-y-4 sm:space-y-6">
            <CoinsSection 
              totals={totals} 
              onDenominationChange={handleDenominationChange} 
              coinTotal={coinTotal} 
              resetTrigger={resetTrigger}
            />
            
            <NotesSection 
              totals={totals} 
              onDenominationChange={handleDenominationChange} 
              noteTotal={noteTotal} 
              resetTrigger={resetTrigger}
            />
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
      </div>
      
      <GrandTotalDisplay grandTotal={grandTotal} />
      
      <CounterFooter />
    </div>
  );
};

export default CashCounter;
