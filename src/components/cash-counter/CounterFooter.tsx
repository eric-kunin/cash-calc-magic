
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/utils/translations";

const CounterFooter: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8 mb-4"
    >
      {t('madeBy')}
    </motion.div>
  );
};

export default CounterFooter;
