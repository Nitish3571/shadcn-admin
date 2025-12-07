"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { LoginHistory } from "../types/login-history.types";
import i18n from '@/i18n';
import { format } from 'date-fns';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const getDeviceIcon = (device: string) => {
  const deviceLower = device.toLowerCase();
  if (deviceLower.includes('mobile') || deviceLower.includes('phone')) {
    return <Smartphone className="h-4 w-4" />;
  }
  if (deviceLower.includes('tablet')) {
    return <Tablet className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
};

// Helper to get translated header
const getTranslatedHeader = (key: string, fallbackLabel?: string): string => {
  const translationMap: Record<string, string> = {
    'id': 'id',
    'user_id': 'user',
    'ip_address': 'ip_address',
    'device_type': 'device',
    'location': 'location',
    'login_at': 'login_time',
    'logout_at': 'logout_time',
    'platform': 'platform',
    'status': 'status',
  };

  const translationKey = translationMap[key] || key;
  const translated = i18n.t(translationKey);
  
  // If translation returns the key itself (not found), use fallback label
  return translated !== translationKey ? translated : (fallbackLabel || key);
};

export const generateDynamicColumns = (
  columnConfig?: any[]
): ColumnDef<LoginHistory>[] => {
  if (!columnConfig || columnConfig.length === 0) {
    return getDefaultColumns();
  }

  const dynamicColumns: ColumnDef<LoginHistory>[] = columnConfig
    .filter((col) => col.show === true)
    .map((col) => {
      const key = col.value || col.key;
      const column: ColumnDef<LoginHistory> = {
        accessorKey: key,
        header: getTranslatedHeader(key, col.label),
        enableSorting: col.sortable === true,
      };

      switch (key) {
        case "user_id":
          column.cell = ({ row }) => (
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {row.original.user?.name || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500">
                {row.original.user?.email || ''}
              </span>
            </div>
          );
          break;

        case "device":
          column.cell = ({ row }) => (
            <div className="flex items-center gap-2">
              {getDeviceIcon(row.original.device)}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{row.original.device}</span>
                <span className="text-xs text-gray-500">{row.original.browser}</span>
              </div>
            </div>
          );
          break;

        case "ip_address":
          column.cell = ({ row }) => (
            <div className="flex flex-col">
              <span className="font-mono text-sm">{row.original.ip_address}</span>
              {row.original.location && (
                <span className="text-xs text-gray-500">{row.original.location}</span>
              )}
            </div>
          );
          break;

        case "login_at":
          column.cell = ({ row }) => (
            <span className="text-sm">
              {format(new Date(row.original.login_at), 'MMM dd, yyyy HH:mm')}
            </span>
          );
          break;

        case "status":
          column.cell = ({ row }) => {
            const isSuccess = row.original.status === 'success';
            return (
              <Badge
                variant={isSuccess ? "default" : "destructive"}
                className="text-xs"
              >
                {isSuccess ? i18n.t('success') : i18n.t('failed')}
              </Badge>
            );
          };
          break;

        default:
          column.cell = ({ row }) => {
            const value = (row.original as any)[key];
            return <span className="text-sm">{value ?? "—"}</span>;
          };
      }

      return column;
    });

  return dynamicColumns;
};

const getDefaultColumns = (): ColumnDef<LoginHistory>[] => [
  {
    accessorKey: "user_id",
    header: i18n.t('user'),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {row.original.user?.name || 'Unknown User'}
        </span>
        <span className="text-xs text-gray-500">
          {row.original.user?.email || ''}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "device",
    header: i18n.t('device'),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getDeviceIcon(row.original.device)}
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.device}</span>
          <span className="text-xs text-gray-500">{row.original.browser}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "ip_address",
    header: i18n.t('ip_address'),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono text-sm">{row.original.ip_address}</span>
        {row.original.location && (
          <span className="text-xs text-gray-500">{row.original.location}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "platform",
    header: i18n.t('platform'),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.platform}</span>
    ),
  },
  {
    accessorKey: "login_at",
    header: i18n.t('login_time'),
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.login_at), 'MMM dd, yyyy HH:mm')}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: i18n.t('status'),
    cell: ({ row }) => {
      const isSuccess = row.original.status === 'success';
      return (
        <Badge
          variant={isSuccess ? "default" : "destructive"}
          className="text-xs"
        >
          {isSuccess ? i18n.t('success') : i18n.t('failed')}
        </Badge>
      );
    },
  },
];

export const loginHistoryColumns = getDefaultColumns();
