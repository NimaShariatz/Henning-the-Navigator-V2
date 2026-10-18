import { Link } from 'react-router';
import styles from './Home.module.css';
import Menu from '../../components/menu/Menu';
import { sessionHeader, HennLogo2 } from '../../constants';
import { isLoggedIn } from '../../helpers/isLoggedIn';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import HomeWaypoint from './HomeWaypoint';

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

      <div className={styles.waypointContainer}>
        <div className={styles.canvasContainer}>
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 300,
            }}
          >
            <OrbitControls />

            <HomeWaypoint />

            <pointLight
              intensity={12}
              decay={0.3}
              color={'#f0ebe1'}
              position={[0, 10, 0]}
            />
          </Canvas>
        </div>
      </div>

      {/* <div className={styles.videoContainer}>
        <video
          className={styles.homeVideo}
          src={homeVideo}
          autoPlay
          loop
          muted
        ></video>
      </div> */}
    </>
  );
}

export default Home;
