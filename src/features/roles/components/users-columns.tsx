
import { useState } from 'react' 
import LongText from '@/components/long-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button' 
import { Checkbox } from '@/components/ui/checkbox'
// 👈 Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { UserListResponseTypes } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { CreatedAtformatDate } from '@/lib/date'

interface Permission {
  id: number
  name: string
}

export const columns: ColumnDef<UserListResponseTypes>[] = [
  {
    id: 'select',
    accessorKey: 'id',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'permissions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Permissions' />
    ),
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const permissions: Permission[] = row.getValue('permissions') || []
      const permissionCount = permissions.length

      return (
        <>
          <Button
            variant='ghost' 
            size='sm'
            className='h-auto p-0 transition-opacity hover:opacity-80'
            onClick={() => setIsDialogOpen(true)}
            disabled={permissionCount === 0}
          >
            <Badge className='w-fit text-nowrap'>
              {permissionCount} permissions
            </Badge>
          </Button>

          {/* 5. The Dialog Component */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className='sm:max-w-[450px]'>
              <DialogHeader>
                <DialogTitle>Permissions for {row.original.name}</DialogTitle>
                <DialogDescription>
                  Total Permissions: {permissionCount}
                </DialogDescription>
              </DialogHeader>

              <div className='py-4 space-y-2 max-h-[300px] overflow-y-auto'>
                {permissionCount > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        variant='secondary'
                        className='text-xs'
                      >
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm'>
                    This user has no assigned permissions.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      return <span>{CreatedAtformatDate(row.getValue('created_at') as string)}</span>
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ row }) => {
      return <span>{CreatedAtformatDate(row.getValue('updated_at') as string)}</span>
    },
  },
  {
    accessorKey: 'Actions',
    id: 'actions',
    cell: DataTableRowActions,
    enableHiding: false,
    enableSorting: false,
  },
]
