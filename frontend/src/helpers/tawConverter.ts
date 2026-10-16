import {
  DEFAULT_COLORSELECT_OPTIONS,
  MAX_TARGETS,
  MapImagesSizes,
  type Frontline,
  type Targetpoint,
  type Textpoint,
  type Waypoint,
} from '../constants';

export interface TawLatLng {
  lat: number; // y, 0 at top, decreasing downward
  lng: number; // x, 0 at left
}

export interface TawPoint {
  latLng: TawLatLng;
  name: string;
  type: string; // "taw-af", "taw-city", "taw-def", "taw-depo", "taw-supply", "taw-train", "taw-tank", "stock-ship", "marker"
  color: string; // "blue", "red", "black"
  notes: string;
}

export interface TawJSON {
  revision: number;
  mapHash: string; // "" or "#kuban" etc.
  units: string;
  routes: unknown[];
  points: TawPoint[];
  circles: unknown[];
  polygons: unknown[];
}

// Keys match MapImagesSizes in constants.ts
const mapHashToName: Record<string, string> = {
  '#arras': 'Arras',
  '#kuban': 'Kuban',
  '#lapino': 'Lapino',
  '#moscow': 'Moscow',
  '#normandy': 'Normandy',
  '#novosokolniki': 'Novosokolniki',
  '#odessa': 'Odessa',
  '#prokhorovka': 'Prokhorovka',
  '#rheinland': 'Rheinland',
  '#stalingrad': 'Stalingrad',
  '': 'Stalingrad',
  '#luki': 'Vluki',
  '#western_front': 'Western Front',
};

// Right-edge lng of the TAW map; calibrate by importing il2 mission planner files. change numbers as needed
const tawMapWidth: Record<string, { xVal: number; yVal: number }> = {
  // the higher the number, the more it goes to the top left corner
  Arras: { xVal: 163.5, yVal: 163.7 },
  Kuban: { xVal: 144.3, yVal: 144.5 },
  Lapino: { xVal: 220, yVal: 200 }, // Lapino il2 map and henning map are different...
  Moscow: { xVal: 194.3, yVal: 194.5 },
  Normandy: { xVal: 125.7, yVal: 125.8 },
  Novosokolniki: { xVal: 256, yVal: 256 },
  Odessa: { xVal: 191.5, yVal: 192 },
  Prokhorovka: { xVal: 163.8, yVal: 164 },
  Rheinland: { xVal: 139.3, yVal: 149 },
  Stalingrad: { xVal: 256, yVal: 259.5 },
  Vluki: { xVal: 255.3, yVal: 254.5 },
  'Western Front': { xVal: 217.2, yVal: 219.4 },
};

const tawTypeToHenning: Record<string, string> = {
  'taw-af': 'airfield',
  'taw-city': 'city',
  'taw-def': 'defence',
  'taw-depo': 'factory',
  'taw-bridge': 'bridge',
  'taw-arta': 'artillary',
  'taw-supply': 'truck',
  'taw-train': 'train',
  'taw-tank': 'tank',
  'stock-ship': 'ship',
};

const tawColorToHenning: Record<string, string> = {
  red: DEFAULT_COLORSELECT_OPTIONS.redTarget,
  blue: DEFAULT_COLORSELECT_OPTIONS.blueTarget,
  black: DEFAULT_COLORSELECT_OPTIONS.greyTarget,
};

export interface HenningImportData {
  mapSelected: string;
  waypoints: Waypoint[];
  targets: Targetpoint[];
  texts: Textpoint[];
  frontlines: Frontline[];
}

export const tawConverter = (
  data: Record<string, unknown>,
): HenningImportData | null => {
  try {
    const mapHash = (data.mapHash as string) ?? '';
    const mapSelected = mapHashToName[mapHash];
    const width = tawMapWidth[mapSelected];
    if (!mapSelected || !width) return null;

    const { xLenght, yHeight } = MapImagesSizes[mapSelected];
    const scaleX = xLenght / width.xVal;
    const scaleY = xLenght / width.yVal;

    const targets: Targetpoint[] = ((data.points as TawPoint[]) ?? [])
      .slice(0, MAX_TARGETS)
      .map((p, index) => {
        const lng = p.latLng?.lng ?? 0;
        const lat = p.latLng?.lat ?? 0;
        const type = tawTypeToHenning[p.type] ?? 'unknown';
        return {
          id: index + 1,
          x: lng * scaleX - xLenght / 2,
          y: -lat * scaleY - yHeight / 2,
          z: 0,
          name: (p.name ?? '').slice(0, 30),
          rotation: 0,
          type,
          color:
            tawColorToHenning[p.color] ??
            DEFAULT_COLORSELECT_OPTIONS.greyTarget,
          scale: 1.5,
        };
      });

    return { mapSelected, waypoints: [], targets, texts: [], frontlines: [] };
  } catch (error) {
    console.error('Failed to convert TAW JSON:', error);
    return null;
  }
};
