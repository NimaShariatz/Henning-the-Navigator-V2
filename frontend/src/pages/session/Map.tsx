import {
  useGLTF,
  useTexture,
  Text,
  Html,
  Instances,
  Instance,
} from '@react-three/drei';
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
import type {
  Commentpoint,
  OptionSelected,
  Targetpoint,
  Waypoint,
} from '../../constants';
import {
  TARGET_OPTION_KEYS,
  WAYPOINT_OPTION_KEYS,
  WAYPOINT_COLORS,
} from '../../constants';
import styles from './Session.module.css';

interface MapProps {
  revealSettingsSetter: () => void;
  mapLightObjectValues: Record<string, number>;
  revealFlightInfoSetter: () => void;
  sessionMap: string;
  sessionTitle: string;
  optionSelected: OptionSelected;
  waypoints: Waypoint[];
  addWaypoint: (x: number, y: number, type: string) => void;
  //setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  targets: Targetpoint[];
  addTarget: (
    x: number,
    y: number,
    z: number,
    rotation: number,
    type: string,
  ) => void;
  //setTargets: React.Dispatch<React.SetStateAction<Targetpoint[]>>;
  comments: Commentpoint[];
  addComment: (x: number, y: number, text: string) => void;
  //setComments: React.Dispatch<React.SetStateAction<Commentpoint[]>>;
  RemoveNavPoint: (id: number) => void;
}

function Map({
  revealSettingsSetter,
  mapLightObjectValues,
  revealFlightInfoSetter,
  sessionMap,
  sessionTitle,
  optionSelected,
  waypoints,
  addWaypoint,
  //setWaypoints,
  //targets, --- UNCOMMENT WHEN READY
  addTarget,
  //setTargets,
  //comments, --- UNCOMMENT WHEN READY
  addComment,
  //setComments,
  RemoveNavPoint,
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

  const mapClicked = (x: number, y: number) => {
    // onClick....
    //if the thing true is a waypoint
    const activeWaypointType = WAYPOINT_OPTION_KEYS.find(
      (key) => optionSelected[key],
    );
    if (activeWaypointType) {
      addWaypoint(x, y, activeWaypointType);
      //console.log(waypoints)
      return;
    }
    //if the thing true is a target
    const activeTargetType = TARGET_OPTION_KEYS.find(
      (key) => optionSelected[key],
    );
    if (activeTargetType) {
      addTarget(x, y, 0, 0, activeTargetType);
      //console.log(targetpoints)
      return;
    }
    // the thing true is comment
    if (optionSelected.comment) {
      addComment(x, y, 'some kewl new text');
      return;
    }
  };

  return (
    <group position={[0, -1, -1.5]}>
      <primitive object={table.scene} position={[0, 0, 0]} scale={0.92} />
      <primitive object={lamp.scene} position={[0, 6.2, -0.4]} scale={0.45} />
      <Text
        position={[-0, 0.63, -7]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        font={fontPath900}
        color="#fdfdfd"
        fontSize={1}
      >
        {sessionMap}
      </Text>
      <Text
        position={[-0, 0.63, -6.2]}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
        font={fontPath600}
        color="#fdfdfd"
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

      <group position={[0, 0.63, 1]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(event) => {
            event.stopPropagation();
            const { xLenght, yHeight } = MapImagesSizes[sessionMap];
            const x = (event.uv!.x - 0.5) * xLenght;
            const y = -(event.uv!.y - 0.5) * yHeight;
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
        <Instances limit={50} frustumCulled={false}>
          {' '}
          {/* max 50. frustumCalled turned off so it still renders on orbit zoom */}
          {/* Since all waypoints share the same geometry and only differ by position/color, you can render them all in a single draw call using instancing.
          So this avoides a ridicoulus amount of draw calls which would tank FPS*/}
          <octahedronGeometry args={[0.06, 0]} />
          <meshLambertMaterial transparent opacity={0.725} />
          {waypoints.map((point) => (
            <Instance
              key={point.id}
              position={[point.x, 0.06, point.y]}
              rotation={[THREE.MathUtils.degToRad(180), 0, 0]}
              color={WAYPOINT_COLORS[point.type] ?? '#ffc90e'}
            >
              <Html
                center
                wrapperClass={styles.waypointTextHTML}
                position={[0, -0.1, 0]}
                zIndexRange={[1, 0]} // default is [16777271, 0]
              >
                <div
                  className={styles.waypointIdContainer}
                  style={{
                    outlineColor:
                      WAYPOINT_COLORS[point.type] ?? 'var(--logo_yellow)',
                  }}
                >
                  <p className={styles.waypointId}>{point.id}</p>
                  <p
                    className={styles.removeWaypoint}
                    onClick={() => RemoveNavPoint(point.id)}
                  >
                    Remove waypoint
                  </p>
                </div>
              </Html>
            </Instance>
          ))}
        </Instances>
      </group>

      <Gear revealSettingsSetter={revealSettingsSetter} />
      <Clipboard revealFlightInfoSetter={revealFlightInfoSetter} />
    </group>
  );
}
export default Map;
