import { useGLTF, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import {
  Stalingrad,
  blenderTable,
  blenderLamp,
  blenderGear,
} from '../../constants';
import { useTexture } from '@react-three/drei';

function Map() {
  const table = useGLTF(blenderTable);
  const lamp = useGLTF(blenderLamp);
  const gear = useGLTF(blenderGear);
  const mapTexture = useTexture(Stalingrad);

  const pointLightHelper = useRef<THREE.PointLight>(null!);
  const spotLightHelper = useRef<THREE.PointLight>(null!);

  useHelper(pointLightHelper, THREE.PointLightHelper, 0.3, 'teal');
  useHelper(spotLightHelper, THREE.SpotLightHelper, 'hotpink');

  return (
    <group position={[0, -0.8, -0.3]}>
      <primitive object={table.scene} position={[0, 0, 0]} scale={0.5} />
      <primitive object={lamp.scene} position={[0, 5.8, -0.4]} scale={0.25} />
      <primitive object={gear.scene} position={[-3, 0.38, -3.5]} scale={0.25} />

      <spotLight
        ref={spotLightHelper}
        intensity={75}
        color={'#f0ead8'}
        position={[0, 7, 0]}
        penumbra={1}
        angle={0.7}
      ></spotLight>

      <pointLight
        ref={pointLightHelper}
        decay={0.3}
        color={'#f5e0b2'}
        intensity={5}
        position={[0, 7, 0.7]}
      />

      <pointLight
        decay={1}
        color={'#edd08f'}
        intensity={0.5}
        position={[-3, 0.8, -3.6]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.355, 0]}>
        <planeGeometry args={[7.5, 4.8123]} />
        <meshStandardMaterial map={mapTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}
export default Map;
