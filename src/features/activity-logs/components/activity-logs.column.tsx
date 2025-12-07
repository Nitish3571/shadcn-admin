'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import ActivityLogActions from '../actions/activity-log-actions';
import { ActivityLog } from '../types/activity-log.types';
import i18n from '@/i18n';

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

// Helper to get translated header
const getTranslatedHeader = (key: string, fallbackLabel?: string): string => {
  const translationMap: Record<string, string> = {
    'id': 'id',
    'log_name': 'log_name',
    'description': 'description',
    'event': 'event',
    'causer_id': 'user',
    'subject_type': 'subject_type',
    'created_at': 'created_at',
  };

  const translationKey = translationMap[key] || key;
  const translated = i18n.t(translationKey);
  
  // If translation returns the key itself (not found), use fallback label
  return translated !== translationKey ? translated : (fallbackLabel || capitalize(key));
};

const getEventColor = (event: string) => {
  switch (event) {
    case 'created':
      return 'bg-green-50 text-green-700 hover:bg-green-100';
    case 'updated':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100';
    case 'deleted':
      return 'bg-red-50 text-red-700 hover:bg-red-100';
    default:
      return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
  }
};

const getLogNameColor = (logName: string) => {
  switch (logName) {
    case 'user':
      return 'bg-purple-50 text-purple-700';
    case 'role':
      return 'bg-indigo-50 text-indigo-700';
    case 'auth':
      return 'bg-orange-50 text-orange-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

export const generateDynamicColumns = (
  columnConfig?: any[]
): ColumnDef<ActivityLog>[] => {
  if (!columnConfig || columnConfig.length === 0) {
    return getDefaultColumns();
  }

  const dynamicColumns: ColumnDef<ActivityLog>[] = columnConfig
    .filter((col) => col.show === true)
    .map((col) => {
      const key = col.value || col.key;

      const column: ColumnDef<ActivityLog> = {
        accessorKey: key,
        header: getTranslatedHeader(key, col.label),
        enableSorting: col.sortable === true,
      };

      switch (key) {
        case 'description':
          column.cell = ({ row }) => (
            <div className="flex flex-col max-w-md">
              <span className="font-medium text-gray-900">
                {row.original.description}
              </span>
              {row.original.causer && (
                <span className="text-xs text-gray-500">
                  by {row.original.causer.name}
                </span>
              )}
            </div>
          );
          break;

        case 'log_name':
          column.cell = ({ row }) => (
            <Badge className={cn('py-1 px-2 text-xs font-medium', getLogNameColor(row.original.log_name))}>
              {capitalize(row.original.log_name)}
            </Badge>
          );
          break;

        case 'event':
          column.cell = ({ row }) => (
            <Badge className={cn('py-1 px-2 text-xs font-medium', getEventColor(row.original.event))}>
              {capitalize(row.original.event)}
            </Badge>
          );
          break;

        case 'subject_type':
          column.cell = ({ row }) => {
            if (!row.original.subject) {
              return <span className="text-gray-400">—</span>;
            }
            return (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{row.original.subject.type}</span>
                <span className="text-xs text-gray-500">{row.original.subject.name}</span>
              </div>
            );
          };
          break;

        case 'causer_type':
          column.cell = ({ row }) => {
            if (!row.original.causer) {
              return <span className="text-gray-400">System</span>;
            }
            return (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{row.original.causer.name}</span>
                <span className="text-xs text-gray-500">{row.original.causer.email}</span>
              </div>
            );
          };
          break;

        case 'created_at':
          column.cell = ({ row }) => (
            <div className="flex flex-col">
              <span className="text-sm">{row.original.created_at_human}</span>
              <span className="text-xs text-gray-500">
                {new Date(row.original.created_at).toLocaleString()}
              </span>
            </div>
          );
          break;

        default:
          column.cell = ({ row }) => {
            const value = (row.original as any)[key];
            return <span className="text-gray-700">{value ?? '—'}</span>;
          };
      }

      return column;
    });

  dynamicColumns.push({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => <ActivityLogActions log={row.original} />,
  });

  return dynamicColumns;
};

const getDefaultColumns = (): ColumnDef<ActivityLog>[] => [
  {
    accessorKey: 'description',
    header: 'Description',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col max-w-md">
        <span className="font-medium text-gray-900">
          {row.original.description}
        </span>
        {row.original.causer && (
          <span className="text-xs text-gray-500">
            by {row.original.causer.name}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'log_name',
    header: 'Type',
    enableSorting: true,
    cell: ({ row }) => (
      <Badge className={cn('py-1 px-2 text-xs font-medium', getLogNameColor(row.original.log_name))}>
        {capitalize(row.original.log_name)}
      </Badge>
    ),
  },
  {
    accessorKey: 'event',
    header: 'Event',
    enableSorting: true,
    cell: ({ row }) => (
      <Badge className={cn('py-1 px-2 text-xs font-medium', getEventColor(row.original.event))}>
        {capitalize(row.original.event)}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Time',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.created_at_human}</span>
        <span className="text-xs text-gray-500">
          {new Date(row.original.created_at).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => <ActivityLogActions log={row.original} />,
  },
];

export const activityLogColumns = getDefaultColumns();
