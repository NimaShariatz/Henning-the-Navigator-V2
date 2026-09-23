import HennLogo1 from './assets/img/Henning_logo.webp';
import HennLogo2 from './assets/img/Henning_logo2.webp';
import sessionHeader from './assets/img/session/session_bg.avif'; //https://unsplash.com/photos/3d-render-abstract-white-paper-background-layers-flat-fiber-structures-holes-macro-texture-_HUUfJX7Qks
import sessionBg from './assets/img/session/gis--contour-map2.png';

import a20 from './assets/img/home/a20.jpg';
import fw190 from './assets/img/home/fw190.jpg';
import heink from './assets/img/home/heink.jpg';
import nieup from './assets/img/home/nieup.jpg';
import ta152 from './assets/img/home/ta152.jpg';
import ww1 from './assets/img/home/ww1.jpg';
import yak from './assets/img/home/yak.jpg';

import lowResArras from './assets/img/lowResMaps/Arras.jpg';
import lowResKuban from './assets/img/lowResMaps/Kuban.jpg';
import lowResLapino from './assets/img/lowResMaps/Lapino.jpg';
import lowResMoscow from './assets/img/lowResMaps/Moscow.jpg';
import lowResNormandy from './assets/img/lowResMaps/Normandy.jpg';
import lowResNovosokolniki from './assets/img/lowResMaps/Novosokolniki.jpg';
import lowResOdessa from './assets/img/lowResMaps/Odessa.jpg';
import lowResProkhorovka from './assets/img/lowResMaps/Prokhorovka.jpg';
import lowResRheinland from './assets/img/lowResMaps/Rheinland.jpg';
import lowResStalingrad from './assets/img/lowResMaps/Stalingrad.jpg';
import lowResVluki from './assets/img/lowResMaps/Vluki.jpg';
import lowResWestern_front from './assets/img/lowResMaps/Western_front.jpg';

import Arras from './assets/img/maps/ArrasSaturate50.jpg';
import Kuban from './assets/img/maps/KubanSaturate50.png';
import Lapino from './assets/img/maps/LapinoSaturate50.jpg';
import Moscow from './assets/img/maps/MoscowSaturate50.jpg';
import Normandy from './assets/img/maps/NormandySaturate50.jpg';
import Novosokolniki from './assets/img/maps/NovosokolnikiSaturate50.jpg';
import Odessa from './assets/img/maps/OdessaSaturate50.jpg';
import Prokhorovka from './assets/img/maps/ProkhorovkaSaturate50.jpg';
import Rheinland from './assets/img/maps/RheinlandSaturate50.jpg';
import Stalingrad from './assets/img/maps/StalingradSaturate50.jpg';
import Vluki from './assets/img/maps/VlukiSaturate50.jpg';
import Western_front from './assets/img/maps/Western_frontSaturate50.jpg';

const lowResMapImages: Record<string, string> = {
  Arras: lowResArras,
  Kuban: lowResKuban,
  Lapino: lowResLapino,
  Moscow: lowResMoscow,
  Normandy: lowResNormandy,
  Novosokolniki: lowResNovosokolniki,
  Odessa: lowResOdessa,
  Prokhorovka: lowResProkhorovka,
  Rheinland: lowResRheinland,
  Stalingrad: lowResStalingrad,
  Vluki: lowResVluki,
  'Western Front': lowResWestern_front,
};
const MapImages: Record<string, string> = {
  Arras: Arras,
  Kuban: Kuban,
  Lapino: Lapino,
  Moscow: Moscow,
  Normandy: Normandy,
  Novosokolniki: Novosokolniki,
  Odessa: Odessa,
  Prokhorovka: Prokhorovka,
  Rheinland: Rheinland,
  Stalingrad: Stalingrad,
  Vluki: Vluki,
  'Western Front': Western_front,
};
const MapImagesSizes: Record<string, { xLenght: number; yHeight: number }> = {
  // max sizes possible due to table size restrictions: 14.2, 12.5
  Arras: { xLenght: 12.5, yHeight: 12.5 },
  Kuban: { xLenght: 14.2, yHeight: 9.810617 },
  Lapino: { xLenght: 12.493888, yHeight: 12.5 },
  Moscow: { xLenght: 12.458947, yHeight: 12.5 },
  Normandy: { xLenght: 11.21148, yHeight: 12.5 },
  Novosokolniki: { xLenght: 12.506112, yHeight: 12.5 },
  Odessa: { xLenght: 12.502014, yHeight: 12.5 },
  Prokhorovka: { xLenght: 12.505974, yHeight: 12.5 },
  Rheinland: { xLenght: 14.2, yHeight: 10.7068 },
  Stalingrad: { xLenght: 14.2, yHeight: 8.983 },
  Vluki: { xLenght: 14.2, yHeight: 8.8010779 },
  'Western Front': { xLenght: 14.2, yHeight: 11.15126 },
};

