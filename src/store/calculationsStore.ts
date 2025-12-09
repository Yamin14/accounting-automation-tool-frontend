import { create } from 'zustand';
import { calculateTotals } from '../utils/CalculateTotals';
import { calculateRatios } from '../utils/CalculateRatios';
import useAccountingStore from './accountingStore';

interface CalculationsState {
  totals: ReturnType<typeof calculateTotals>;
  ratios: ReturnType<typeof calculateRatios>;
  isCalculating: boolean;
  recalculateTotals: () => void;
}

const useCalculationsStore = create<CalculationsState>((set) => {
  const emptyTotals = calculateTotals([]);

  const updateTotalsAndRatios = () => {
    const journalEntries = useAccountingStore.getState().journalEntries;

    set({ isCalculating: true });

    const totals = calculateTotals(journalEntries);
    const ratios = calculateRatios(totals);

    set({
      totals,
      ratios,
      isCalculating: false,
    });
  };

  return {
    totals: emptyTotals,
    ratios: calculateRatios(emptyTotals),
    isCalculating: false,
    recalculateTotals: updateTotalsAndRatios,
  };
});

// Automatic recalculation when journal entries change
useAccountingStore.subscribe(() => {
  useCalculationsStore.getState().recalculateTotals();
});

export default useCalculationsStore;

export const useTotals = () => {
  return useCalculationsStore((state) => ({
    totals: state.totals,
    ratios: state.ratios,
    isCalculating: state.isCalculating,
  }));
};
