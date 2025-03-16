
export interface DenominationTotals {
  [key: string]: {
    count: number;
    total: number;
  };
}

export interface HistoryEntry {
  id: string;
  date: string;
  totals: DenominationTotals;
  grandTotal: number;
  coinTotal: number;
  noteTotal: number;
}
