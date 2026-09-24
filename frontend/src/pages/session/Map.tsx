import {
  useGLTF,
  useTexture,
  Text,
  Html,
  Instances,
  Instance,
  Segment,
  Segments,
} from '@react-three/drei';
import * as THREE from 'three';
//import { useRef } from 'react';
//import { useHelper } from '@react-three/drei';
import {
  blenderTable,
  blenderLamp,
  MapImages,
  MapImagesSizes,
  Map10Kilometer,
} from '../../constants';
import Gear from './tableObjects/Gear';
import Clipboard from './tableObjects/Clipboard';
import fontPath900 from '../../fonts/saira/saira-v21-latin-900.ttf';
import fontPath600 from '../../fonts/saira/saira-v21-latin-600.ttf';
import { useThree } from '@react-three/fiber';
import type {
  Textpoint,
  OptionSelected,
  Targetpoint,
  Waypoint,
  Frontline,
} from '../../constants';
import {
  TARGET_OPTION_KEYS,
  WAYPOINT_OPTION_KEYS,
  WAYPOINT_COLORS,
  MAX_WAYPOINTS,
  MAX_FRONTLINES,
} from '../../constants';
import styles from './Session.module.css';
import * as React from 'react';

interface MapProps {
  revealSettingsSetter: () => void;
  mapLightObjectValues: Record<string, number>;
  revealFlightInfoSetter: () => void;
  sessionMap: string;
  sessionTitle: string;
  optionSelected: OptionSelected;
  waypoints: Waypoint[];
  addWaypoint: (x: number, y: number, type: string) => void;
  targets: Targetpoint[];
  addTarget: (
    x: number,
    y: number,
    z: number,
    rotation: number,
    type: string,
  ) => void;
  texts: Textpoint[];
  addText: (
    x: number,
    y: number,
    text: string,
    rotation: number,
    size: number,
    maxWidth: number,
  ) => void;
  revealEditTextSetter: () => void;
  frontlines: Frontline[];
  addFrontline: (
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
  ) => void;
  firstFrontlineClickData: { xStart: number | null; yStart: number | null };
  setFirstFrontlineClickData: (data: {
    xStart: number | null;
    yStart: number | null;
  }) => void;
  RemoveNavPoint: (id: number) => void;
  isKilometers: boolean;
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
  addTarget,
  texts,
  addText,
  revealEditTextSetter,
  frontlines,
  addFrontline,
  firstFrontlineClickData,
  setFirstFrontlineClickData,
  RemoveNavPoint,
  isKilometers,
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
      return;
    }
    //if the thing true is a target
    const activeTargetType = TARGET_OPTION_KEYS.find(
      (key) => optionSelected[key],
    );
    if (activeTargetType) {
      addTarget(x, y, 0, 0, activeTargetType);
      return;
    }
    // the thing true is text
    if (optionSelected.text) {
      addText(x, y, 'Text', 0, 0.05, 1);
      return;
    }

    if (optionSelected.frontline) {
      if (
        firstFrontlineClickData.xStart === null ||
        firstFrontlineClickData.yStart === null
      ) {
        // first click: remember the start point
        setFirstFrontlineClickData({ xStart: x, yStart: y });
      } else {
        // second click: we now have both ends, so create the frontline and reset
        addFrontline(
          firstFrontlineClickData.xStart,
          firstFrontlineClickData.yStart,
          x,
          y,
        );
        setFirstFrontlineClickData({ xStart: null, yStart: null });
      }
      return;
    }
  };

  const distanceHeadingCalculations = (
    pointX: number,
    pointY: number,
    nextPointX: number,
    nextPointY: number,
  ) => {
    const midX = (pointX + nextPointX) / 2;
    const midY = (pointY + nextPointY) / 2;

    const distanceX = nextPointX - pointX;
    const distanceY = nextPointY - pointY;

    const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const pixelLength = length;

    let distance = (pixelLength / Map10Kilometer[sessionMap]) * 10;
    if (!isKilometers) {
      distance = distance * 0.621371;
    }

    distance = Math.round(distance);

    //console.log(Math.abs(pointX - nextPointX))

    let angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI);

    angle = angle + 90; // to make 0 north instead ofeast
    angle = (angle + 360) % 360; //within 360 range
    const heading = Math.round(angle);

    return { midX, midY, distance, heading };
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
        color={'#f1efe8'}
        position={[0, 8, 0.3]}
        penumbra={1}
        angle={0.9}
      ></spotLight>

      <pointLight
        intensity={mapLightObjectValues.Pointlight}
        decay={0.3}
        color={'#f0ebe1'}
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
          <meshBasicMaterial map={mapTexture} toneMapped={false} />
        </mesh>
        <Instances limit={MAX_WAYPOINTS} frustumCulled={false}>
          {' '}
          {/* max 50. and frustumCalled turned off so it still renders on orbit zoom */}
          {/* Since all waypoints share the same geometry and only differ by position/color, you can render them all in a single draw call using instancing.
          So this avoides a ridicoulus amount of draw calls which would tank FPS*/}
          <octahedronGeometry args={[0.06, 0]} />
          <meshLambertMaterial transparent opacity={0.725} />
          {waypoints.map((point) => (
            <Instance
              key={point.id}
              position={[
                point.x,
                0.06 + mapLightObjectValues.scaleFactor * 0.005,
                point.y,
              ]}
              rotation={[THREE.MathUtils.degToRad(180), 0, 0]}
              color={WAYPOINT_COLORS[point.type] ?? '#ffc90e'}
              scale={mapLightObjectValues.scaleFactor}
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

        <Segments limit={MAX_WAYPOINTS - 1} lineWidth={1.5}>
          {' '}
          {/* 
            not using drei line with waypoints.map because of draw calls. 
            50 segments are created. They take triangles. if point exists, move and re-color it to x and y. else, render it far far away.
          */}
          {Array.from({ length: MAX_WAYPOINTS - 1 }, (_, i) => {
            const point = waypoints[i];
            const nextPoint = waypoints[i + 1];
            const y = 0.06 + mapLightObjectValues.scaleFactor * 0.005;

            if (!point || !nextPoint) {
              return (
                <Segment
                  key={`segment-slot-${i}`}
                  start={[0, -500, 0]}
                  end={[0, -500, 0]}
                  color="#000000"
                />
              );
            }

            const { midX, midY, distance, heading } =
              distanceHeadingCalculations(
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
              );

            return (
              <React.Fragment key={`segment-slot-${i}`}>
                {' '}
                {/*a fix for 'Each child in a list should have a unique "key" prop' */}
                <Segment
                  start={[point.x, y, point.y]}
                  end={[nextPoint.x, y, nextPoint.y]}
                  color={WAYPOINT_COLORS[nextPoint.type] ?? '#ffc90e'}
                />
                <Html
                  center
                  wrapperClass={styles.waypointTravelInfoHTML}
                  position={[midX, 0.1, midY]}
                  zIndexRange={[0.5, 0]}
                >
                  <div className={styles.waypointInfoContainer}>
                    <p>
                      {distance}&nbsp;{isKilometers ? 'km' : 'mi'} at {heading}°
                    </p>
                  </div>
                </Html>
              </React.Fragment>
            );
          })}
        </Segments>

        <Segments limit={MAX_FRONTLINES} lineWidth={5}>
          {Array.from({ length: MAX_FRONTLINES }, (_, i) => {
            const line = frontlines[i];

            if (!line) {
              return (
                <Segment
                  key={`frontline-${i}`}
                  start={[0, -501, 0]}
                  end={[0, -501, 0]}
                  color="#000000"
                />
              );
            }
            return (
              <Segment
                key={`frontline-${i}`}
                start={[line.start[0].x, 0.01, line.start[0].y]}
                end={[line.end[0].x, 0.01, line.end[0].y]}
                color={line.color}
              />
            );
          })}
        </Segments>
      </group>

      {texts.map((text) => (
        <Text
          key={text.id}
          rotation={[
            THREE.MathUtils.degToRad(-90),
            0,
            THREE.MathUtils.degToRad(text.rotation),
          ]}
          position={[text.x, 0.64, text.y + 1]}
          font={fontPath900}
          color={text.color}
          fontSize={text.size}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          maxWidth={text.maxWidth}
          onClick={(e) => {
            e.stopPropagation();
            revealEditTextSetter();
            //popup trigger here!
          }}
          onPointerEnter={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'default';
          }}
        >
          {text.text}
        </Text>
      ))}

      <Gear revealSettingsSetter={revealSettingsSetter} />
      <Clipboard revealFlightInfoSetter={revealFlightInfoSetter} />
    </group>
  );
}
export default Map;
