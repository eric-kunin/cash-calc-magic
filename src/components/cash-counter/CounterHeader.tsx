
import React from "react";
import { RefreshCcw, Save } from "lucide-react";
import { Button } from "../ui/button";
import CurrencySymbol from "../CurrencySymbol";
import { motion } from "framer-motion";
import { useLanguage } from "@/utils/translations";

interface CounterHeaderProps {
  onReset: () => void;
  onSave: () => void;
  grandTotal: number;
}

const CounterHeader: React.FC<CounterHeaderProps> = ({ onReset, onSave, grandTotal }) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'he';
  
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <motion.div 
        className="flex items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CurrencySymbol className={`${isRTL ? 'ml-3 ml-sm-4' : 'mr-3 mr-sm-4'}`} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('appTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('appSubtitle')}</p>
        </div>
      </motion.div>
      <motion.div 
        className="flex space-x-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          onClick={onReset}
          variant="destructive"
          size="sm"
          className="gap-1 bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center"
        >
          <RefreshCcw size={16} />
          <span className="hidden sm:inline">{t('reset')}</span>
        </Button>
        <Button
          onClick={onSave}
          size="sm"
          className="gap-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 flex items-center"
          disabled={grandTotal <= 0}
        >
          <Save size={16} />
          <span className="hidden sm:inline">{t('save')}</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default CounterHeader;
