import { createDialogStore } from '@/stores/createDialogStore';
import { ActivityLog } from '../types/activity-log.types';

export const useActivityLogStore = createDialogStore<ActivityLog>();
