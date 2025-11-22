import { create } from 'zustand';
import { User } from '../types/user.types';

export type DialogType = 'add' | 'edit' | 'delete' | 'view' | null;

interface UserStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: User | null;
  setCurrentRow: (row: User | null) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
