import { useGLTF } from '@react-three/drei';
import styles from './tableObjects.module.css';
import { blenderLightbulb } from '../../../constants';
import { Html } from '@react-three/drei';
import { useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';

// later, create a Ref for version control. on every patch or push, check if local version == db version. if so, do the push/patch. If not,

interface LightbulbProps {
  updateSession: () => Promise<void>;
}

function Lightbulb({ updateSession }: LightbulbProps) {
  const lightbulb = useGLTF(blenderLightbulb);
  const [revealHTML, setRevealHTML] = useState(false);

  return (
    <>
      <group position={[-4.5, 0.6, -7.2]}>
        <primitive
          object={lightbulb.scene}
          scale={0.6}

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
