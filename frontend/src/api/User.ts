import api from './AxiosInstance';

export async function getUser(): Promise<{ username: string }> {
  const res = await api.get('/api/accounts/user/');
  return res.data;
}

export async function deleteUser() {
  await api.delete('/api/accounts/user/');
}
