import axios from 'axios';
import api from './AxiosInstance';

export interface SignupCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export async function signupUser(
  credentials: SignupCredentials,
): Promise<AuthTokens> {
  try {
    const response = await api.post('/api/accounts/register/', credentials);
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
