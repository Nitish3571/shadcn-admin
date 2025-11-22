"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import UserListActions from "../actions/user-actions";
import { User } from "../types/user.types";

// 🔠 Helper to capitalize first letter
const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

// MAIN FUNCTION
export const generateDynamicColumns = (
  columnConfig?: any[]
): ColumnDef<User>[] => {
  if (!columnConfig || columnConfig.length === 0) {
    return getDefaultColumns();
  }

  const dynamicColumns: ColumnDef<User>[] = columnConfig
    .filter((col) => col.show === true)
    .map((col) => {
      const key = col.value || col.key;

      const column: ColumnDef<User> = {
        accessorKey: key,

        // 🔠 Capitalize header
        header: capitalize(col.label || key),

        enableSorting: col.sortable === true,
      };

      // ---------- CUSTOM RENDERERS ----------
      switch (key) {
        case "name":
          column.cell = ({ row }) => (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {row.original.name}
              </span>
              <span className="text-sm text-gray-500">
                {row.original.email}
              </span>
            </div>
          );
          break;

        case "roles":
          column.cell = ({ row }) => {
            const roles = row.original.roles || [];

            if (!roles.length)
              return <span className="text-gray-400">No roles</span>;

            return (
              <div className="flex flex-wrap gap-1">
                {roles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="py-1 px-2 text-xs font-medium"
                  >
                    {role.display_name || role.name}
                  </Badge>
                ))}
              </div>
            );
          };
          break;

        case "phone":
          column.cell = ({ row }) => (
            <span className="text-gray-700">
              {row.original.phone || "—"}
            </span>
          );
          break;

        case "user_type":
          column.cell = () => null; // if you want to hide it entirely
          break;

        case "status":
          column.cell = ({ row }) => {
            const isActive = row.original.status === 1;
            return (
              <Badge
                className={cn(
                  "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium",
                  isActive
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isActive ? "bg-green-500" : "bg-red-500"
                  )}
                ></span>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            );
          };
          break;

        default:
          column.cell = ({ row }) => {
            const value = (row.original as any)[key];
            return <span className="text-gray-700">{value ?? "—"}</span>;
          };
      }

      return column;
    });

  // ACTIONS column
  dynamicColumns.push({
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <UserListActions user={row.original} />,
  });

  return dynamicColumns;
};

// -------------------------------------------------------
// DEFAULT COLUMNS (fallback)
// -------------------------------------------------------
const getDefaultColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.original.name}</span>
        <span className="text-sm text-gray-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "roles",
    header: "Roles",
    enableSorting: false,
    cell: ({ row }) => {
      const roles = row.original.roles || [];
      if (!roles.length) return <span className="text-gray-400">No roles</span>;

      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role.id} variant="secondary" className="py-1 px-2 text-xs font-medium">
              {role.display_name || role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const isActive = row.original.status === 1;
      return (
        <Badge
          className={cn(
            "inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium",
            isActive
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-red-50 text-red-700 hover:bg-red-100"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isActive ? "bg-green-500" : "bg-red-500"
            )}
          ></span>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <UserListActions user={row.original} />,
  },
];

export const userColumns = getDefaultColumns();
