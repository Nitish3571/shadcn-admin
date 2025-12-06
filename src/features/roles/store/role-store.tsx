import { createDialogStore } from '@/stores/createDialogStore';
import { Role } from '../types/role.types';

export const useRoleStore = createDialogStore<Role>();
