
import React from "react";
import { Receipt } from "lucide-react";
import DenominationRow from "../denomination/DenominationRow";
import { formatCurrency, fixImagePath } from "@/utils/formatters";
import { useLanguage } from "@/utils/translations";

interface NotesSectionProps {
  totals: {
    [key: string]: {
      count: number;
      total: number;
    };
  };
  onDenominationChange: (value: number, count: number, total: number) => void;
  noteTotal: number;
  resetTrigger?: number;
}

const NotesSection: React.FC<NotesSectionProps> = ({ 
  totals, 
  onDenominationChange,
  noteTotal,
  resetTrigger = 0
}) => {
  const { t, language } = useLanguage();
  
  const NOTES = [
    { value: 20, labelKey: '20Note', image: "/lovable-uploads/f83c66d7-e502-4ad0-a4b0-1cc2502ef7bf.png" },
    { value: 50, labelKey: '50Note', image: "/lovable-uploads/232c4beb-07a5-42f0-a3fb-39efe6cacdd6.png" },
    { value: 100, labelKey: '100Note', image: "/lovable-uploads/8c86f073-89f2-4b82-942c-5e46f0a7ed54.png" },
    { value: 200, labelKey: '200Note', image: "/lovable-uploads/12384e86-2021-4796-b631-10a1ea264d03.png" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-5 glass-morphism dark:glass-morphism-dark">
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-2">
            <Receipt size={18} className="text-white" />
          </span>
          <span className="text-gray-900 dark:text-gray-100">{t('notes')}</span>
        </h2>
      </div>
      
      {NOTES.map((note) => (
        <DenominationRow
          key={`note-${note.value}`}
          value={note.value}
          label={t(note.labelKey)}
          isCoin={false}
          image={fixImagePath(note.image)}
          onChange={(value, count, total) => 
            onDenominationChange(value, count, total)
          }
          initialCount={totals[note.value]?.count || 0}
          colorScheme="purple"
          resetTrigger={resetTrigger}
        />
      ))}
      
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('notesSubtotal')}</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(noteTotal, language)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
