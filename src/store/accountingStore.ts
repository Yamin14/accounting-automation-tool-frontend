import { create } from 'zustand';
import type { Account, JournalEntry, FinancialYear } from './types';

// initial state
interface AccountingState {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
    clearAccounts: () => void;

    activeFinancialYear: FinancialYear | null;
    selectedFinancialYear: FinancialYear | null;
    setActiveFinancialYear: (year: FinancialYear | null) => void;
    setSelectedFinancialYear: (year: FinancialYear | null) => void;

    financialYears: FinancialYear[];
    setFinancialYears: (years: FinancialYear[]) => void;
    clearFinancialYears: () => void;

    journalEntries: JournalEntry[];
    setJournalEntries: (entries: JournalEntry[]) => void;
    clearJournalEntries: () => void;
}

// zustand store
const useAccountingStore = create<AccountingState>((set) => ({
    accounts: [],
    setAccounts: (accounts: Account[]) => set({ accounts }),
    clearAccounts: () => set({ accounts: [] }),

    activeFinancialYear: null,
    selectedFinancialYear: null,
    setActiveFinancialYear: (year: FinancialYear | null) => set({ activeFinancialYear: year }),
    setSelectedFinancialYear: (year: FinancialYear | null) => set({ selectedFinancialYear: year }),
    
    financialYears: [],
    setFinancialYears: (years: FinancialYear[]) => set({ financialYears: years }),
    clearFinancialYears: () => set({ activeFinancialYear: null, selectedFinancialYear: null }),

    journalEntries: [],
    setJournalEntries: (entries: JournalEntry[]) => set({ journalEntries: entries }),
    clearJournalEntries: () => set({ journalEntries: [] }),

}))

export default useAccountingStore;