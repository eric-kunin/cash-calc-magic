
import React from 'react';
import { Trash2, RefreshCw, History as HistoryIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useLanguage } from '@/utils/translations';

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

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onDelete: (id: string) => void;
  onRestore: (entry: HistoryEntry) => void;
  onClearAll?: () => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ 
  history, 
  onDelete, 
  onRestore,
  onClearAll
}) => {
  const { t, language } = useLanguage();

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success(t('recordDeleted'));
  };

  const handleRestore = (entry: HistoryEntry) => {
    onRestore(entry);
  };

  const handleClearAll = () => {
    if (onClearAll && window.confirm(t('confirmClearHistory'))) {
      onClearAll();
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
          <HistoryIcon size={32} className="text-purple-500 dark:text-purple-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('noHistoryYet')}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          {t('noHistoryDescription')}
        </p>
      </div>
    );
  }

  // Set text direction based on language
  const isRTL = language === 'he';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden" dir={dir}>
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
          <HistoryIcon size={18} className={`${isRTL ? 'ml-2' : 'mr-2'} text-purple-500`} />
          {t('savedCalculations')}
        </h3>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          >
            <Trash2 size={14} className={isRTL ? 'ml-1' : 'mr-1'} />
            {t('clearAll')}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50 dark:bg-gray-700">
              <TableHead className="text-purple-900 dark:text-purple-100">{t('date')}</TableHead>
              <TableHead className="text-purple-900 dark:text-purple-100">{t('coins')}</TableHead>
              <TableHead className="text-purple-900 dark:text-purple-100">{t('notes')}</TableHead>
              <TableHead className="text-purple-900 dark:text-purple-100">{t('total')}</TableHead>
              <TableHead className={`text-purple-900 dark:text-purple-100 ${isRTL ? 'text-left' : 'text-right'}`}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <TableCell className="text-gray-900 dark:text-gray-200 font-medium">
                  {entry.date}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {formatCurrency(entry.coinTotal)}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300">
                  {formatCurrency(entry.noteTotal)}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(entry.grandTotal)}
                </TableCell>
                <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} space-x-2`}>
                    <button
                      onClick={() => handleRestore(entry)}
                      className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 transition-colors"
                      title={t('calculationRestored')}
                      aria-label={t('calculationRestored')}
                    >
                      <RefreshCw size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                      title={t('recordDeleted')}
                      aria-label={t('recordDeleted')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryDisplay;
