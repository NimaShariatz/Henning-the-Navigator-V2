import api from './AxiosInstance';

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
