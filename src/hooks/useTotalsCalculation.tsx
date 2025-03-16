
import { useState, useEffect } from "react";
import { DenominationTotals } from "@/types/cashCounter";

export const useTotalsCalculation = (totals: DenominationTotals) => {
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [coinTotal, setCoinTotal] = useState<number>(0);
  const [noteTotal, setNoteTotal] = useState<number>(0);

  useEffect(() => {
    let coinsSum = 0;
    let notesSum = 0;
    
    Object.entries(totals).forEach(([key, { count }]) => {
      const denomValue = parseFloat(key);
      
      // Recalculate the total for each denomination to ensure consistency
      const total = parseFloat((denomValue * count).toFixed(2));
      
      // Use 20 as the threshold between coins and notes
      if (denomValue < 20) {
        coinsSum += total;
      } else {
        notesSum += total;
      }
    });
    
    // Fix precision to avoid floating point errors
    coinsSum = parseFloat(coinsSum.toFixed(2));
    notesSum = parseFloat(notesSum.toFixed(2));
    const totalSum = parseFloat((coinsSum + notesSum).toFixed(2));
    
    setCoinTotal(coinsSum);
    setNoteTotal(notesSum);
    setGrandTotal(totalSum);
  }, [totals]);

  return {
    grandTotal,
    coinTotal,
    noteTotal
  };
};
