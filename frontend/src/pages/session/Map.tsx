import { useGLTF, useHelper, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { Stalingrad, blenderTable, blenderLamp } from '../../constants';
import Gear from './tableObjects/Gear';
import Clipboard from './tableObjects/Clipboard';
import fontPath900 from '../../fonts/saira/saira-v21-latin-900.ttf';
import fontPath600 from '../../fonts/saira/saira-v21-latin-600.ttf';

interface MapProps {
  revealSettingsSetter: () => void;
  mapLightObjectValues: Record<string, number>;
  revealFlightInfoSetter: () => void;
  sessionMap: string;
  sessionTitle: string;
}

function Map({
  revealSettingsSetter,
  mapLightObjectValues,
  revealFlightInfoSetter,
  sessionMap,
  sessionTitle,
}: MapProps) {
  const table = useGLTF(blenderTable);
  const lamp = useGLTF(blenderLamp);
  const mapTexture = useTexture(Stalingrad);

  const pointLightHelper = useRef<THREE.PointLight>(null!);
  const spotLightHelper = useRef<THREE.PointLight>(null!);
  useHelper(pointLightHelper, THREE.PointLightHelper, 0.3, 'teal');
  useHelper(spotLightHelper, THREE.SpotLightHelper, 'hotpink');

  return (
    <group position={[0, -1, -0.3]}>
      <primitive object={table.scene} position={[0, 0, 0]} scale={0.7} />
      <primitive object={lamp.scene} position={[0, 5.8, -0.4]} scale={0.35} />
      <Text
        position={[-0, 0.5, -5.3]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        font={fontPath900}
        color="white"
        fontSize={1}
      >
        {sessionMap}
      </Text>
      <Text
        position={[-0, 0.5, -4.6]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        font={fontPath600}
        color="white"
        fontSize={0.3}
      >
        {sessionTitle}
      </Text>

      <spotLight
        ref={spotLightHelper}
        intensity={mapLightObjectValues.Spotlight}
        color={'#f0ead8'}
        position={[0, 7, 0]}
        penumbra={1}
        angle={0.7}
      ></spotLight>

      <pointLight
        ref={pointLightHelper}
        intensity={mapLightObjectValues.Pointlight}
        decay={0.3}
        color={'#faeaca'}
        position={[0, 7, 0.7]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.485, 0]}>
        <planeGeometry args={[10.5, 6.73725]} />
        <meshStandardMaterial map={mapTexture} toneMapped={false} />
      </mesh>

      <Gear revealSettingsSetter={revealSettingsSetter} />
      <Clipboard revealFlightInfoSetter={revealFlightInfoSetter} />
    </group>
  );
}
export default Map;
