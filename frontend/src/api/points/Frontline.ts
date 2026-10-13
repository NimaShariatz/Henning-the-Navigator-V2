import axios from 'axios';
import api from '../AxiosInstance';

export async function GetFrontlines(username: string, slug: string) {
  const response = await api.get(
    `/api/mapSessions/MapSession/${username}/${slug}/frontlines/`,
  );
  return response.data;
}

export async function CreateFrontline(
  username: string,
  slug: string,
  data: {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    color: string;
  },
) {
  try {
    const response = await api.post(
      `/api/mapSessions/MapSession/${username}/${slug}/frontlines/`,
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

export async function ClearFrontlines(username: string, slug: string) {
  try {
    const response = await api.delete(
      `/api/mapSessions/MapSession/${username}/${slug}/frontlines/`,
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
