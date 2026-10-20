import { Link } from 'react-router';
import styles from './Home.module.css';
import Menu from '../../components/menu/Menu';
import { sessionHeader, HennLogo2, shareScreenshot } from '../../constants';
import { isLoggedIn } from '../../helpers/isLoggedIn';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HomeWaypointSection from './HomeWaypointSection';
import { degToRad } from 'three/src/math/MathUtils.js';
import TargetPointSection from './TargetPointSection';

function Home() {
  const [loggedIn] = useState(isLoggedIn);

  return (
    <>
      <Menu />

      <div className={styles.homeHennContainer}>
        <img className={styles.backgroundImg} src={sessionHeader} />
        <div className={styles.hennLogoContainer}>
          <img className={styles.hennLogo} src={HennLogo2} />
        </div>

        {loggedIn && (
          <Link to="/user-sessions" className={styles.createSession}>
            Create a Session
          </Link>
        )}
        {!loggedIn && (
          <Link to="/login" className={styles.createSession}>
            Login to Create a Session
          </Link>
        )}
      </div>

      <div className={styles.canvasContainer}>
        <h1>Set a path</h1>
        <Canvas
          camera={{
            fov: 50,
            near: 0.1,
            far: 300,
            position: [-0.2, 0.5, 0.4],
            rotation: [degToRad(0), degToRad(-90), degToRad(0)],
          }}
        >
          <HomeWaypointSection />
          <color args={['#000000']} attach="background" />
        </Canvas>
      </div>

      <div className={styles.canvasContainer}>
        <h1>Define your targets</h1>
        <Canvas
          camera={{
            fov: 35,
            near: 0.1,
            far: 300,
          }}
        >
          <TargetPointSection />
          <color args={['#000000']} attach="background" />
        </Canvas>
      </div>

      <div className={styles.shareSessionContainer}>
        <img className={styles.backgroundImg} src={shareScreenshot} />
        <div>
          <h1>Share your session</h1>
          <Link to="session/user/example-session">See example session</Link>
        </div>
      </div>
    </>
  );
}

export default Home;
