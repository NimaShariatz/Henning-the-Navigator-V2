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
  DEFAULT_COLORSELECT_OPTIONS,
  MAX_TARGETS,
} from '../../constants';
import PerfMonitor from '../../components/PerfMonitor/PerfMonitor';
import Toast from '../../components/toast/Toast';
import EditText from './text/EditText';
import EditTarget from './target/EditTarget';
import {
  CreateWaypoint,
  GetWaypoints,
  DeleteWaypoint,
  UpdateWaypoint,
  ClearWaypoints,
} from '../../api/points/Waypoint';
import {
  ClearTargets,
  CreateTarget,
  DeleteTarget,
  GetTargets,
  UpdateTarget,
} from '../../api/points/Target';
import {
  ClearTexts,
  CreateText,
  GetTexts,
  UpdateText,
} from '../../api/points/Text';

export interface PerfStats {
  fps: number;
  frameMs: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
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
  const [sessionIsLoading, setSessionIsLoading] = useState(true);
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
    editTarget: false,
  });

  const [mapLightObjectValues, setMapLightObjectValues] = useState<
    Record<string, number>
  >({
    Spotlight: 4,
    Pointlight: 8,
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
    paradrop: false,
    circle: false,
    square: false,
    unknown: false,
    text: false,
    frontline: false,
  });
  const [waypointId, setWaypointId] = useState(1);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]); // see constants .tsx for its structure
  const [targets, setTargets] = useState<Targetpoint[]>([]); // see constants .tsx for its structure
  const [targetClicked, setTargetClicked] = useState(-1);
  const [texts, setTexts] = useState<Textpoint[]>([]); // see constants .tsx for its structure
  const [textClicked, setTextClicked] = useState(-1);
  const [frontlines, setFrontlines] = useState<Frontline[]>([]); // see constants .tsx for its structure
  const [firstFrontlineClickData, setFirstFrontlineClickData] = useState<{
    xStart: number | null;
    yStart: number | null;
  }>({ xStart: null, yStart: null });
  const [color, setColor] = useState(DEFAULT_COLORSELECT_OPTIONS.redTarget);

  // runs on startup
  useEffect(() => {
    if (!username || !slug) return;
    Promise.all([
      SpecificSessionData(username, slug).then(setSessionData),
      GetWaypoints(username, slug).then((points) => {
        // derive waypointId from the data returned by GetWaypoints. dont do waypoints.length + 1 as that means its now a useEffect variable... unneccassary triggers
        setWaypoints(points);
        setWaypointId(points.length + 1);
      }),
      GetTargets(username, slug).then(setTargets),
      GetTexts(username, slug).then(setTexts),
    ]).finally(() => {
      setSessionIsLoading(false);
    });
  }, [username, slug]);

  const waypointIdSetter = (newId: number) => {
    setWaypointId(newId);
  };

  const addWaypoint = async (x: number, y: number, type: string) => {
    if (waypoints.length >= MAX_WAYPOINTS) {
      showToast(`Max waypoints of ${MAX_WAYPOINTS} reached`);
      return;
    } // stop once the render limit is reached

    const existingIndex = waypoints.findIndex((w) => w.id === waypointId);

    if (existingIndex !== -1) {
      // id already in use -> reposition instead of duplicating
      try {
        if (username && slug) {
          await UpdateWaypoint(username, slug, waypointId, { x, y, type });
          const allWaypoints = await GetWaypoints(username, slug);
          setWaypoints(allWaypoints);
        }
      } catch (err) {
        if (err instanceof Error) showToast(err.message);
      }

      return;
    }

    try {
      if (username && slug) {
        await CreateWaypoint(username, slug, { x, y, type });
        const allWaypoints = await GetWaypoints(username, slug);
        setWaypoints(allWaypoints);
        setWaypointId(allWaypoints.length + 1);
      }
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };

  const addTarget = async (
    x: number,
    y: number,
    z: number,
    name: string,
    rotation: number,
    type: string,
    scale: number,
  ) => {
    if (targets.length >= MAX_TARGETS) {
      showToast(`Max targets of ${MAX_TARGETS} reached`);
      return;
    } // stop once the render limit is reached

    try {
      if (username && slug) {
        await CreateTarget(username, slug, {
          x,
          y,
          z,
          name,
          rotation,
          type,
          scale,
          color,
        });
        const allTargets = await GetTargets(username, slug);
        setTargets(allTargets);
      }
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };

  const addText = async (
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

    try {
      if (username && slug) {
        await CreateText(username, slug, {
          x,
          y,
          text,
          color,
          rotation,
          size,
        });
        const allTexts = await GetTexts(username, slug);
        setTexts(allTexts);
      }
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };

  const updateText = async (
    id: number,
    text: string,
    color: string,
    rotation: number,
    size: number,
  ) => {
    try {
      if (username && slug) {
        await UpdateText(username, slug, id, {
          text,
          rotation,
          color,
          size,
        });
        const allTexts = await GetTexts(username, slug);
        setTexts(allTexts);
      }
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };

  const updateTarget = async (
    id: number,
    name: string,
    rotation: number,
    color: string,
    scale: number,
  ) => {
    try {
      if (username && slug) {
        await UpdateTarget(username, slug, id, {
          name,
          rotation,
          scale,
          color,
        });
        const allTargets = await GetTargets(username, slug);
        setTargets(allTargets);
      }
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
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
      Xstart: xStart,
      Ystart: yStart,
      Xend: xEnd,
      Yend: yEnd,
      color: color,
    };
    setFrontlines([...frontlines, newFrontline]);
  };

  const clearWaypoints = async () => {
    if (!username || !slug) return;
    try {
      await ClearWaypoints(username, slug);
      setWaypoints([]);
      setWaypointId(1);
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };
  const clearTargets = async () => {
    if (!username || !slug) return;
    try {
      await ClearTargets(username, slug);
      setTargets([]);
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };
  const clearTexts = async () => {
    if (!username || !slug) return;
    try {
      await ClearTexts(username, slug);
      setTexts([]);
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };
  const clearFrontlines = () => {
    setFrontlines([]);
    setFirstFrontlineClickData({ xStart: null, yStart: null });
  };

  const RemoveNavPoint = async (id: number) => {
    if (!username || !slug) return;
    try {
      await DeleteWaypoint(username, slug, id);
      const allWaypoints = await GetWaypoints(username, slug);
      setWaypoints(allWaypoints);
      setWaypointId(allWaypoints.length + 1);
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
  };

  const deleteText = (id: number) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    revealEditTextSetter(-1);
  };
  const deleteTarget = async (id: number) => {
    if (!username || !slug) return;
    try {
      await DeleteTarget(username, slug, id);
      const allWaypoints = await GetTargets(username, slug);
      setTargets(allWaypoints);
    } catch (err) {
      if (err instanceof Error) showToast(err.message);
    }
    revealEditTargetSetter(-1);
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
  const revealEditTargetSetter = (idClicked: number) => {
    setPopupRevealer((prev) => ({ ...prev, editTarget: !prev.editTarget }));
    setTargetClicked(idClicked);
  };

  return (
    <>
      <Menu />
      {toastMessage && <Toast ToastMessage={toastMessage} />}
      <div className={styles.canvasContainer}>
        {!sessionIsLoading && (
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
              revealEditTargetSetter={revealEditTargetSetter}
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
        )}

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
          sessionTitle={sessionData.title}
          mapSelected={sessionData.map_selected}
          setSessionData={setSessionData}
          username={username}
          slug={slug}
          waypoints={waypoints}
          targets={targets}
          texts={texts}
          frontlines={frontlines}
          setWaypoints={setWaypoints}
          setTargets={setTargets}
          setTexts={setTexts}
          setFrontlines={setFrontlines}
          setWaypointId={waypointIdSetter}
        />

        <FlightInfo
          revealFlightInfo={popupRevealer.flightInfo}
          revealFlightInfoSetter={revealFlightInfoSetter}
          sessionData={sessionData.sessionInfo}
          isKilometers={isKilometers}
          waypoints={waypoints}
          sessionMap={sessionData.map_selected}
        />
        <EditText
          revealEditText={popupRevealer.editText}
          revealEditTextSetter={revealEditTextSetter}
          textClicked={textClicked}
          texts={texts}
          updateText={updateText}
          deleteText={deleteText}
        />
        <EditTarget
          revealEditTarget={popupRevealer.editTarget}
          revealEditTargetSetter={revealEditTargetSetter}
          targetClicked={targetClicked}
          targets={targets}
          updateTarget={updateTarget}
          deleteTarget={deleteTarget}
        />

        {import.meta.env.DEV && perf && (
          <div className={styles.perfOverlay}>
            {perf.fps} fps · {perf.frameMs.toFixed(2)} ms · calls {perf.calls} ·
            tris {perf.triangles} · geo {perf.geometries} · tex {perf.textures}{' '}
            programs {perf.programs}
          </div>
        )}
      </div>
    </>
  );
}
export default Session;
