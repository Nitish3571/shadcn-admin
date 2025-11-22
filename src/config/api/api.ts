const API = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    me: 'me'
  },
  users: {
    list: 'users',
    store: 'users', // POST - handles create/update/avatar/permissions all in one
    show: (id: number) => `users/${id}`,
    delete: (ids: string) => `users/${ids}` // Supports comma-separated IDs like '1,2,3'
  },
  roles: {
    list: 'roles',
    all: 'roles/all',
    modulePermissions: 'roles/modulePermissions', // Get all permissions grouped by module
    permissions: (id: number) => `roles/${id}/permissions`, // Get permissions by role ID
    store: 'roles', // POST - handles create/update
    show: (id: number) => `roles/${id}`,
    delete: (ids: string) => `roles/${ids}`,
    assignPermissions: (id: number) => `roles/${id}/permissions`
  },
  permissions: {
    list: 'permissions', // Read-only - managed via config
    show: (id: number) => `permissions/${id}` // Read-only
  }
};

Object.freeze(API);
export default API;
