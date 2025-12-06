# Permission System - Complete Documentation

## 📦 Installation Complete

The permission system has been successfully integrated into your frontend application.

## ✅ Currently Protected Features

### Users Page (`/users`)
- **Sidebar Menu** - Only shows if user has `users.view` permission
- **"Add User" Button** - Only shows if user has `users.create` permission
- **View Icon** - Only shows if user has `users.view` permission
- **Edit Icon** - Only shows if user has `users.edit` permission
- **Delete Icon** - Only shows if user has `users.delete` permission

### Roles Page (`/roles`)
- **Sidebar Menu** - Only shows if user has `roles.view` permission
- **"Add Role" Button** - Only shows if user has `roles.create` permission
- **View Icon** - Only shows if user has `roles.view` permission
- **Edit Icon** - Only shows if user has `roles.edit` permission
- **Delete Icon** - Only shows if user has `roles.delete` permission

## 📁 Files Created

1. **src/types/permission.ts** - TypeScript types for permissions and roles
2. **src/stores/authStore.ts** - Updated with permission methods
3. **src/hooks/usePermission.ts** - Hook for permission checks
4. **src/components/permission/PermissionGuard.tsx** - Component for permission-based rendering
5. **src/components/permission/RoleGuard.tsx** - Component for role-based rendering
6. **src/components/permission/index.ts** - Barrel export
7. **src/examples/permission-usage.tsx** - Usage examples

## 🚀 Quick Start

### 1. Import the hook or components

\\\	ypescript
import { usePermission } from '@/hooks/usePermission';
import { PermissionGuard, RoleGuard } from '@/components/permission';
\\\

### 2. Use in your components

\\\	ypescript
// Hide/Show buttons
<PermissionGuard permission=\"users.create\">
  <Button>Create User</Button>
</PermissionGuard>

// Programmatic checks
const { hasPermission } = usePermission();
if (hasPermission('users.edit')) {
  // do something
}
\\\

##  Available Methods

### usePermission Hook

- **hasPermission(permission)** - Check single or multiple permissions (OR logic)
- **hasAllPermissions(permissions)** - Check if user has ALL permissions (AND logic)
- **hasRole(role)** - Check if user has specific role(s)
- **permissions** - Array of user's permissions
- **roles** - Array of user's roles

##  Common Use Cases

### 1. Show/Hide UI Elements
\\\	sx
<PermissionGuard permission=\"users.create\">
  <Button>Create</Button>
</PermissionGuard>
\\\

### 2. Multiple Permissions (OR)
\\\	sx
<PermissionGuard permission={['users.create', 'users.edit']}>
  <Button>Save</Button>
</PermissionGuard>
\\\

### 3. Multiple Permissions (AND)
\\\	sx
<PermissionGuard permission={['users.edit', 'users.delete']} requireAll>
  <Button>Advanced</Button>
</PermissionGuard>
\\\

### 4. Role-Based Access
\\\	sx
<RoleGuard role=\"Super Admin\">
  <AdminPanel />
</RoleGuard>
\\\

### 5. Conditional Rendering
\\\	sx
const { hasPermission } = usePermission();

return (
  <div>
    {hasPermission('users.edit') && <EditButton />}
    {hasPermission('users.delete') && <DeleteButton />}
  </div>
);
\\\

### 6. Disabled State
\\\	sx
const { hasPermission } = usePermission();

<Button disabled={!hasPermission('users.edit')}>
  Edit
</Button>
\\\

### 7. Navigation Menu
\\\	sx
const { hasPermission } = usePermission();

<nav>
  <Link to=\"/dashboard\">Dashboard</Link>
  {hasPermission('users.view') && <Link to=\"/users\">Users</Link>}
  {hasPermission('roles.view') && <Link to=\"/roles\">Roles</Link>}
</nav>
\\\

##  Available Permissions

### Users Module
- **users.view** - View users list and user details
- **users.create** - Create new users (shows "Add User" button)
- **users.edit** - Edit existing users (shows edit icon in table)
- **users.delete** - Delete users (shows delete icon in table)
- **users.export** - Export users data

### Roles Module
- **roles.view** - View roles list and role details (shows "Roles" in sidebar)
- **roles.create** - Create new roles (shows "Add Role" button)
- **roles.edit** - Edit existing roles (shows edit icon in table)
- **roles.delete** - Delete roles (shows delete icon in table)
- **roles.assign** - Assign roles to users

### Dashboard Module
- **dashboard.view** - View dashboard
- **dashboard.analytics** - View analytics data

### Settings Module
- **settings.view** - View settings pages
- **settings.edit** - Edit settings

##  How It Works

1. **Backend sends permissions** - When user logs in, backend returns user with roles and permissions
2. **Store saves permissions** - authStore saves user data including permissions array
3. **Components check permissions** - Use PermissionGuard or usePermission hook to check access
4. **UI updates automatically** - Components re-render when permissions change

##  Integration with Login

Make sure your login API call updates the user info with permissions:

\\\	ypescript
// After successful login
const response = await loginAPI(credentials);
useAuthStore.getState().setToken(response.token);
useAuthStore.getState().setUserInfo(response.user); // Must include roles & permissions
\\\

##  Notes

- Permissions are checked on frontend for UI only
- Backend still enforces permissions on API routes
- User permissions are persisted in localStorage
- Permissions update automatically on login/logout

##  Example Implementation

See \src/examples/permission-usage.tsx\ for complete examples of all use cases.

---

 Permission system is ready to use!
