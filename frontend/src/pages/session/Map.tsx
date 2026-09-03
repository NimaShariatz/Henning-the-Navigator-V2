import { useGLTF, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { Stalingrad, blenderTable, blenderLamp } from '../../constants';
import { useTexture } from '@react-three/drei';

/*
- bottom left
- shift, mouse, and scroll icons
- Settings [scale and lighting]
- bottom right
- Waypoints, Targets, message, frontline. left and right chevrons switch.
click opens a tooltip with options
- Colors: blue, red, grey [neutral]
*/

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
        intensity={60}
        color={'#e6e4de'}
        position={[0, 5.3, 0]}
        penumbra={2}
        angle={1.4}
      ></spotLight>

      <pointLight
        ref={pointLightHelper}
        decay={0.7}
        color={'#f8d892'}
        intensity={7}
        position={[0, 5, 0.6]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.355, 0]}>
        <planeGeometry args={[7.5, 4.8123]} />
        <meshStandardMaterial map={mapTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}
export default Map;
