import { create } from 'zustand';

type Entry = {
    debitAccount: string,
    creditAccount: string,
    description: string,
    amount: number
};

interface EntryState {
    entry: Entry | null;
    setEntry: (
        debitAccount: string, 
        creditAccount: string,
        description: string, 
        amount: number) => void;
    clearEntry: () => void;
}

const useEntryStore = create<EntryState>((set) => ({
    entry: null,
    setEntry: (debitAccount, creditAccount, description, amount) => {
        set(() => ({
            entry: {
                debitAccount,
                creditAccount,
                description,
                amount
            }
        }));
    },
    clearEntry: () => set(() => ({
        entry: null
    }))
}))

export default useEntryStore;