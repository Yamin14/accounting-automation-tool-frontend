import { create } from 'zustand';

interface FinancialStatementState {
    financialStatement: string;
    setFinancialStatement: (statement: string) => void;
}

const useFinancialStatementStore = create<FinancialStatementState>((set) => ({
    financialStatement: 'pnl',
    setFinancialStatement: (statement) => set({ financialStatement: statement }),
}))

export default useFinancialStatementStore;