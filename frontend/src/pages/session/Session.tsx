import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { SpecificSessionData } from '../../api/Session';
import type { SessionDetailedItem } from '../../api/Session';
import styles from './Session.module.css';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Map from './Map';
import Menu from '../../components/menu/Menu';
import MapSettings from '../../components/mapComponents/MapSettings';
import KeySelect from '../../components/mapComponents/KeySelect';

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

function Session() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [sessionData, setSessionData] =
    useState<SessionDetailedItem>(emptySessionData);

  useEffect(() => {
    if (!username || !slug) return;
    SpecificSessionData(username, slug).then(setSessionData);
  }, [username, slug]);

  console.log(sessionData);

  return (
    <>
      <Menu />
      <div className={styles.canvasContainer}>
        <Canvas camera={{ fov: 45, near: 0.1, far: 300 }}>
          <OrbitControls
            rotateSpeed={0.4}
            makeDefault
            maxDistance={8.5}
            panSpeed={1.35}
            target={[0, 0, 0]}
            maxPolarAngle={1.5}
            zoomSpeed={2}
            zoomToCursor
          />
          <color args={['#000000']} attach="background" />

          <Map />
        </Canvas>

        <KeySelect />
        <MapSettings />
      </div>
    </>
  );
}
export default Session;
