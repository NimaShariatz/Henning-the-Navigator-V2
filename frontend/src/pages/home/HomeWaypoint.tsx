import { Html, Segment, Segments } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import styles from './Home.module.css';
import { WAYPOINT_COLORS } from '../../constants';
import { ContactShadows } from '@react-three/drei';

function HomeWaypoint() {
  const ref = useRef<THREE.Object3D>(null!);
  useFrame((_state, delta) => {
    ref.current.rotation.y += delta * degToRad(10);
  });

  return (
    <>
      <mesh position={[0, 0, 0]} ref={ref}>
        <octahedronGeometry args={[1, 0]} />
        <meshLambertMaterial opacity={0.5} color={'#33b9ea'} />
      </mesh>
      <Html position={[0, 1.15, 0]} center wrapperClass={styles.htmlWrapper}>
        <p
          className={styles.htmlText}
          style={{ outlineColor: WAYPOINT_COLORS['startPoint'] }}
        >
          Start
        </p>
      </Html>
      <Segments lineWidth={10}>
        <Segment
          start={[0, 0, -1.2]}
          end={[0, 0, -10]}
          color={WAYPOINT_COLORS['startPoint']}
        />
      </Segments>
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.3}
        frames={1}
        scale={5}
        blur={4}
        far={1}
        resolution={256}
        color="#1e1e1e"
      />
    </>
  );
}
export default HomeWaypoint;
