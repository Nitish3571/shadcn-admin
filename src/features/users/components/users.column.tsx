"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import UserListActions from "../actions/user-actions";

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

export const userColumns: ColumnDef<User>[] = [
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