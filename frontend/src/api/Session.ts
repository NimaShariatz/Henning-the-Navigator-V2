import api from './AxiosInstance';

export async function BasicSessionData(username: string) {
  const res = await api.get(`/api/mapSessions/list/${username}/`);
  return res.data;
}

export async function SpecificSessionData(username: string, slug: string) {
  const res = await api.get(`/api/mapSessions/MapSession/${username}/${slug}/`);
  return res.data;
}
