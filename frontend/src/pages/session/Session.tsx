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
import MapSettings from '../../components/mapComponents/MapSettings';
import KeySelect from '../../components/mapComponents/KeySelect';
import { useRef } from 'react';
import * as THREE from 'three';
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

  useEffect(() => {
    if (!username || !slug) return;
    SpecificSessionData(username, slug).then(setSessionData);
  }, [username, slug]);

  console.log(sessionData);

  const resetCamera = () => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.object.position.copy(DEFAULT_CAMERA_POSITION);
    controls.target.copy(DEFAULT_TARGET);
    controls.update();
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
            maxDistance={8.5}
            panSpeed={1.35}
            target={DEFAULT_TARGET.toArray()}
            maxPolarAngle={1.5}
            zoomSpeed={5}
            //zoomToCursor
          />
          <color args={['#000000']} attach="background" />

          <Map />
          {import.meta.env.DEV && <PerfMonitor onUpdate={setPerf} />}
        </Canvas>

        <KeySelect resetCamera={resetCamera} />
        <MapSettings />
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
