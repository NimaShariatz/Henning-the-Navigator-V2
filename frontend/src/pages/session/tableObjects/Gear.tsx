import styles from './Gear.module.css';
import { blenderGear } from '../../../constants';
//import * as THREE from 'three';
//import { useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
//import type { ThreeEvent } from '@react-three/fiber'

/*

          onClick={(e: ThreeEvent<PointerEvent>) => {
            revealSettingsSetter()  
          }}
*/

function Gear() {
  const gear = useGLTF(blenderGear);
  return (
    <group position={[-3.5, 0.42, -4]}>
      <primitive object={gear.scene} scale={0.3} />
      <pointLight
        decay={1}
        color={'#edd08f'}
        intensity={0.5}
        position={[0, 0.5, 0]}
      />
      <Html wrapperClass={styles.tableObjectHTML} center position={[0, 0.6, 0]}>
        <p>Settings</p>
      </Html>
    </group>
  );
}

export default Gear;
