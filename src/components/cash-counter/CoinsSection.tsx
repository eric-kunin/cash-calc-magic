
import React from "react";
import { Coins } from "lucide-react";
import DenominationRow from "../DenominationRow";
import { formatCurrency, fixImagePath } from "@/utils/formatters";
import { motion } from "framer-motion";
import { useLanguage } from "@/utils/translations";

interface CoinsSectionProps {
  totals: {
    [key: string]: {
      count: number;
      total: number;
    };
  };
  onDenominationChange: (value: number, count: number, total: number) => void;
  coinTotal: number;
}

const CoinsSection: React.FC<CoinsSectionProps> = ({ 
  totals, 
  onDenominationChange,
  coinTotal
}) => {
  const { t } = useLanguage();
  
  const COINS = [
    { value: 0.10, labelKey: '10Agorot', image: "/lovable-uploads/29d9897e-e276-43ce-9d8e-e908d3f1be27.png" },
    { value: 0.50, labelKey: '50Agorot', image: "/lovable-uploads/5015f44e-5e08-407c-a23d-42ed6dc42401.png" },
    { value: 1, labelKey: '1Shekel', image: "/lovable-uploads/639999d8-f0f3-4bbb-8fc9-a040412b6dc5.png" },
    { value: 2, labelKey: '2Shekel', image: "/lovable-uploads/43ff1416-5eb2-403f-ac30-4cf3d01bb0c1.png" },
    { value: 5, labelKey: '5Shekel', image: "/lovable-uploads/e53c39a9-d94a-4348-a899-b96b6f925616.png" },
    { value: 10, labelKey: '10Shekel', image: "/lovable-uploads/f83c66d7-e502-4ad0-a4b0-1cc2502ef7bf.png" },
  ];

  return (
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
          <span className="text-gray-900 dark:text-gray-100">{t('coins')}</span>
        </h2>
      </div>
      
      {COINS.map((coin) => (
        <DenominationRow
          key={`coin-${coin.value}`}
          value={coin.value}
          label={t(coin.labelKey)}
          isCoin={true}
          image={fixImagePath(coin.image)}
          onChange={(count, total) => 
            onDenominationChange(coin.value, count, total)
          }
          initialCount={totals[coin.value]?.count || 0}
          className="animate-slide-up"
          colorScheme="purple"
        />
      ))}
      
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('coinsSubtotal')}</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(coinTotal)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoinsSection;
