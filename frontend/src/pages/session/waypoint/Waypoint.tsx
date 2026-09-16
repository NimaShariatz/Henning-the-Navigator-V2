import './waypoint.module.css';
import * as THREE from 'three';

interface waypointProps {
  waypointType: string;
}

// maps each waypoint type to its display color
const WAYPOINT_COLORS: Record<string, string> = {
  startPoint: '#33b9ea',
  navigationPoint: '#ffc90e',
  targetPoint: '#ae3232',
  egressPoint: '#2ee31e',
};

function Waypoint({ waypointType }: waypointProps) {
  const color = WAYPOINT_COLORS[waypointType] ?? '#ffc90e';
  return (
    <mesh rotation={[THREE.MathUtils.degToRad(180), 0, 0]}>
      <octahedronGeometry args={[0.06, 0]} />
      <meshLambertMaterial transparent color={color} opacity={0.725} />
    </mesh>
  );
}
export default Waypoint;
