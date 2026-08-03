import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loginUser } from '../../api/Login';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      const tokens = await loginUser({ username, password });
      localStorage.setItem('access', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          required
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          required
          type="password"
          name="password"
          minLength={8}
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.loginButton} type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default Login;
