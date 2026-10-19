import { useGLTF, useTexture } from '@react-three/drei';
//import styles from "./Home.module.css"
import { mapScreenshot, blenderHomePlane } from '../../constants';
import { degToRad } from 'three/src/math/MathUtils.js';

function HomeWaypointSection() {
  const mapScreenshotTexture = useTexture(mapScreenshot);
  const planeModel = useGLTF(blenderHomePlane);

  return (
    <>
      <primitive object={planeModel.scene} scale={0.25} />
      <mesh
        scale={0.04}
        rotation={[degToRad(-90), 0, 0]}
        position={[60, -5, 0]}
      >
        <planeGeometry args={[2529, 1186]} />
        <meshBasicMaterial map={mapScreenshotTexture} toneMapped={false} />
      </mesh>
    </>
  );
}
export default HomeWaypointSection;
