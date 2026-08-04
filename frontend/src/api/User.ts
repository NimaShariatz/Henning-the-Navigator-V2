const API_URL = 'http://127.0.0.1:8000';

export async function getUser(): Promise<{ username: string }> {
  const res = await fetch(`${API_URL}/api/accounts/user/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
