import type { Waypoint, Targetpoint, Textpoint, Frontline } from '../constants';
import axios from 'axios';
import api from './AxiosInstance';

export async function ImportSessionData(
  username: string,
  slug: string,
  data: {
    mapSelected: string;
    waypoints: Waypoint[];
    targets: Targetpoint[];
    texts: Textpoint[];
    frontlines: Frontline[];
  },
) {
  try {
    const response = await api.post(
      `/api/mapSessions/MapSession/${username}/${slug}/import/`,
      data,
    );
    return response.data; // { waypoints, targets, texts, frontlines }
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
