
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
  }, [totals]);

  return {
    grandTotal,
    coinTotal,
    noteTotal
  };
};
