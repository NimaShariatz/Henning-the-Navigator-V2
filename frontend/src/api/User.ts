import api from './AxiosInstance';

export interface StatEntry {
  label: string;
  count: number;
}

export interface AdminStats {
  totals: {
    users: number;
    sessions: number;
    targets: number;
    waypoints: number;
  };
  sessions_per_day: StatEntry[];
  sessions_per_map: StatEntry[];
  edit_access: StatEntry[];
  target_types: StatEntry[];
  waypoint_types: StatEntry[];
  top_users: StatEntry[];
  users_in_month: number | null;
  new_users_per_month: StatEntry[];
  sessions_per_month: StatEntry[];
}

export async function getUser(): Promise<{ username: string }> {
  const response = await api.get('/api/accounts/user/');
  return response.data;
}

export async function deleteUser() {
  await api.delete('/api/accounts/user/');
}

export async function searchUsers(query: string): Promise<string[]> {
  const response = await api.get('/api/accounts/search/', {
    params: { q: query },
  });
  return response.data;
}

export async function getAdmin() {
  const response = await api.get('/api/accounts/admin/');
  return response.data;
}

export async function getAdminStats(
  year?: number,
  month?: number,
): Promise<AdminStats> {
  const response = await api.get('/api/accounts/admin/stats/', {
    params: { year, month },
  });
  return response.data;
}
