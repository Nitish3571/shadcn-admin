
// import { useState } from 'react' 
// import LongText from '@/components/long-text'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button' 
// import { Checkbox } from '@/components/ui/checkbox'
// // 👈 Import Dialog components
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from '@/components/ui/dialog'
// import { cn } from '@/lib/utils'
// import { ColumnDef } from '@tanstack/react-table'
// import { UserListResponseTypes } from '../data/schema'
// import { DataTableColumnHeader } from './data-table-column-header'
// import { DataTableRowActions } from './data-table-row-actions'
// import { CreatedAtformatDate } from '@/lib/date'

// interface Permission {
//   id: number
//   name: string
// }

// export const columns: ColumnDef<UserListResponseTypes>[] = [
//   {
//     id: 'select',
//     accessorKey: 'id',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label='Select all'
//         className='translate-y-[2px]'
//       />
//     ),
//     meta: {
//       className: cn(
//         'sticky md:table-cell left-0 z-10 rounded-tl',
//         'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
//       ),
//     },
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label='Select row'
//         className='translate-y-[2px]'
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: 'name',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Name' />
//     ),
//     cell: ({ row }) => (
//       <LongText className='max-w-36'>{row.getValue('name')}</LongText>
//     ),
//     meta: {
//       className: cn(
//         'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
//         'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
//         'sticky left-6 md:table-cell'
//       ),
//     },
//     enableHiding: false,
//   },
//   {
//     accessorKey: 'permissions',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Permissions' />
//     ),
//     cell: ({ row }) => {
//       const [isDialogOpen, setIsDialogOpen] = useState(false)
//       const permissions: Permission[] = row.getValue('permissions') || []
//       const permissionCount = permissions.length

//       return (
//         <>
//           <Button
//             variant='ghost' 
//             size='sm'
//             className='h-auto p-0 transition-opacity hover:opacity-80'
//             onClick={() => setIsDialogOpen(true)}
//             disabled={permissionCount === 0}
//           >
//             <Badge className='w-fit text-nowrap'>
//               {permissionCount} permissions
//             </Badge>
//           </Button>

//           {/* 5. The Dialog Component */}
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogContent className='sm:max-w-[450px]'>
//               <DialogHeader>
//                 <DialogTitle>Permissions for {row.original.name}</DialogTitle>
//                 <DialogDescription>
//                   Total Permissions: {permissionCount}
//                 </DialogDescription>
//               </DialogHeader>

//               <div className='py-4 space-y-2 max-h-[300px] overflow-y-auto'>
//                 {permissionCount > 0 ? (
//                   <div className='flex flex-wrap gap-2'>
//                     {permissions.map((permission) => (
//                       <Badge
//                         key={permission.id}
//                         variant='secondary'
//                         className='text-xs'
//                       >
//                         {permission.name}
//                       </Badge>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className='text-muted-foreground text-sm'>
//                     This user has no assigned permissions.
//                   </p>
//                 )}
//               </div>
//             </DialogContent>
//           </Dialog>
//         </>
//       )
//     },
//   },
//   {
//     accessorKey: 'created_at',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Created At' />
//     ),
//     cell: ({ row }) => {
//       return <span>{CreatedAtformatDate(row.getValue('created_at') as string)}</span>
//     },
//   },
//   {
//     accessorKey: 'updated_at',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title='Updated At' />
//     ),
//     cell: ({ row }) => {
//       return <span>{CreatedAtformatDate(row.getValue('updated_at') as string)}</span>
//     },
//   },
//   {
//     accessorKey: 'Actions',
//     id: 'actions',
//     cell: DataTableRowActions,
//     enableHiding: false,
//     enableSorting: false,
//   },
// ]
"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import UserListActions from "@/features/users/actions/user-actions";

// Define the User type based on your JSON structure
export type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
  deleted_at?: string | null; // Added for the status column, similar to the barge example
  role: {
    id: number;
    name: string;
  };
  company_info: any | null;
  permissions: any[];
};

// A simple map to add color to different user roles
const roleColors: { [key: string]: string } = {
  crane_operator: "bg-sky-50 text-sky-700 hover:bg-sky-100",
  admin: "bg-purple-50 text-purple-700 hover:bg-purple-100",
  manager: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  default: "bg-gray-50 text-gray-700 hover:bg-gray-100",
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.original.name}</span>
        <span className="text-sm text-gray-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roleName = row.original.role?.name || 'default';
      const colorClasses = roleColors[roleName] || roleColors.default;
      
      // Capitalize first letter and replace underscores
      const formattedRole = roleName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return (
        <Badge
          variant="secondary"
          className={cn("py-1 px-3 text-xs font-medium", colorClasses)}
        >
          {formattedRole}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.phone_number || '—'}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Join Date",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isInactive = !!row.original?.deleted_at;
      return (
        <Badge
          variant={isInactive ? "destructive" : "default"}
          className={cn(
            "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium",
            isInactive
              ? "bg-red-50 text-red-700 hover:bg-red-100"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isInactive ? "bg-red-500" : "bg-green-500"
            )}
          ></span>
          {isInactive ? "Inactive" : "Active"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserListActions user={row.original}  />,
  },
];