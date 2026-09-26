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
import {
  type Textpoint,
  type OptionKey,
  type OptionSelected,
  type Targetpoint,
  type Waypoint,
  type Frontline,
  MAX_WAYPOINTS,
  MAX_FRONTLINES,
  MAX_TEXTS,
} from '../../constants';
import PerfMonitor from '../../components/PerfMonitor/PerfMonitor';
import Toast from '../../components/toast/Toast';
import EditText from './text/EditText';

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
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg); //reveal
    setTimeout(() => setToastMessage(''), 4000); // toast is removed when message is empty due to conditional render
  };

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [sessionData, setSessionData] =
    useState<SessionDetailedItem>(emptySessionData);

  const [popupRevealer, setPopupRevealer] = useState({
    settings: false,
    flightInfo: false,
    editText: false,
  });

  const [mapLightObjectValues, setMapLightObjectValues] = useState<
    Record<string, number>
  >({
    Spotlight: 4,
    Pointlight: 8,
    scaleFactor: 1,
  });
  const [isKilometers, setIsKilometers] = useState(true);

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
    text: false,
    frontline: false,
  });
  const [waypointId, setWaypointId] = useState(1);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]); // see constants .tsx for its structure
  const [targets, setTargets] = useState<Targetpoint[]>([]); // see constants .tsx for its structure
  const [texts, setTexts] = useState<Textpoint[]>([]); // see constants .tsx for its structure
  const [textClicked, setTextClicked] = useState(-1);
  const [frontlines, setFrontlines] = useState<Frontline[]>([]); // see constants .tsx for its structure
  const [firstFrontlineClickData, setFirstFrontlineClickData] = useState<{
    xStart: number | null;
    yStart: number | null;
  }>({ xStart: null, yStart: null });
  const [color, setColor] = useState('#b91515');

  const waypointIdSetter = (newId: number) => {
    setWaypointId(newId);
  };

  const addWaypoint = (x: number, y: number, type: string) => {
    if (waypoints.length >= MAX_WAYPOINTS) {
      showToast(`Max waypoints of ${MAX_WAYPOINTS} reached`);
      return;
    } // stop once the render limit is reached

    const existingIndex = waypoints.findIndex((w) => w.id === waypointId);

    if (existingIndex !== -1) {
      // id already in use -> reposition instead of duplicating
      const updated = [...waypoints];
      updated[existingIndex] = { ...updated[existingIndex], x, y, type };
      setWaypoints(updated);
      return;
    }

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
      id: targets.length > 0 ? Math.max(...targets.map((w) => w.id)) + 1 : 1,
      x: x,
      y: y,
      z: z,
      rotation: rotation,
      type: type,
    };
    setTargets([...targets, newTarget]);
  };

  const addText = (
    x: number,
    y: number,
    text: string,
    rotation: number,
    size: number,
  ) => {
    if (texts.length >= MAX_TEXTS) {
      showToast(`Max texts of ${MAX_TEXTS} reached`);
      return;
    } // stop once the render limit is reached
    const newText = {
      id: texts.length > 0 ? Math.max(...texts.map((w) => w.id)) + 1 : 1,
      x: x,
      y: y,
      text: text,
      color: color,
      rotation: rotation,
      size: size,
    };
    setTexts([...texts, newText]);
  };

  const addFrontline = (
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
  ) => {
    if (frontlines.length >= MAX_FRONTLINES) {
      showToast(`Max lines of ${MAX_FRONTLINES} reached`);
      return;
    } // stop once the render limit is reached
    const newFrontline = {
      id:
        frontlines.length > 0
          ? Math.max(...frontlines.map((w) => w.id)) + 1
          : 1,
      start: [{ x: xStart, y: yStart }],
      end: [{ x: xEnd, y: yEnd }],
      color: color,
    };
    setFrontlines([...frontlines, newFrontline]);
  };

  const clearWaypoints = () => {
    setWaypoints([]);
    setWaypointId(1);
  };
  const clearTargets = () => {
    setTargets([]);
  };
  const clearTexts = () => {
    setTexts([]);
  };
  const clearFrontlines = () => {
    setFrontlines([]);
    setFirstFrontlineClickData({ xStart: null, yStart: null });
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
    setWaypointId(waypoints.length);
  };

  const selectOption = (option: OptionKey) => {
    if (
      !optionSelected.frontline &&
      firstFrontlineClickData.xStart != null &&
      firstFrontlineClickData.yStart != null
    ) {
      setFirstFrontlineClickData({ xStart: null, yStart: null });
    }

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
  const revealEditTextSetter = (idClicked: number) => {
    setPopupRevealer((prev) => ({ ...prev, editText: !prev.editText }));
    setTextClicked(idClicked);
  };

  return (
    <>
      <Menu />
      {toastMessage && <Toast ToastMessage={toastMessage} />}
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
            targets={targets}
            addTarget={addTarget}
            texts={texts}
            addText={addText}
            revealEditTextSetter={revealEditTextSetter}
            frontlines={frontlines}
            addFrontline={addFrontline}
            firstFrontlineClickData={firstFrontlineClickData}
            setFirstFrontlineClickData={setFirstFrontlineClickData}
            RemoveNavPoint={RemoveNavPoint}
            isKilometers={isKilometers}
          />
          {import.meta.env.DEV && <PerfMonitor onUpdate={setPerf} />}
        </Canvas>

        <Selection
          optionSelected={optionSelected}
          selectOption={selectOption}
          clearWaypoints={clearWaypoints}
          clearTargets={clearTargets}
          clearTexts={clearTexts}
          clearFrontlines={clearFrontlines}
          waypoints={waypoints}
          waypointId={waypointId}
          setWaypointId={waypointIdSetter}
          color={color}
          setColor={setColor}
        />
        <KeySelect resetCamera={resetCamera} />

        <Settings
          revealSettings={popupRevealer.settings}
          revealSettingsSetter={revealSettingsSetter}
          mapLightObjectValues={mapLightObjectValues}
          setMapLightObjectValues={setMapLightObjectValues}
          isKilometers={isKilometers}
          setIsKilometers={setIsKilometers}
        />
        <FlightInfo
          revealFlightInfo={popupRevealer.flightInfo}
          revealFlightInfoSetter={revealFlightInfoSetter}
          sessionData={sessionData.sessionInfo}
        />
        <EditText
          revealEditText={popupRevealer.editText}
          revealEditTextSetter={revealEditTextSetter}
          textClicked={textClicked}
          texts={texts}
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
