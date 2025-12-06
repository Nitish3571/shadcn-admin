import { create } from 'zustand';

export type DialogType = 'add' | 'edit' | 'delete' | 'view' | null;

interface DialogStoreState<T> {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: T | null;
  setCurrentRow: (row: T | null) => void;
}

/**
 * Generic factory function to create dialog stores
 * Reduces code duplication across features
 * 
 * @example
 * // In user-store.tsx
 * export const useUserStore = createDialogStore<User>();
 * 
 * // In role-store.tsx
 * export const useRoleStore = createDialogStore<Role>();
 */
export function createDialogStore<T>() {
  return create<DialogStoreState<T>>((set) => ({
    open: null,
    setOpen: (open) => set({ open }),
    currentRow: null,
    setCurrentRow: (row) => set({ currentRow: row }),
  }));
}
