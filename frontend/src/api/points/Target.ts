import axios from 'axios';
import api from '../AxiosInstance';

export async function GetTargets(username: string, slug: string) {
  const response = await api.get(
    `/api/mapSessions/MapSession/${username}/${slug}/targets/`,
  );
  return response.data;
}

export async function CreateTarget(
  username: string,
  slug: string,
  data: {
    x: number;
    y: number;
    z: number;
    name: string;
    rotation: number;
    type: string;
    scale: number;
    color: string;
  },
) {
  try {
    const response = await api.post(
      `/api/mapSessions/MapSession/${username}/${slug}/targets/`,
      data,
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

export async function DeleteTarget(
  username: string,
  slug: string,
  local_id: number,
) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/targets/${local_id}/`,
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

export async function UpdateTarget(
  username: string,
  slug: string,
  local_id: number,
  data: {
    name: string;
    rotation: number;
    scale: number;
    color: string;
  },
) {
  try {
    const response = await api.patch(
      `/api/mapSessions/MapSession/${username}/${slug}/targets/${local_id}/`,
      data,
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

export async function ClearTargets(username: string, slug: string) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/targets/`,
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
