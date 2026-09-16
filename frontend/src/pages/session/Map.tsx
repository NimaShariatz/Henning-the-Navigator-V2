import { useGLTF, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
//import { useRef } from 'react';
//import { useHelper } from '@react-three/drei';
import {
  blenderTable,
  blenderLamp,
  MapImages,
  MapImagesSizes,
} from '../../constants';
import Gear from './tableObjects/Gear';
import Clipboard from './tableObjects/Clipboard';
import fontPath900 from '../../fonts/saira/saira-v21-latin-900.ttf';
import fontPath600 from '../../fonts/saira/saira-v21-latin-600.ttf';
import { useThree } from '@react-three/fiber';
import { useState } from 'react';

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
  const { gl } = useThree();

  const mapTexture = useTexture(MapImages[sessionMap], (texture) => {
    (texture as THREE.Texture).anisotropy = gl.capabilities.getMaxAnisotropy();
  });

  //const pointLightHelper = useRef<THREE.PointLight>(null!);
  //const spotLightHelper = useRef<THREE.PointLight>(null!);
  //useHelper(pointLightHelper, THREE.PointLightHelper, 0.3, 'teal');
  //useHelper(spotLightHelper, THREE.SpotLightHelper, 'hotpink');

  const [targetpoints, setTargetpoints] = useState<
    { id: number; x: number; y: number; type: string }[]
  >([]);
  const mapClicked = (x: number, y: number) => {
    console.log(x, y);
  };

  return (
    <group position={[0, -1, -1.5]}>
      <primitive object={table.scene} position={[0, 0, 0]} scale={0.92} />
      <primitive object={lamp.scene} position={[0, 6.2, -0.4]} scale={0.45} />
      <Text
        position={[-0, 0.63, -7]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        font={fontPath900}
        color="white"
        fontSize={1}
      >
        {sessionMap}
      </Text>
      <Text
        position={[-0, 0.63, -6.2]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        font={fontPath600}
        color="white"
        fontSize={0.35}
      >
        {sessionTitle}
      </Text>

      <spotLight
        intensity={mapLightObjectValues.Spotlight}
        color={'#f0ead8'}
        position={[0, 8, 0.3]}
        penumbra={1}
        angle={0.9}
      ></spotLight>

      <pointLight
        intensity={mapLightObjectValues.Pointlight}
        decay={0.3}
        color={'#faeaca'}
        position={[0, 7.9, 1.3]}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.63, 1]}
        onClick={(event) => {
          event.stopPropagation();
          const { xLenght, yHeight } = MapImagesSizes[sessionMap];
          const x = (event.uv!.x - 0.5) * xLenght;
          const y = (event.uv!.y - 0.5) * yHeight;
          mapClicked(x, y);
        }}
      >
        <planeGeometry
          args={[
            MapImagesSizes[sessionMap].xLenght,
            MapImagesSizes[sessionMap].yHeight,
          ]}
        />
        <meshStandardMaterial map={mapTexture} toneMapped={false} />
      </mesh>

      <Gear revealSettingsSetter={revealSettingsSetter} />
      <Clipboard revealFlightInfoSetter={revealFlightInfoSetter} />
    </group>
  );
}
export default Map;
