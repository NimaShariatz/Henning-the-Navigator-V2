// components/PerfMonitor.tsx — must render as a child of <Canvas>
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export interface PerfStats {
  fps: number;
  frameMs: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

function PerfMonitor({ onUpdate }: { onUpdate: (s: PerfStats) => void }) {
  const { gl } = useThree();
  const frames = useRef(0);
  const lastTime = useRef<number | null>(null);

  useFrame((_, delta) => {
    frames.current += 1;
    const now = performance.now();
    if (lastTime.current === null) {
      lastTime.current = now;
    }
    const elapsed = now - lastTime.current;

    if (elapsed >= 500) {
      // sample twice a second to avoid re-render spam
      onUpdate({
        fps: Math.round((frames.current * 1000) / elapsed),
        frameMs: delta * 1000,
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      });
      frames.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}
export default PerfMonitor;
