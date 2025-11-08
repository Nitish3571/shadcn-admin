"use client";

import { User } from "../data/schema";
import { useDeleteUser, usePostUser } from "../services/users.services";
import { useUserStore } from "../store/user-store";


export function useUserMutations() {
  // Use the state and setters from your user-specific Zustand store
  const { open, setOpen, currentRow, setCurrentRow } = useUserStore();

  // Initialize mutation hooks for user operations
  const { mutate: createMutate, isPending: isCreateLoading } = usePostUser();
  const { mutate: updateMutate, isPending: isUpdateLoading } = usePostUser();
  const { mutate: deleteMutate, isPending: isDeleteLoading } = useDeleteUser(currentRow?.id as number);


  // --- Handlers for Form and Modal Actions ---

  const handleCloseDialog = () => {
    setOpen(null);
    setCurrentRow(null);
  };

  const handleCreate = (values: User) =>
    createMutate(values);

  // Updated handleEdit to include success/error callbacks for better UX
  const handleEdit = (values: Partial<User>) => {
    updateMutate({payload: values, id: currentRow?.id as number});
  };

  const handleDelete = () =>
    deleteMutate(undefined as any, { // `undefined` if the mutation needs no payload
      onSuccess: () => {
        handleCloseDialog();
      },
      onError: (error) => {
        console.error("Error deactivating user:", error);
      },
    });



  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCloseDialog();
    }
  };

  // Return all the state and handlers needed by the MutateUserModal component
  return {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    handleCreate,
    handleEdit,
    handleDelete,
    handleOpenChange,
  };
}