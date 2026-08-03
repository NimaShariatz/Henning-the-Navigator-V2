const API_URL = 'http://127.0.0.1:8000';

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
  const res = await fetch(`${API_URL}/api/accounts/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    //if not 200 OK...
    const data = await res.json();
    console.log(data);
    const messages = (Object.values(data) as string[][]).flat().join(' ');
    throw new Error(messages);
  }

  return res.json();
}
