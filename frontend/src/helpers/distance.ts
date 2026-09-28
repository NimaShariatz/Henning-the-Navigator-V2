import { Map10Kilometer } from '../constants';

export function midXmidY(
  pointX: number,
  pointY: number,
  nextPointX: number,
  nextPointY: number,
) {
  const midX = (pointX + nextPointX) / 2;
  const midY = (pointY + nextPointY) / 2;

  return { midX, midY };
}

export function distanceCalc(
  pointX: number,
  pointY: number,
  nextPointX: number,
  nextPointY: number,
  sessionMap: string,
  isKilometers: boolean,
) {
  const distanceX = nextPointX - pointX;
  const distanceY = nextPointY - pointY;

  const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  const pixelLength = length;

  let distance = (pixelLength / Map10Kilometer[sessionMap]) * 10;
  if (!isKilometers) {
    distance = distance * 0.621371;
  }

  distance = Math.round(distance);
  return distance;
}

export function headingCalc(
  pointX: number,
  pointY: number,
  nextPointX: number,
  nextPointY: number,
) {
  const distanceX = nextPointX - pointX;
  const distanceY = nextPointY - pointY;

  let angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI);

  angle = angle + 90; // to make 0 north instead ofeast
  angle = (angle + 360) % 360; //within 360 range
  const heading = Math.round(angle);
  return heading;
}
