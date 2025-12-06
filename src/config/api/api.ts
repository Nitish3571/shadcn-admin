const API = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    me: 'me',
    verifyEmail: 'auth/verify-email',
    resendVerification: 'auth/resend-verification',
    forgotPassword: 'auth/forgot-password',
    resetPassword: 'auth/reset-password',
    changePassword: 'auth/change-password'
  },
  users: {
    list: 'users',
    store: 'users', 
    show: (id: number) => `users/${id}`,
    delete: (ids: string) => `users/${ids}` 
  },
  roles: {
    list: 'roles',
    all: 'roles/all',
    modulePermissions: 'roles/modulePermissions', 
    permissions: (id: number) => `roles/${id}/permissions`, 
    store: 'roles', 
    show: (id: number) => `roles/${id}`,
    delete: (ids: string) => `roles/${ids}`,
    assignPermissions: (id: number) => `roles/${id}/permissions`
  },
  permissions: {
    list: 'permissions',
    show: (id: number) => `permissions/${id}`
  }
};

Object.freeze(API);
export default API;
