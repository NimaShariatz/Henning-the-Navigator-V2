import { blenderTable } from '../../constants';
import { useGLTF, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { Stalingrad } from '../../constants';
import { useTexture } from '@react-three/drei';

function Map() {
  const table = useGLTF(blenderTable);
  const mapTexture = useTexture(Stalingrad);

  const pointLightHelper = useRef<THREE.PointLight>(null!);
  const spotLightHelper = useRef<THREE.PointLight>(null!);

  useHelper(pointLightHelper, THREE.PointLightHelper, 0.3, 'teal');
  useHelper(spotLightHelper, THREE.SpotLightHelper, 'hotpink');

  return (
    <group>
      <primitive object={table.scene} scale={0.4} />
      <pointLight
        ref={pointLightHelper}
        decay={1}
        color={'#ffdb8e'}
        intensity={6}
        position={[0, 2, 0]}
      />
      <spotLight
        ref={spotLightHelper}
        intensity={1}
        color={'#ffdb8e'}
        position={[0, 3, 0]}
        penumbra={1}
        angle={0.4}
      ></spotLight>
      <ambientLight intensity={0.8} color={'#ffefd7'} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <planeGeometry args={[6, 3.85]} />
        <meshStandardMaterial map={mapTexture} />
      </mesh>
    </group>
  );
}
export default Map;
