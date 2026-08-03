import styles from './Signup.module.css';
import {
  fw190,
  a20,
  heink,
  nieup,
  ta152,
  ww1,
  yak,
  HennLogo2,
} from '../../constants';

import { signupUser } from '../../api/Signup';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      const tokens = await signupUser({ username, password });
      localStorage.setItem('access', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <>
      <div className={styles.coreContainer}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <label>Username</label>
              <input
                required
                type="text"
                name="username"
                placeholder="Username"
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
                autoComplete="new-password"
                pattern="^(?!^\d+$).{8,}$"
                title="Must be at least 8 characters and not entirely numeric"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <ul>
              <li>At least 8 characters</li>
              <li>Not entirely numeric</li>
            </ul>

            <button className={styles.signupButton} type="submit">
              Sign Up
            </button>
          </form>
        </div>

        <div
          style={{ backgroundImage: `url(${heink})` }}
          className={styles.home_background_img_1}
        ></div>
        <div
          style={{ backgroundImage: `url(${nieup})` }}
          className={styles.home_background_img_2}
        ></div>
        <div
          style={{ backgroundImage: `url(${yak})` }}
          className={styles.home_background_img_3}
        ></div>
        <div
          style={{ backgroundImage: `url(${a20})` }}
          className={styles.home_background_img_4}
        ></div>
        <div
          style={{ backgroundImage: `url(${ta152})` }}
          className={styles.home_background_img_5}
        ></div>
        <div
          style={{ backgroundImage: `url(${ww1})` }}
          className={styles.home_background_img_6}
        ></div>
        <div
          style={{ backgroundImage: `url(${fw190})` }}
          className={styles.home_background_img_7}
        ></div>

        <div className={styles.logo_container}>
          <img
            className={styles.logo}
            src={HennLogo2}
            alt="Henning the Navigator Logo"
          />
        </div>
      </div>
    </>
  );
}

export default Signup;
