import axios from 'axios';
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
  const response = await api.get(`/api/mapSessions/list/${username}/`);
  return response.data;
}

/* create a session */
export async function CreateSession(username: string, data: object) {
  try {
    const response = await api.post(`/api/mapSessions/list/${username}/`, data);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const messages = (Object.values(err.response.data) as string[][])
        .flat()
        .join(' ');
      throw new Error(messages, { cause: err });
    }
    throw err;
  }
}

/* get specific data on a session */
export async function SpecificSessionData(username: string, slug: string) {
  const response = await api.get(
    `/api/mapSessions/MapSession/${username}/${slug}/`,
  );
  return response.data;
}

/* update the fields of a session */
export async function UpdateSession(
  username: string,
  slug: string,
  data: object,
) {
  const response = await api.patch(
    `/api/mapSessions/MapSession/${username}/${slug}/`,
    data,
  );
  return response.data;
}

export async function deleteSession(username: string, slug: string) {
  const response = await api.delete(
    `/api/mapSessions/MapSession/${username}/${slug}/`,
  );
  return response.data;
}
