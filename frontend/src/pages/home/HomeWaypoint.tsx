import { Html, Segment, Segments } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import styles from './Home.module.css';
import { WAYPOINT_COLORS } from '../../constants';
import { ContactShadows } from '@react-three/drei';

function HomeWaypoint() {
  const refStart = useRef<THREE.Object3D>(null!);
  const refIngress = useRef<THREE.Object3D>(null!);
  const refTarget = useRef<THREE.Object3D>(null!);
  const refEgress = useRef<THREE.Object3D>(null!);
  useFrame((_state, delta) => {
    refStart.current.rotation.y += delta * degToRad(10);
    refIngress.current.rotation.y += delta * degToRad(10);
    refTarget.current.rotation.y += delta * degToRad(10);
    refEgress.current.rotation.y += delta * degToRad(10);
  });

  return (
    <>
      <Segments lineWidth={8}>
        <Segment
          start={[0, 0, -1.2]}
          end={[0, 0, -8]}
          color={WAYPOINT_COLORS['ingressPoint']}
        />
        <Segment
          start={[1.2, 0, -9.5]}
          end={[3, 0, -10]}
          color={WAYPOINT_COLORS['targetPoint']}
        />
        <Segment
          start={[4.1, 0, -12]}
          end={[2, 0, -20]}
          color={WAYPOINT_COLORS['egressPoint']}
        />
      </Segments>

      <mesh position={[0, 0, 0]} ref={refStart}>
        <octahedronGeometry args={[1, 0]} />
        <meshLambertMaterial
          opacity={0.5}
          color={WAYPOINT_COLORS['startPoint']}
        />
      </mesh>
      <Html position={[0, 1.05, 0]} center wrapperClass={styles.htmlWrapper}>
        <p
          className={styles.htmlText}
          style={{ outlineColor: WAYPOINT_COLORS['startPoint'] }}
        >
          Start
        </p>
      </Html>
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

      <mesh
        position={[0, 0, -9.2]}
        ref={refIngress}
        rotation={[0, degToRad(90), 0]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={WAYPOINT_COLORS['ingressPoint']} />
      </mesh>
      <Html position={[0, 1.25, -9.2]} center wrapperClass={styles.htmlWrapper}>
        <p
          className={styles.htmlText}
          style={{ outlineColor: WAYPOINT_COLORS['ingressPoint'] }}
        >
          Ingress
        </p>
      </Html>

      <mesh
        position={[4.1, 0, -10.5]}
        ref={refTarget}
        rotation={[0, degToRad(185), 0]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={WAYPOINT_COLORS['targetPoint']} />
      </mesh>
      <Html
        position={[4.1, 1.3, -10.5]}
        center
        wrapperClass={styles.htmlWrapper}
      >
        <p
          className={styles.htmlText}
          style={{ outlineColor: WAYPOINT_COLORS['targetPoint'] }}
        >
          Target
        </p>
      </Html>

      <mesh
        position={[1.7, 0, -22]}
        ref={refEgress}
        rotation={[0, degToRad(175), 0]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={WAYPOINT_COLORS['egressPoint']} />
      </mesh>
      <Html
        position={[1.7, 1.52, -22]}
        center
        wrapperClass={styles.htmlWrapper}
      >
        <p
          className={styles.htmlText}
          style={{ outlineColor: WAYPOINT_COLORS['egressPoint'] }}
        >
          Egress
        </p>
      </Html>
    </>
  );
}
export default HomeWaypoint;
