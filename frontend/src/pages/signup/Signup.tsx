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

function Signup() {
  return (
    <>
      <div className={styles.coreContainer}>
        <div className={styles.container}>
          <form className={styles.form}>
            <h2>Sign up</h2>
            <div>
              <label>Username</label>
              <input
                required
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                required
                type="password"
                name="password"
                minLength={4}
                placeholder="Password"
                autoComplete="new-password"
              />{' '}
              {/* login should do autoComplete="current-password" */}
            </div>
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
