import './targets.module.css';
import { blenderRadar, type Targetpoint } from '../../../constants';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface TargetRenderProps {
  targets: Targetpoint[];
}

function TargetRender({ targets }: TargetRenderProps) {
  const radar = useGLTF(blenderRadar);

  useEffect(() => {
    radar.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshLambertMaterial({
          color: 'red',
          transparent: true,
          opacity: 0.4,
        });
      }
    });
  }, [radar.scene]);

  return (
    <>
      {targets.map((target) => (
        <RadarInstance key={target.id} scene={radar.scene} target={target} />
      ))}
    </>
  );
}

function RadarInstance({
  scene,
  target,
}: {
  scene: THREE.Group;
  target: Targetpoint;
}) {
  // clone so each target gets its own Object3D instance in the scene graph
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={[target.x, 0.635, target.y + 1]}
      rotation={[0, THREE.MathUtils.degToRad(target.rotation), 0]}
      scale={0.025}
    />
  );
}

export default TargetRender;
