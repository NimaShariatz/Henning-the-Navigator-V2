import styles from './Login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loginUser } from '../../api/Login';
import { HennLogo2 } from '../../constants';

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
      navigate('/user-sessions');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <>
      <div className={styles.coreContainer}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <label>Username</label>
              <input
                required
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                required
                type="password"
                name="password"
                minLength={8}
                placeholder="Password"
                autoComplete="current-password"
                pattern="^(?!^\d+$).{8,}$"
                title="Must be at least 8 characters and not entirely numeric"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className={styles.signupButton} type="submit">
              Login
            </button>
          </form>
        </div>

        <div
          className={styles.home_background_img}
          style={{ backgroundImage: `url(${HennLogo2})` }}
        ></div>
      </div>
    </>
  );
}

export default Login;
