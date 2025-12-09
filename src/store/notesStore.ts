import { create } from 'zustand';
import type { Note } from './types';

// initial state
interface NotesState {
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    clearNotes: () => void;
}

// zustand store
const useNotesStore = create<NotesState>((set) => ({
    notes: [],
    setNotes: (notes: Note[]) => set({ notes }),
    clearNotes: () => set({ notes: [] })
}))

export default useNotesStore;