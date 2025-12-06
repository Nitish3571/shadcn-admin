import { createDialogStore } from '@/stores/createDialogStore';
import { User } from '../types/user.types';

export const useUserStore = createDialogStore<User>();
