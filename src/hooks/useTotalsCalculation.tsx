
import { useState, useEffect } from "react";
import { DenominationTotals } from "@/types/cashCounter";

export const useTotalsCalculation = (totals: DenominationTotals) => {
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [coinTotal, setCoinTotal] = useState<number>(0);
  const [noteTotal, setNoteTotal] = useState<number>(0);

  useEffect(() => {
    let coinsSum = 0;
    let notesSum = 0;
    
    Object.entries(totals).forEach(([key, { total }]) => {
      // Ensure total is a valid number
      const validTotal = isNaN(total) ? 0 : total;
      const denomValue = parseFloat(key);
      
      // Use 20 as the threshold between coins and notes
      if (denomValue < 20) {
        coinsSum += validTotal;
      } else {
        notesSum += validTotal;
      }
    });
    
    // Fix precision to avoid floating point errors
    setCoinTotal(parseFloat(coinsSum.toFixed(2)));
    setNoteTotal(parseFloat(notesSum.toFixed(2)));
    setGrandTotal(parseFloat((coinsSum + notesSum).toFixed(2)));
  }, [totals]);

  return {
    grandTotal,
    coinTotal,
    noteTotal
  };
};
