import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
  confirmButtonText: string;
  iconComponent: React.ReactNode;
  confirmButtonColor?: "destructive" | "success";
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  confirmButtonText,
  iconComponent,
  confirmButtonColor = "destructive",
}: Readonly<DeleteModalProps>) {
  const handleConfirm = () => {
    onConfirm();
  };

  const buttonClassName =
    confirmButtonColor === "destructive"
      ? "bg-red-600 text-white transition-colors hover:bg-red-700"
      : "bg-green-600 text-white transition-colors hover:bg-green-700";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-xl bg-white shadow-2xl sm:max-w-[425px] dark:bg-gray-800">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 ${
                confirmButtonColor === "destructive"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              {iconComponent}
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="mt-2 max-w-full overflow-hidden wrap-break-word text-gray-600 dark:text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant={
              confirmButtonColor === "destructive" ? "destructive" : "default"
            }
            onClick={handleConfirm}
            disabled={loading}
            className={`flex items-center gap-2 ${buttonClassName}`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {confirmButtonText}...
              </>
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
