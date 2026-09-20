import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { SpecificSessionData } from '../../api/Session';
import type { SessionDetailedItem } from '../../api/Session';
import styles from './Session.module.css';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Canvas } from '@react-three/fiber';
import Map from './Map';
import Menu from '../../components/menu/Menu';
import KeySelect from './keySelect/KeySelect';
import { useRef } from 'react';
import * as THREE from 'three';
import Settings from './settings/Settings';
import FlightInfo from './flightInfo/FlightInfo';
import Selection from './selection/Selection';
import type {
  Commentpoint,
  OptionKey,
  OptionSelected,
  Targetpoint,
  Waypoint,
} from '../../constants';
import PerfMonitor from '../../components/PerfMonitor/PerfMonitor';

export interface PerfStats {
  fps: number;
  frameMs: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

const emptySessionData: SessionDetailedItem = {
  slug: '',
  title: '',
  map_selected: '',
  all_can_edit: true,
  permitted_to_edit: [],
  sessionInfo: '',
  created_at: '',
  last_updated: '',
};

// desired camera position & look-at target for the reset view
const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 2, 4);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function Session() {
  const [perf, setPerf] = useState<PerfStats | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [sessionData, setSessionData] =
    useState<SessionDetailedItem>(emptySessionData);

  const [popupRevealer, setPopupRevealer] = useState({
    settings: false,
    flightInfo: false,
  });

  const [mapLightObjectValues, setMapLightObjectValues] = useState<
    Record<string, number>
  >({
    Spotlight: 4,
    Pointlight: 8,
    scaleFactor: 1,
  });

  const [optionSelected, setOptionSelected] = useState<OptionSelected>({
    startPoint: false,
    ingressPoint: false,
    targetPoint: false,
    egressPoint: false,
    radar: false,
    factory: false,
    city: false,
    railyard: false,
    train: false,
    oildepot: false,
    tank: false,
    ship: false,
    bridge: false,
    truck: false,
    defence: false,
    artillary: false,
    airfield: false,
    antiair: false,
    parachute: false,
    unknown: false,
    comment: false,
    frontline: false,
  });
  const [waypointId, setWaypointId] = useState(1);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]); // see constants .tsx for its structure
  const [targets, setTargets] = useState<Targetpoint[]>([]); // see constants .tsx for its structure
  const [comments, setComments] = useState<Commentpoint[]>([]); // see constants .tsx for its structure

  const waypointIdSetter = (newId: number) => {
    setWaypointId(newId);
  };

  const addWaypoint = (x: number, y: number, type: string) => {
    const existingIndex = waypoints.findIndex((w) => w.id === waypointId);

    if (existingIndex !== -1) {
      // id already in use -> reposition instead of duplicating
      const updated = [...waypoints];
      updated[existingIndex] = { ...updated[existingIndex], x, y };
      setWaypoints(updated);
      return;
    }

    if (waypoints.length >= 50) return; // stop once the render limit is reached

    const newWaypoint = {
      id: waypointId,
      x: x,
      y: y,
      type: type,
    };
    setWaypoints([...waypoints, newWaypoint]);
    setWaypointId(waypointId + 1);
  };

  const addTarget = (
    x: number,
    y: number,
    z: number,
    rotation: number,
    type: string,
  ) => {
    const newTarget = {
      id:
        waypoints.length > 0 ? Math.max(...waypoints.map((w) => w.id)) + 1 : 1,
      x: x,
      y: y,
      z: z,
      rotation: rotation,
      type: type,
    };
    setTargets([...targets, newTarget]);
  };

  const addComment = (x: number, y: number, text: string) => {
    const newComment = {
      id:
        waypoints.length > 0 ? Math.max(...waypoints.map((w) => w.id)) + 1 : 1,
      x: x,
      y: y,
      text: text,
    };
    setComments([...comments, newComment]);
  };

  const clearWaypoints = () => {
    setWaypoints([]);
    setWaypointId(1);
  };
  const clearTargets = () => {
    setTargets([]);
  };
  const clearComments = () => {
    setComments([]);
  };

  const RemoveNavPoint = (id: number) => {
    const updatedPoints = waypoints
      .filter((point) => point.id !== id)
      .map((point) => {
        if (point.id > id) {
          return { ...point, id: point.id - 1 };
        }
        return point;
      });
    setWaypoints(updatedPoints);
    setWaypointId(waypointId - 1);
  };

  const selectOption = (option: OptionKey) => {
    setOptionSelected((prev: OptionSelected) => {
      const next = { ...prev };
      const isCurrentlyTrue = prev[option];
      for (const key of Object.keys(next) as OptionKey[]) {
        // takes in one of the options as input, sets it true, and sets every other option to false
        // toggle off if the clicked option was already active
        next[key] = isCurrentlyTrue ? false : key === option;
      }
      return next;
    });
  };

  useEffect(() => {
    if (!username || !slug) return;
    SpecificSessionData(username, slug).then(setSessionData);
  }, [username, slug]);

  const resetCamera = () => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.object.position.copy(DEFAULT_CAMERA_POSITION);
    controls.target.copy(DEFAULT_TARGET);
    controls.update();
  };

  const revealSettingsSetter = () => {
    setPopupRevealer((prev) => ({ ...prev, settings: !prev.settings }));
  };
  const revealFlightInfoSetter = () => {
    setPopupRevealer((prev) => ({ ...prev, flightInfo: !prev.flightInfo }));
  };

  return (
    <>
      <Menu />
      <div className={styles.canvasContainer}>
        <Canvas
          camera={{
            fov: 45,
            near: 0.1,
            far: 300,
            position: DEFAULT_CAMERA_POSITION.toArray(),
          }}
        >
          <OrbitControls
            ref={controlsRef}
            rotateSpeed={0.4}
            makeDefault
            maxDistance={14}
            panSpeed={1.35}
            target={DEFAULT_TARGET.toArray()}
            maxPolarAngle={1.5}
            zoomSpeed={5}
            //zoomToCursor
          />
          <color args={['#000000']} attach="background" />

          <Map
            revealSettingsSetter={revealSettingsSetter}
            mapLightObjectValues={mapLightObjectValues}
            revealFlightInfoSetter={revealFlightInfoSetter}
            sessionMap={sessionData.map_selected}
            sessionTitle={sessionData.title}
            optionSelected={optionSelected}
            waypoints={waypoints}
            addWaypoint={addWaypoint}
            //setWaypoints={setWaypoints}
            targets={targets}
            addTarget={addTarget}
            //setTargets={setTargets}
            comments={comments}
            addComment={addComment}
            //setComments={setComments}
            RemoveNavPoint={RemoveNavPoint}
          />
          {import.meta.env.DEV && <PerfMonitor onUpdate={setPerf} />}
        </Canvas>

        <Selection
          optionSelected={optionSelected}
          selectOption={selectOption}
          clearWaypoints={clearWaypoints}
          clearTargets={clearTargets}
          clearComments={clearComments}
          waypoints={waypoints}
          waypointId={waypointId}
          setWaypointId={waypointIdSetter}
        />
        <KeySelect resetCamera={resetCamera} />

        <Settings
          revealSettings={popupRevealer.settings}
          revealSettingsSetter={revealSettingsSetter}
          mapLightObjectValues={mapLightObjectValues}
          setMapLightObjectValues={setMapLightObjectValues}
        />
        <FlightInfo
          revealFlightInfo={popupRevealer.flightInfo}
          revealFlightInfoSetter={revealFlightInfoSetter}
          sessionData={sessionData.sessionInfo}
        />

        {import.meta.env.DEV && perf && (
          <div className={styles.perfOverlay}>
            {perf.fps} fps · {perf.frameMs.toFixed(2)} ms · calls {perf.calls} ·
            tris {perf.triangles} · geo {perf.geometries} · tex {perf.textures}
          </div>
        )}
      </div>
    </>
  );
}
export default Session;
