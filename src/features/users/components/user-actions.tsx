  "use client";
  import { AlertTriangle, RotateCcw } from "lucide-react";

import { useUserMutations } from "../hook/user-user-action";
import { UserActionForm } from "./user-action-form";
import { DeleteModal } from "@/components/shared/comman-delete-model";

  export function MutateUserModal() {
    // 1. Use the new custom hook for user state and actions
    const {
      open,
      currentRow,
      isCreateLoading,
      isUpdateLoading,
      handleCreate,
      handleEdit,
      handleDelete,
      handleOpenChange,
      setOpen,
      isDeleteLoading,
    } = useUserMutations();

    // 2. The core logic remains identical, just the context has changed
    const isEditMode = open === "edit" && currentRow !== null;
    const isAddMode = open === "add";
    const isViewMode = open === "view" && currentRow !== null;

    const isActionModalOpen =
      (open === "delete" || open === "restore") && currentRow !== null;

    const isDeleteMode = open === "delete";

    // 3. All text and props are updated to refer to "User" instead of "Crane"
    const modalProps = {
      title: isDeleteMode ? "Deactivate User" : "Restore User",
      description: isDeleteMode
        ? `Are you sure you want to deactivate the user "${currentRow?.name}"? This will prevent them from logging in.`
        : `Are you sure you want to restore the user "${currentRow?.name}"? They will regain access to the system.`,
      itemName: currentRow?.name || "",
      confirmButtonText: isDeleteMode ? "Deactivate" : "Restore",
      onConfirm: isDeleteMode ? handleDelete : '',
      loading: isDeleteMode ? isDeleteLoading : '',
      iconComponent: isDeleteMode ? (
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      ) : (
        <RotateCcw className="h-6 w-6 text-green-600 dark:text-green-400" />
      ),
      confirmButtonColor: (isDeleteMode ? "destructive" : "success") as
        | "success"
        | "destructive",
    };

    return (
      <>
        {/* Add User Form */}
        {isAddMode && (
          <UserActionForm
            key="add-user"
            open={isAddMode}
            loading={isCreateLoading}
            onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
            onSubmit={handleCreate}
          />
        )}

        {/* Edit User Form */}
        {isEditMode && (
          <UserActionForm
            key={`user-edit-${currentRow.id}`}
            open={isEditMode}
            onSubmit={handleEdit}
            loading={isUpdateLoading}
    
            onOpenChange={handleOpenChange}
            currentRow={currentRow}
          />
        )}

        {/* View User Modal */}
        {isViewMode && (
          <UserActionForm
            key={`user-view-${currentRow.id}`}
            open={isViewMode}
            onOpenChange={handleOpenChange}
            currentRow={currentRow}
            isViewMode={true}
            onSubmit={() => {}} // No-op for view mode
          />
        )}

        {/* Deactivate/Restore Confirmation Modal */}
        {isActionModalOpen && currentRow && (
          <DeleteModal
            key={`user-action-${currentRow.id}-${open}`}
            isOpen={isActionModalOpen}
            onClose={handleOpenChange}
            onConfirm={handleDelete}
            loading={false}
            title="Are you sure want to delete?"
            description="This action not be undone."
            confirmButtonText="Continue"
            iconComponent={<AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />}
            confirmButtonColor="destructive"
          />
        )}
      </>
    );
  }