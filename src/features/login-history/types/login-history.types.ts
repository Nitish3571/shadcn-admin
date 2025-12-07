export interface LoginHistory {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  ip_address: string;
  user_agent: string;
  device: string;
  browser: string;
  platform: string;
  location?: string;
  login_at: string;
  logout_at?: string;
  status: 'success' | 'failed';
  created_at: string;
}

export interface LoginHistoryListResponse {
  data: LoginHistory[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
