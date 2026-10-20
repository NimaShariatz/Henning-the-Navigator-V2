import styles from './Home.module.css';
import { useFrame } from '@react-three/fiber';
import {
  useGLTF,
  useTexture,
  Html,
  Segment,
  Segments,
} from '@react-three/drei';
//import styles from "./Home.module.css"
import {
  mapScreenshot,
  blenderHomePlane,
  blenderCity,
  WAYPOINT_COLORS,
} from '../../constants';
import { degToRad } from 'three/src/math/MathUtils.js';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';

const targetsList: {
  position: [number, number, number];
  target: string;
  scale: number;
}[] = [{ position: [-20, 0, -3.4], target: blenderCity, scale: 0.2 }];

function HomeWaypointSection() {
  const { gl } = useThree();
  const mapScreenshotTexture = useTexture(mapScreenshot, (texture) => {
    (texture as THREE.Texture).anisotropy = gl.capabilities.getMaxAnisotropy();
  });
  const planeModel = useGLTF(blenderHomePlane);

  const propR = useMemo(() => {
    let found = null as THREE.Object3D | null;
    planeModel.scene.traverse((child) => {
      if (child.name === 'propR') found = child;
    });
    return found;
  }, [planeModel]);

  const propRRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    propRRef.current = propR;
  }, [propR]);

  useFrame((_state, delta) => {
    const prop = propRRef.current;
    if (prop) prop.rotation.x += delta * 1;
  });

  return (
    <>
      <primitive object={planeModel.scene} scale={0.25} />
      <group position={[45, -9, 0]}>
        <mesh
          scale={0.04}
          rotation={[degToRad(-90), 0, 0]}
          position={[0, 0, 0]}
        >
          <planeGeometry args={[2529, 1186]} />
          <meshBasicMaterial map={mapScreenshotTexture} toneMapped={false} />
        </mesh>

        {targetsList.map((item, index) => (
          <Target
            key={index}
            position={item.position}
            target={item.target}
            scale={item.scale}
          />
        ))}

        <mesh position={[-20, 0.7, 0]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshLambertMaterial color={WAYPOINT_COLORS['startPoint']} />
        </mesh>
        <mesh position={[-10, 0.7, 2]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshLambertMaterial color={WAYPOINT_COLORS['ingressPoint']} />
        </mesh>
        <mesh position={[-1, 0.7, 0]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshLambertMaterial color={WAYPOINT_COLORS['targetPoint']} />
        </mesh>
        <mesh position={[13, 0.7, -2]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshLambertMaterial color={WAYPOINT_COLORS['egressPoint']} />
        </mesh>

        <Segments lineWidth={5}>
          <Segment
            start={[-19.25, 0.7, 0.2]}
            end={[-11, 0.7, 1.95]}
            color={WAYPOINT_COLORS['ingressPoint']}
          />
          <Segment
            start={[-9, 0.7, 1.95]}
            end={[-2, 0.7, 0.1]}
            color={WAYPOINT_COLORS['targetPoint']}
          />
          <Segment
            start={[0, 0.7, -0.1]}
            end={[12, 0.7, -1.9]}
            color={WAYPOINT_COLORS['egressPoint']}
          />
        </Segments>

        <Html position={[-20, 1.5, 0]} center wrapperClass={styles.htmlWrapper}>
          <p
            className={styles.htmlText}
            style={{ outlineColor: WAYPOINT_COLORS['startPoint'] }}
          >
            Start
          </p>
        </Html>
        <Html position={[-10, 1.5, 2]} center wrapperClass={styles.htmlWrapper}>
          <p
            className={styles.htmlText}
            style={{ outlineColor: WAYPOINT_COLORS['ingressPoint'] }}
          >
            Ingress
          </p>
        </Html>

        <Html position={[-1, 1.5, 0]} center wrapperClass={styles.htmlWrapper}>
          <p
            className={styles.htmlText}
            style={{ outlineColor: WAYPOINT_COLORS['targetPoint'] }}
          >
            Target
          </p>
        </Html>

        <Html position={[13, 1.5, -2]} center wrapperClass={styles.htmlWrapper}>
          <p
            className={styles.htmlText}
            style={{ outlineColor: WAYPOINT_COLORS['egressPoint'] }}
          >
            Egress
          </p>
        </Html>

        <pointLight
          intensity={2}
          decay={0.4}
          color={'#f0ebe1'}
          position={[-20, 2, 0]}
        />

        <pointLight
          intensity={3}
          decay={1}
          color={'#f0ebe1'}
          position={[-10, 2, 2]}
        />

        <pointLight
          intensity={3}
          decay={1}
          color={'#f0ebe1'}
          position={[-1, 2, 0]}
        />

        <pointLight
          intensity={3}
          decay={1}
          color={'#f0ebe1'}
          position={[13, 2, -2]}
        />
      </group>
    </>
  );
}
export default HomeWaypointSection;

type TargetProps = {
  position: [number, number, number];
  target: string;
  scale: number;
};

function Target({ position, target, scale }: TargetProps) {
  const model = useGLTF(target);

  const scene = useMemo(() => {
    const clone = model.scene.clone();
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshLambertMaterial({
          color: WAYPOINT_COLORS.targetPoint,
          opacity: 0.65,
          transparent: true,
        });
      }
    });
    return clone;
  }, [model]);

  return <primitive object={scene} position={position} scale={scale} />;
}
