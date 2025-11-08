import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  buttonLabel,
  onButtonClick,
  icon,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between ", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl leading-tight font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {buttonLabel && (
        <div className="flex items-center gap-2">
          <Button
            onClick={onButtonClick}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 cursor-pointer"
          >
            {icon ?? <Plus className="h-4 w-4" />}
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
