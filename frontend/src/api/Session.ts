import api from './AxiosInstance';

export interface SessionListItem {
  slug: string;
  title: string;
  map_selected: string;
  all_can_edit: boolean;
  last_updated: string;
}
export interface SessionDetailedItem {
  slug: string;
  title: string;
  map_selected: string;
  all_can_edit: boolean;
  permitted_to_edit: string[]; // array of usernames
  sessionInfo: string;
  created_at: string;
  last_updated: string;
}

/* get the list of sessions */
export async function BasicSessionData(username: string) {
  const res = await api.get(`/api/mapSessions/list/${username}/`);
  return res.data;
}

/* create a session */
export async function CreateSession(username: string, data: object) {
  const res = await api.post(`/api/mapSessions/list/${username}/`, data);
  return res.data;
}

/* get specific data on a session */
export async function SpecificSessionData(username: string, slug: string) {
  const res = await api.get(`/api/mapSessions/MapSession/${username}/${slug}/`);
  return res.data;
}

/* update the fields of a session */
export async function UpdateSession(
  username: string,
  slug: string,
  data: object,
) {
  const res = await api.patch(
    `/api/mapSessions/MapSession/${username}/${slug}/`,
    data,
  );
  return res.data;
}
