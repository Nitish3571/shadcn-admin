'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import RoleListActions from '../actions/role-actions';
import { Role } from '../types/role.types';

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export const generateDynamicColumns = (
  columnConfig?: any[]
): ColumnDef<Role>[] => {
  if (!columnConfig || columnConfig.length === 0) {
    return getDefaultColumns();
  }

  const dynamicColumns: ColumnDef<Role>[] = columnConfig
    .filter((col) => col.show === true)
    .map((col) => {
      const key = col.value || col.key;

      const column: ColumnDef<Role> = {
        accessorKey: key,
        header: capitalize(col.label || key),
        enableSorting: col.sortable === true,
      };

      switch (key) {
        case 'name':
          column.cell = ({ row }) => (
            <div className='flex flex-col'>
              <span className='font-medium text-gray-900'>
              {row.original.name}
            </span>
            </div>
          );
          break;

        case 'permissions':
          column.cell = ({ row }) => {
            const permissions = row.original.permissions || [];

            if (!permissions.length)
              return <span className='text-gray-400'>No permissions</span>;

            return (
              <div className='flex flex-wrap gap-1'>
                <Badge
                  variant='secondary'
                  className='py-1 px-2 text-xs font-medium'
                >
                  {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            );
          };
          break;

        default:
          column.cell = ({ row }) => {
            const value = (row.original as any)[key];
            return <span className='text-gray-700'>{value ?? '—'}</span>;
          };
      }

      return column;
    });

  dynamicColumns.push({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => <RoleListActions role={row.original} />,
  });

  return dynamicColumns;
};

const getDefaultColumns = (): ColumnDef<Role>[] => [
  {
    accessorKey: 'name',
    header: 'Role Name',
    enableSorting: true,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium text-gray-900'>
          {row.original.display_name || row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    enableSorting: false,
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];
      if (!permissions.length)
        return <span className='text-gray-400'>No permissions</span>;

      return (
        <div className='flex flex-wrap gap-1'>
          <Badge variant='secondary' className='py-1 px-2 text-xs font-medium'>
            {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => <RoleListActions role={row.original} />,
  },
];

export const roleColumns = getDefaultColumns();
