import { create } from "zustand";
import { User } from "../components/users.column";


export type DialogType = "add" | "edit" | "delete" | "view" | "restore" | null;

interface StoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: User | null;
  setCurrentRow: (row: User | null) => void;
}

export const useUserStore = create<StoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
