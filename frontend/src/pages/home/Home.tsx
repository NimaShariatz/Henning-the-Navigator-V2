import { Link } from 'react-router';
import styles from './Home.module.css';
import Menu from '../../components/menu/Menu';
import { sessionHeader, HennLogo2 } from '../../constants';
import { isLoggedIn } from '../../helpers/isLoggedIn';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HomeWaypointSection from './HomeWaypointSection';
// import HomeWaypoint from './HomeWaypoint';
// import { degToRad } from 'three/src/math/MathUtils.js';
import { OrbitControls } from '@react-three/drei';

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
        <Canvas
          camera={{
            fov: 45,
            near: 0.1,
            far: 300,
          }}
        >
          <OrbitControls />
          <HomeWaypointSection />
          <color args={['#000000']} attach="background" />
        </Canvas>
      </div>

      {/* <div className={styles.waypointContainer}>
        <div className={styles.canvasContainer}>
          
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 300,
              position: [0.5, 1, 2],
              rotation: [degToRad(-5), 0, degToRad(0)]
            }}
            
          >

            <HomeWaypoint />

            <pointLight
              intensity={12}
              decay={0.3}
              color={'#f0ebe1'}
              position={[2, 15, -9]}
            />

            <mesh position={[2, 15, -9]} >
              <boxGeometry args={[1, 1, 1]} />
              <meshLambertMaterial opacity={0.5} color={"#d10909"} />
            </mesh>


          </Canvas>
        </div>
      </div> */}
    </>
  );
}

export default Home;
