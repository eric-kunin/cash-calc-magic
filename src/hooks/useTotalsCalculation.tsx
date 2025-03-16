
import { useState, useEffect } from "react";
import { DenominationTotals } from "@/types/cashCounter";

export const useTotalsCalculation = (totals: DenominationTotals) => {
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [coinTotal, setCoinTotal] = useState<number>(0);
  const [noteTotal, setNoteTotal] = useState<number>(0);

  useEffect(() => {
    // Initialize sums
    let coinsSum = 0;
    let notesSum = 0;
    
    // Process each denomination
    Object.entries(totals).forEach(([key, entry]) => {
      // Parse denomination value and ensure it's a valid number
      const denomValue = parseFloat(key);
      if (isNaN(denomValue)) return;
      
      // Get count from entry, ensure it's a valid number
      const count = entry?.count ?? 0;
      if (isNaN(count) || count < 0) return;
      
      // Calculate this denomination's total
      const denomTotal = parseFloat((denomValue * count).toFixed(2));
      
      // Add to appropriate category (coins or notes)
      // Fix: Correctly categorize based on actual coin denominations
      if (denomValue <= 10) {
        coinsSum += denomTotal;
      } else {
        notesSum += denomTotal;
      }
    });
    
    // Format totals to avoid floating point precision issues
    coinsSum = parseFloat(coinsSum.toFixed(2));
    notesSum = parseFloat(notesSum.toFixed(2));
    const totalSum = parseFloat((coinsSum + notesSum).toFixed(2));
    
    // Update state
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
