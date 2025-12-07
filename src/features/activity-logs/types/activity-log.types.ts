export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  subject?: {
    type: string;
    id: number;
    name: string;
  };
  event: string;
  causer_type: string | null;
  causer_id: number | null;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
  properties: any;
  changes?: Array<{
    field: string;
    old: any;
    new: any;
  }>;
  batch_uuid: string | null;
  created_at: string;
  created_at_human: string;
}

export interface ActivityLogListResponse {
  data: ActivityLog[];
  total: number;
  column?: any[];
  datatable_column?: any[];
}

export interface ActivityLogResponse {
  data: ActivityLog;
}

export interface ActivityLogStats {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
  by_event: Array<{
    event: string;
    count: number;
  }>;
  by_log_name: Array<{
    log_name: string;
    count: number;
  }>;
}

export const LOG_NAME_OPTIONS = [
  { label: 'User', value: 'user' },
  { label: 'Role', value: 'role' },
  { label: 'Authentication', value: 'auth' },
];

export const EVENT_OPTIONS = [
  { label: 'Created', value: 'created' },
  { label: 'Updated', value: 'updated' },
  { label: 'Deleted', value: 'deleted' },
];
