import { useGLTF, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { Stalingrad, blenderTable, blenderLamp } from '../../constants';
import { useTexture } from '@react-three/drei';

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
      <primitive object={table.scene} position={[0, 0, 0]} scale={0.5} />
      <primitive object={lamp.scene} position={[0, 4.5, 0]} scale={0.3} />

      <spotLight
        ref={spotLightHelper}
        intensity={65}
        color={'#e6e4de'}
        position={[0, 5.3, 0]}
        penumbra={1.7}
        angle={0.9}
      ></spotLight>

      <pointLight
        ref={pointLightHelper}
        decay={1}
        color={'#f4bb40'}
        intensity={7}
        position={[0, 6.3, 1]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.355, 0]}>
        <planeGeometry args={[7.5, 4.8123]} />
        <meshStandardMaterial map={mapTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}
export default Map;
