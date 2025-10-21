const API = {
  auth: {
    login: 'auth/login'
  },
  users:{
    list: 'users',
    create: 'users/create',
    update: 'users/update',
    delete: 'users/delete',
    roles: 'users/roles'
  }
};

Object.freeze(API);
export default API;