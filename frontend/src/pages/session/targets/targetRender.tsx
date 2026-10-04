import './targets.module.css';
import {
  blenderRadar,
  blenderFactory,
  blenderCity,
  blenderRailyard,
  TargetModels,
  type Targetpoint,
  blenderTrain,
  blenderOildepot,
  blenderTank,
  blenderShip,
  blenderBridge,
  blenderTruck,
  blenderDefence,
  blenderArtillary,
  blenderAirfield,
  blenderParadrop,
  blenderCircle,
  blenderSquare,
  blenderUnknown,
} from '../../../constants';
import { useGLTF } from '@react-three/drei';
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { MapScaleAdjustment } from '../../../constants';

interface TargetRenderProps {
  targets: Targetpoint[];
  sessionMap: string;
}

function TargetRender({ targets, sessionMap }: TargetRenderProps) {
  const radar = useGLTF(blenderRadar);
  const factory = useGLTF(blenderFactory);
  const city = useGLTF(blenderCity);
  const train = useGLTF(blenderTrain);
  const railyard = useGLTF(blenderRailyard);
  const oildepot = useGLTF(blenderOildepot);
  const tank = useGLTF(blenderTank);
  const ship = useGLTF(blenderShip);
  const bridge = useGLTF(blenderBridge);
  const truck = useGLTF(blenderTruck);
  const defence = useGLTF(blenderDefence);
  const artillary = useGLTF(blenderArtillary);
  const airfield = useGLTF(blenderAirfield);
  const paradrop = useGLTF(blenderParadrop);
  const circle = useGLTF(blenderCircle);
  const square = useGLTF(blenderSquare);
  const uknown = useGLTF(blenderUnknown);

  // maps each unique model url to its loaded scene
  const sceneByUrl: Record<string, THREE.Group> = {
    [blenderRadar]: radar.scene,
    [blenderFactory]: factory.scene,
    [blenderCity]: city.scene,
    [blenderTrain]: train.scene,
    [blenderRailyard]: railyard.scene,
    [blenderOildepot]: oildepot.scene,
    [blenderTank]: tank.scene,
    [blenderShip]: ship.scene,
    [blenderBridge]: bridge.scene,
    [blenderTruck]: truck.scene,
    [blenderDefence]: defence.scene,
    [blenderArtillary]: artillary.scene,
    [blenderAirfield]: airfield.scene,
    [blenderParadrop]: paradrop.scene,
    [blenderCircle]: circle.scene,
    [blenderSquare]: square.scene,
    [blenderUnknown]: uknown.scene,
  };

  return (
    <>
      {targets.map((target) => (
        <TargetInstance
          key={target.id}
          scene={sceneByUrl[TargetModels[target.type]] ?? radar.scene}
          target={target}
          sessionMap={sessionMap}
        />
      ))}
    </>
  );
}

function TargetInstance({
  scene,
  target,
  sessionMap,
}: {
  scene: THREE.Group;
  target: Targetpoint;
  sessionMap: string;
}) {
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshLambertMaterial({
          color: target.color,
          transparent: true,
          opacity: 0.5,
        });
      }
    });
    return clone;
  }, [scene, target.color]);

  //supposedly good practice for if I ever add texture maps to the targets,, or per-instance shader
  //variations, this would be necassary. at the moment, it doesn't seem to have much real effect as
  //meshLambert materials are properly disposed of by the Garbage Collector anyhow...
  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          ((child as THREE.Mesh).material as THREE.Material).dispose();
        }
      });
    };
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      position={[target.x, 0.635, target.y + 1]}
      rotation={[0, THREE.MathUtils.degToRad(target.rotation), 0]}
      scale={0.25 * MapScaleAdjustment[sessionMap]}
    />
  );
}

export default TargetRender;
