import { useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { SpecificSessionData } from '../../api/Session';
import type { SessionDetailedItem } from '../../api/Session';
import {
  connectSessionSocket,
  sendSocketMessage,
} from '../../api/SessionSocket';
import styles from './Session.module.css';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Canvas } from '@react-three/fiber';
import Map from './Map';
import Menu from '../../components/menu/Menu';
import KeySelect from './keySelect/KeySelect';
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
import EditTarget from './target/EditTarget';

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
  waypoints: [],
  targets: [],
  texts: [],
  frontlines: [],
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
  const wsRef = useRef<WebSocket | null>(null);
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
  const [waypointId, setWaypointId] = useState(1); // local cursor: which `order` slot gets placed/overwritten next
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]); // see constants .tsx for its structure
  const [targets, setTargets] = useState<Targetpoint[]>([]); // see constants .tsx for its structure
  const [targetClicked, setTargetClicked] = useState<string | null>(null);
  const [texts, setTexts] = useState<Textpoint[]>([]); // see constants .tsx for its structure
  const [textClicked, setTextClicked] = useState<string | null>(null);
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

    const existing = waypoints.find((w) => w.order === waypointId);

    if (existing) {
      // order already in use -> reposition instead of duplicating
      sendSocketMessage(wsRef.current, {
        kind: 'waypoint',
        action: 'update',
        data: { id: existing.id, x, y, type },
      });
      return;
    }

    sendSocketMessage(wsRef.current, {
      kind: 'waypoint',
      action: 'create',
      data: { order: waypointId, x, y, type },
    });
    setWaypointId(waypointId + 1);
  };

  const addTarget = (
    x: number,
    y: number,
    z: number,
    name: string,
    rotation: number,
    type: string,
    scale: number,
  ) => {
    sendSocketMessage(wsRef.current, {
      kind: 'target',
      action: 'create',
      data: { x, y, z, name, rotation, type, color, scale },
    });
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
    sendSocketMessage(wsRef.current, {
      kind: 'text',
      action: 'create',
      data: { x, y, text, color, rotation, size },
    });
  };

  const updateText = (
    id: string,
    text: string,
    color: string,
    rotation: number,
    size: number,
  ) => {
    sendSocketMessage(wsRef.current, {
      kind: 'text',
      action: 'update',
      data: { id, text, color, rotation, size },
    });
  };

  const updateTarget = (
    id: string,
    name: string,
    rotation: number,
    color: string,
    scale: number,
  ) => {
    sendSocketMessage(wsRef.current, {
      kind: 'target',
      action: 'update',
      data: { id, name, rotation, color, scale },
    });
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
    sendSocketMessage(wsRef.current, {
      kind: 'frontline',
      action: 'create',
      data: {
        start_x: xStart,
        start_y: yStart,
        end_x: xEnd,
        end_y: yEnd,
        color,
      },
    });
  };

  const clearWaypoints = () => {
    sendSocketMessage(wsRef.current, {
      kind: 'waypoint',
      action: 'clear',
      data: {},
    });
    setWaypointId(1);
  };
  const clearTargets = () => {
    sendSocketMessage(wsRef.current, {
      kind: 'target',
      action: 'clear',
      data: {},
    });
  };
  const clearTexts = () => {
    sendSocketMessage(wsRef.current, {
      kind: 'text',
      action: 'clear',
      data: {},
    });
  };
  const clearFrontlines = () => {
    sendSocketMessage(wsRef.current, {
      kind: 'frontline',
      action: 'clear',
      data: {},
    });
    setFirstFrontlineClickData({ xStart: null, yStart: null });
  };

  const RemoveNavPoint = (id: string) => {
    sendSocketMessage(wsRef.current, {
      kind: 'waypoint',
      action: 'delete',
      data: { id },
    });
  };

  const deleteText = (id: string) => {
    sendSocketMessage(wsRef.current, {
      kind: 'text',
      action: 'delete',
      data: { id },
    });
    revealEditTextSetter(null);
  };
  const deleteTarget = (id: string) => {
    sendSocketMessage(wsRef.current, {
      kind: 'target',
      action: 'delete',
      data: { id },
    });
    revealEditTargetSetter(null);
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
    SpecificSessionData(username, slug).then((data: SessionDetailedItem) => {
      setSessionData(data);
      setWaypoints(data.waypoints);
      setTargets(data.targets);
      setTexts(data.texts);
      setFrontlines(data.frontlines);
      setWaypointId(data.waypoints.length + 1);
    });
  }, [username, slug]);

  useEffect(() => {
    if (!username || !slug) return;

    const ws = connectSessionSocket(username, slug, (msg) => {
      if (msg.kind === 'error') {
        showToast(msg.message ?? 'Action not permitted');
        return;
      }

      const { kind, action, data } = msg;
      if (kind === 'waypoint') {
        if (action === 'create') {
          setWaypoints((prev) =>
            [...prev, data as unknown as Waypoint].sort(
              (a, b) => a.order - b.order,
            ),
          );
        }
        if (action === 'update') {
          setWaypoints((prev) =>
            prev.map((w) => (w.id === data?.id ? { ...w, ...data } : w)),
          );
        }
        if (action === 'delete') {
          setWaypoints((prev) => prev.filter((w) => w.id !== data?.id));
        }
        if (action === 'clear') setWaypoints([]);
      }
      if (kind === 'target') {
        if (action === 'create')
          setTargets((prev) => [...prev, data as unknown as Targetpoint]);
        if (action === 'update') {
          setTargets((prev) =>
            prev.map((t) => (t.id === data?.id ? { ...t, ...data } : t)),
          );
        }
        if (action === 'delete')
          setTargets((prev) => prev.filter((t) => t.id !== data?.id));
        if (action === 'clear') setTargets([]);
      }
      if (kind === 'text') {
        if (action === 'create')
          setTexts((prev) => [...prev, data as unknown as Textpoint]);
        if (action === 'update') {
          setTexts((prev) =>
            prev.map((t) => (t.id === data?.id ? { ...t, ...data } : t)),
          );
        }
        if (action === 'delete')
          setTexts((prev) => prev.filter((t) => t.id !== data?.id));
        if (action === 'clear') setTexts([]);
      }
      if (kind === 'frontline') {
        if (action === 'create')
          setFrontlines((prev) => [...prev, data as unknown as Frontline]);
        if (action === 'delete')
          setFrontlines((prev) => prev.filter((f) => f.id !== data?.id));
        if (action === 'clear') setFrontlines([]);
      }
    });

    wsRef.current = ws;
    return () => ws.close();
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
  const revealEditTextSetter = (idClicked: string | null) => {
    setPopupRevealer((prev) => ({ ...prev, editText: !prev.editText }));
    setTextClicked(idClicked);
  };
  const revealEditTargetSetter = (idClicked: string | null) => {
    setPopupRevealer((prev) => ({ ...prev, editTarget: !prev.editTarget }));
    setTargetClicked(idClicked);
  };

  return (
    <>
      <Menu />
      {toastMessage && <Toast ToastMessage={toastMessage} />}
      <div className={styles.canvasContainer}>
        {sessionData.map_selected && ( // dont mount the canvas until session has actually loaded
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
