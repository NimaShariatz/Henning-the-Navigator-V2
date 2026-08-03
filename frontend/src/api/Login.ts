const API_URL = 'http://127.0.0.1:8000';

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
  const res = await fetch(`${API_URL}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    //A wrong username/password will return a 401 from simplejwt with {"detail": "No active account found with the given credentials"}
    const data = await res.json();
    const messages = (Object.values(data) as string[][]).flat().join(' ');
    throw new Error(messages);
  }

  return res.json();
}
