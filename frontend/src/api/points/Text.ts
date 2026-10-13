import axios from 'axios';
import api from '../AxiosInstance';

export async function GetTexts(username: string, slug: string) {
  const response = await api.get(
    `/api/mapSessions/MapSession/${username}/${slug}/texts/`,
  );
  return response.data;
}

export async function CreateText(
  username: string,
  slug: string,
  data: {
    x: number;
    y: number;
    text: string;
    color: string;
    rotation: number;
    size: number;
  },
) {
  try {
    const response = await api.post(
      `/api/mapSessions/MapSession/${username}/${slug}/texts/`,
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

export async function DeleteText(
  username: string,
  slug: string,
  local_id: number,
) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/texts/${local_id}/`,
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

export async function UpdateText(
  username: string,
  slug: string,
  local_id: number,
  data: {
    text: string;
    color: string;
    rotation: number;
    size: number;
  },
) {
  try {
    const response = await api.patch(
      `/api/mapSessions/MapSession/${username}/${slug}/texts/${local_id}/`,
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

export async function ClearTexts(username: string, slug: string) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/texts/`,
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
