import { useGLTF } from '@react-three/drei';
import styles from './tableObjects.module.css';
import { blenderLightbulb } from '../../../constants';
import { Html } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// later, create a Ref for version control. on every patch or push, check if local version == db version. if so, do the push/patch. If not,

const FLASH_PEAK = 12;
const FLASH_DURATION = 0.4; // seconds

interface LightbulbProps {
  updateSession: () => Promise<void>;
  flashSignal: number;
}

function Lightbulb({ updateSession, flashSignal }: LightbulbProps) {
  const lightbulb = useGLTF(blenderLightbulb);
  const [revealHTML, setRevealHTML] = useState(false);
  const updateLight = useRef<THREE.PointLight>(null!);
  const flashTimer = useRef(0);

  useEffect(() => {
    if (flashSignal === 0) return;
    flashTimer.current = FLASH_DURATION;
    updateLight.current.intensity = FLASH_PEAK;
  }, [flashSignal]);

  useFrame((_state, delta) => {
    if (flashTimer.current <= 0) return;
    flashTimer.current = Math.max(0, flashTimer.current - delta);
    const t = flashTimer.current / FLASH_DURATION; // 1 right after click, 0 when done
    updateLight.current.intensity = FLASH_PEAK * t * t; // squared so it drops off quickly
  });

  return (
    <>
      <group position={[-4.5, 0.6, -7.2]}>
        <primitive
          object={lightbulb.scene}
          scale={0.5}
          onClick={(e: ThreeEvent<PointerEvent>) => {
            updateSession();
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
          ref={updateLight}
          position={[0, 0.75, 0]}
          color={'#ffbe1b'}
          intensity={0}
          decay={3}
        />

        {revealHTML && (
          <Html
            wrapperClass={styles.tableObjectHTML}
            center
            position={[0, 1, 0]}
            zIndexRange={[1, 0]} // default is [16777271, 0]
          >
            <p>Update Session</p>
          </Html>
        )}
      </group>
    </>
  );
}

export default Lightbulb;
