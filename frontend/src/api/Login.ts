import axios from 'axios';
import api from './AxiosInstance';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthTokens> {
  try {
    const response = await api.post('/api/token/', credentials);
    return response.data;
  } catch (err: unknown) {
    //A wrong username/password will return a 401 from simplejwt with {"detail": "No active account found with the given credentials"}
    if (axios.isAxiosError(err) && err.response) {
      const messages = (Object.values(err.response.data) as string[][])
        .flat()
        .join(' ');
      throw new Error(messages, { cause: err });
    }
    throw err;
  }
}
