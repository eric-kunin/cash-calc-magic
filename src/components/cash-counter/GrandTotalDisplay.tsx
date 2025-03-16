
import React from "react";
import { Calculator } from "lucide-react";
import AnimatedTotal from "../AnimatedTotal";
import { motion } from "framer-motion";
import { useLanguage } from "@/utils/translations";

interface GrandTotalDisplayProps {
  grandTotal: number;
}

const GrandTotalDisplay: React.FC<GrandTotalDisplayProps> = ({ grandTotal }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 shadow-sm border border-purple-200 dark:border-purple-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">{t('grandTotal')}</h2>
          <AnimatedTotal total={grandTotal} />
        </div>
        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
          <Calculator size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default GrandTotalDisplay;
