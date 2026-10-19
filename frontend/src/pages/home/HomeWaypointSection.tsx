import { useGLTF, useTexture } from '@react-three/drei';
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
import { useMemo } from 'react';

const targetsList: {
  position: [number, number, number];
  target: string;
  scale: number;
}[] = [{ position: [25, -10, -3], target: blenderCity, scale: 0.2 }];

function HomeWaypointSection() {
  const { gl } = useThree();
  const mapScreenshotTexture = useTexture(mapScreenshot, (texture) => {
    (texture as THREE.Texture).anisotropy = gl.capabilities.getMaxAnisotropy();
  });
  const planeModel = useGLTF(blenderHomePlane);

  return (
    <>
      <primitive object={planeModel.scene} scale={0.25} />
      <mesh
        scale={0.04}
        rotation={[degToRad(-90), 0, 0]}
        position={[45, -10, 0]}
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

      <pointLight
        intensity={5}
        decay={0.3}
        color={'#f0ebe1'}
        position={[25, -3, -3]}
      />
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
