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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
          {isExporting ? t('exporting') : t('export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {t('export_excel')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          {t('export_csv')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xls')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {t('export_xls')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
