import styles from './Login.module.css';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { loginUser } from '../../api/Login';
import { HennLogo2 } from '../../constants';
import Toast from '../../components/toast/Toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [revealPassword, setRevealPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const toastMessage = location.state?.toast;
  //console.log(toastMessage);

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
      {toastMessage && <Toast ToastMessage={toastMessage} />}

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
            <div style={{ position: 'relative' }}>
              <label>Password</label>
              <input
                required
                type={revealPassword ? 'text' : 'password'}
                name="password"
                minLength={8}
                placeholder="Password"
                autoComplete="current-password"
                pattern="^(?!^\d+$).{8,}$"
                title="Must be at least 8 characters and not entirely numeric"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {revealPassword && (
                <svg
                  style={{ opacity: revealPassword ? '1' : '0.4' }}
                  className={styles.showPasswordButton}
                  onClick={() => setRevealPassword(!revealPassword)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="var(--text_color)"
                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                  ></path>
                </svg>
              )}
              {!revealPassword && (
                <svg
                  style={{ opacity: revealPassword ? '1' : '0.4' }}
                  className={styles.showPasswordButton}
                  onClick={() => setRevealPassword(!revealPassword)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-2 -2 24 24"
                >
                  <path d="M-2 -2h24v24H-2z" fill="none" />
                  <path
                    fill="var(--text_color)"
                    d="m15.398 7.23l1.472-1.472C18.749 6.842 20 8.34 20 10c0 3.314-4.958 5.993-10 6a14.7 14.7 0 0 1-3.053-.32l1.747-1.746q.64.067 1.303.066h.002c-.415 0-.815-.063-1.191-.18l1.981-1.982c.47-.202.847-.579 1.05-1.049l1.98-1.981A4 4 0 0 1 10.022 14C14.267 13.985 18 11.816 18 10c0-.943-1.022-1.986-2.602-2.77m-9.302 3.645A4 4 0 0 1 9.993 6C5.775 5.985 2 8.178 2 10c0 .896.904 1.877 2.327 2.644L2.869 14.1C1.134 13.028 0 11.585 0 10c0-3.314 4.984-6.017 10-6c.914.003 1.827.094 2.709.262l-1.777 1.776q-.435-.033-.88-.038q.424.007.823.096l-4.78 4.779zM19.092.707a1 1 0 0 1 0 1.414l-16.97 16.97a1 1 0 1 1-1.415-1.413L17.677.708a1 1 0 0 1 1.415 0z"
                  />
                </svg>
              )}
            </div>
            <Link to="/signup">No account? Sign up</Link>
            <button className={styles.loginButton} type="submit">
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
