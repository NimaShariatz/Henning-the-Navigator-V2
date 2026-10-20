import {
  blenderAirfield,
  blenderArtillary,
  blenderBridge,
  blenderCity,
  blenderDefence,
  blenderFactory,
  blenderParadrop,
  blenderRadar,
  blenderShip,
  blenderTank,
  blenderTrain,
  blenderTruck,
  WAYPOINT_COLORS,
} from '../../constants';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { degToRad } from 'three/src/math/MathUtils.js';

const targetsList: {
  position: [number, number, number];
  target: string;
}[] = [
  { position: [1, 0, 0], target: blenderRadar },
  { position: [-1, 0, 0], target: blenderFactory },
  { position: [3, 0, 0], target: blenderTrain },
  { position: [-3, 0, 0], target: blenderAirfield },

  { position: [1, 0, -2], target: blenderArtillary },
  { position: [-1, 0, -2], target: blenderDefence },
  { position: [3, 0, -2], target: blenderTank },
  { position: [-3, 0, -2], target: blenderCity },

  { position: [1, 0, -4], target: blenderParadrop },
  { position: [-1, 0, -4], target: blenderTruck },
  { position: [3, 0, -4], target: blenderBridge },
  { position: [-3, 0, -4], target: blenderShip },
];

function TargetPointSection() {
  return (
    <>
      <group rotation={[0, degToRad(50), 0]} position={[0.5, -1, 1.25]}>
        {targetsList.map((item, index) => (
          <Target
            key={index}
            position={item.position}
            target={item.target}
            scale={0.15}
          />
        ))}

        <pointLight
          intensity={10}
          decay={0}
          color={'#f0ebe1'}
          position={[0, 5, 0]}
        />

        <ambientLight intensity={1} color={'#f0ebe1'} />
      </group>
    </>
  );
}
export default TargetPointSection;

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
          opacity: 0.9,
          transparent: true,
        });
      }
    });
    return clone;
  }, [model]);

  return <primitive object={scene} position={position} scale={scale} />;
}
