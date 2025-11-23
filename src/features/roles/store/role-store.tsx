import { create } from 'zustand';
import { Role } from '../types/role.types';

export type DialogType = 'add' | 'edit' | 'delete' | 'view' | null;

interface RoleStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: Role | null;
  setCurrentRow: (row: Role | null) => void;
}

export const useRoleStore = create<RoleStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
