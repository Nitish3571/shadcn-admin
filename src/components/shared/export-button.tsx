import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { useAuthStore } from '@/stores/authStore';

interface ExportButtonProps {
  endpoint: string;
  filename?: string;
  permission: string;
  params?: Record<string, any>;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButton({
  endpoint,
  filename = 'export',
  permission,
  params = {},
  variant = 'outline',
  size = 'default',
}: ExportButtonProps) {
  const { exportData, isExporting } = useExport();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // Don't render if user doesn't have permission
  if (!hasPermission(permission)) {
    return null;
  }

  const handleExport = async (format: 'xlsx' | 'csv' | 'xls') => {
    await exportData({
      endpoint,
      filename,
      format,
      params,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xls')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel 97-2003 (.xls)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
