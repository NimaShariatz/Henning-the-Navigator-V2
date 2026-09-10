import styles from './tableObjects.module.css';
import { useGLTF, Html } from '@react-three/drei';
import { blenderClipboard } from '../../../constants';
import { useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface ClipboardProps {
  revealFlightInfoSetter: () => void;
}

function Clipboard({ revealFlightInfoSetter }: ClipboardProps) {
  const clipboard = useGLTF(blenderClipboard);
  const [revealHTML, setRevealHTML] = useState(false);
  return (
    <>
      <group position={[4.8, 0.48, -5.4]}>
        <primitive
          object={clipboard.scene}
          rotation={[0, THREE.MathUtils.degToRad(60), 0]}
          scale={0.9}
          onClick={(e: ThreeEvent<PointerEvent>) => {
            revealFlightInfoSetter();
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
        {revealHTML && (
          <Html
            wrapperClass={styles.tableObjectHTML}
            center
            position={[0, 0.35, 0]}
          >
            <p>Flight Info</p>
          </Html>
        )}
      </group>
    </>
  );
}
export default Clipboard;
