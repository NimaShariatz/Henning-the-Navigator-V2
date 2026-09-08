import styles from './Gear.module.css';
import { blenderGear } from '../../../constants';
//import * as THREE from 'three';
//import { useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';

interface GearProps {
  revealSettingsSetter: () => void;
}

function Gear({ revealSettingsSetter }: GearProps) {
  const gear = useGLTF(blenderGear);
  const [revealHTML, setRevealHTML] = useState(false);

  return (
    <group position={[-3.5, 0.42, -4]}>
      <primitive
        object={gear.scene}
        scale={0.3}
        onClick={(e: ThreeEvent<PointerEvent>) => {
          revealSettingsSetter();
          e.stopPropagation();
        }}
        onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
          document.body.style.cursor = 'pointer';
          setRevealHTML(true);
          e.stopPropagation();
        }}
        onPointerLeave={(e: ThreeEvent<PointerEvent>) => {
          document.body.style.cursor = 'default';
          setRevealHTML(false);
          e.stopPropagation();
        }}
      />
      <pointLight
        decay={1}
        color={'#edd08f'}
        intensity={0.5}
        position={[0, 0.5, 0]}
      />
      {revealHTML && (
        <Html
          wrapperClass={styles.tableObjectHTML}
          center
          position={[0, 0.5, 0]}
        >
          <p>Settings</p>
        </Html>
      )}
    </group>
  );
}

export default Gear;
