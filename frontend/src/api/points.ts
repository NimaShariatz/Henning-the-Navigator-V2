import axios from 'axios';
import api from './AxiosInstance';

export async function GetWaypoints(username: string, slug: string) {
  const response = await api.get(
    `/api/mapSessions/MapSession/${username}/${slug}/waypoints/`,
  );
  return response.data;
}

export async function CreateWaypoint(
  username: string,
  slug: string,
  data: { x: number; y: number; type: string },
) {
  try {
    const response = await api.post(
      `/api/mapSessions/MapSession/${username}/${slug}/waypoints/`,
      data,
    );
    return response.data; // { id, x, y, type } — id is server-assigned local_id
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

export async function DeleteWaypoint(
  username: string,
  slug: string,
  local_id: number,
) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/waypoints/${local_id}/`,
    );
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

export async function UpdateWaypoint(
  username: string,
  slug: string,
  local_id: number,
) {
  try {
    const response = await api.patch(
      `/api/mapSessions/MapSession/${username}/${slug}/waypoints/${local_id}/`,
    );
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

export async function ClearWaypoints(username: string, slug: string) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/waypoints/`,
    );
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
