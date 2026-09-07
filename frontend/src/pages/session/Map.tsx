import { useGLTF, useHelper, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { Stalingrad, blenderTable, blenderLamp } from '../../constants';
import Gear from './tableObjects/Gear';

function Map() {
  const table = useGLTF(blenderTable);
  const lamp = useGLTF(blenderLamp);
  const mapTexture = useTexture(Stalingrad);

  const pointLightHelper = useRef<THREE.PointLight>(null!);
  const spotLightHelper = useRef<THREE.PointLight>(null!);
  useHelper(pointLightHelper, THREE.PointLightHelper, 0.3, 'teal');
  useHelper(spotLightHelper, THREE.SpotLightHelper, 'hotpink');

  return (
    <group position={[0, -0.8, -0.3]}>
      <primitive object={table.scene} position={[0, 0, 0]} scale={0.6} />
      <primitive object={lamp.scene} position={[0, 5.8, -0.4]} scale={0.3} />

      <spotLight
        ref={spotLightHelper}
        intensity={60}
        color={'#f0ead8'}
        position={[0, 7, 0]}
        penumbra={1}
        angle={0.7}
      ></spotLight>

      <pointLight
        ref={pointLightHelper}
        decay={0.3}
        color={'#f5e0b2'}
        intensity={6}
        position={[0, 7, 0.7]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
        <planeGeometry args={[9, 5.77479]} />
        <meshStandardMaterial map={mapTexture} toneMapped={false} />
      </mesh>

      <Gear />
    </group>
  );
}
export default Map;