const Map10Kilometer: Record<string, number> = {
  //do console.log(Math.abs(pointX - nextPointX)) in Map.tsx/distanceHeadingCalculations()
  Arras: 1.065788195925882,
  Kuban: 0.34102682297936565,
  Lapino: 2.446202734225547,
  Moscow: 0.4361552731303727,
  Normandy: 0.36178803335554477,
  Novosokolniki: 2.4438576142465136,
  Odessa: 0.4024866607360202,
  Prokhorovka: 1.183398381910097,
  Rheinland: 0.35571897198819297,
  Stalingrad: 0.39801162698715575,
  Vluki: 0.8532383106774625,
  'Western Front': 0.39778910293291386,
};

export type OptionKey =
  | 'startPoint'
  | 'ingressPoint'
  | 'targetPoint'
  | 'egressPoint'
  | 'radar'
  | 'factory'
  | 'city'
  | 'railyard'
  | 'train'
  | 'oildepot'
  | 'tank'
  | 'ship'
  | 'bridge'
  | 'truck'
  | 'defence'
  | 'artillary'
  | 'airfield'
  | 'antiair'
  | 'parachute'
  | 'unknown'
  | 'text'
  | 'frontline';

export type OptionSelected = Record<OptionKey, boolean>;

export const TARGET_OPTION_KEYS: OptionKey[] = [
  'radar',
  'factory',
  'city',
  'railyard',
  'train',
  'oildepot',
  'tank',
  'ship',
  'bridge',
  'truck',
  'defence',
  'artillary',
  'airfield',
  'antiair',
  'parachute',
  'unknown',
];

export interface Waypoint {
  id: number;
  x: number;
  y: number;
  type: string;
}
export interface Targetpoint {
  id: number;
  x: number;
  y: number;
  z: number;
  rotation: number;
  type: string;
}
export interface Textpoint {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  rotation: number;
}
export interface Frontline {
  id: number;
  start: { x: number; y: number }[];
  end: { x: number; y: number }[];
  color: string;
}

export const WAYPOINT_OPTION_KEYS: OptionKey[] = [
  'startPoint',
  'ingressPoint',
  'targetPoint',
  'egressPoint',
];

export const WAYPOINT_COLORS: Record<string, string> = {
  startPoint: '#33b9ea',
  ingressPoint: '#ffc90e',
  targetPoint: '#ae3232',
  egressPoint: '#2ee31e',
};

export const DEFAULT_COLORSELECT_OPTIONS: Record<string, string> = {
  redTarget: '#b91515',
  blueTarget: '#1058a4',
  greyTarget: '#a7a7a7',
};

export const MAX_WAYPOINTS = 50; // max waypoints
export const MAX_FRONTLINES = 200; // max frontlines

import blenderTable from './assets/blender/threejsTable.glb';
import blenderLamp from './assets/blender/threejsLampBasic.glb';
import blenderGear from './assets/blender/threejsSettings2.glb';
import blenderClipboard from './assets/blender/threejsClipboard.glb';

export {
  HennLogo1,
  HennLogo2,
  a20,
  fw190,
  heink,
  nieup,
  ta152,
  ww1,
  yak,
  sessionHeader,
  sessionBg,
  Arras,
  Kuban,
  Lapino,
  Moscow,
  Normandy,
  Novosokolniki,
  Odessa,
  Prokhorovka,
  Rheinland,
  Stalingrad,
  Vluki,
  Western_front,
  lowResArras,
  lowResKuban,
  lowResLapino,
  lowResMoscow,
  lowResNormandy,
  lowResNovosokolniki,
  lowResOdessa,
  lowResProkhorovka,
  lowResRheinland,
  lowResStalingrad,
  lowResVluki,
  lowResWestern_front,
  lowResMapImages,
  MapImages,
  MapImagesSizes,
  Map10Kilometer,
  blenderTable,
  blenderLamp,
  blenderGear,
  blenderClipboard,
};
