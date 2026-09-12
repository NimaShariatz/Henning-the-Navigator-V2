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
  blenderTable,
  blenderLamp,
  blenderGear,
  blenderClipboard,
};
