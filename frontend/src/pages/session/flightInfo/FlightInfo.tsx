import { distanceCalc } from '../../../helpers/distance';
import type { Waypoint } from '../../../constants';
import styles from './FlightInfo.module.css';

interface FlightInfoProps {
  revealFlightInfo: boolean;
  revealFlightInfoSetter: () => void;
  sessionData: string;
  isKilometers: boolean;
  waypoints: Waypoint[];
  sessionMap: string;
}

function FlightInfo({
  revealFlightInfo,
  revealFlightInfoSetter,
  sessionData,
  isKilometers,
  waypoints,
  sessionMap,
}: FlightInfoProps) {
  let ingressDistance = 0;
  let egressDistance = 0;
  let totalDistance = 0;

  waypoints.forEach((point, index) => {
    const nextPoint = waypoints[index + 1];
    if (!nextPoint) return; // last point has no outgoing segment

    const segmentDistance = distanceCalc(
      point.x,
      point.y,
      nextPoint.x,
      nextPoint.y,
      sessionMap,
      isKilometers,
    );

    totalDistance += segmentDistance;

    if (
      nextPoint.type === 'startPoint' ||
      nextPoint.type === 'ingressPoint' ||
      nextPoint.type === 'targetPoint'
    ) {
      ingressDistance += segmentDistance;
    } else if (nextPoint.type === 'egressPoint') {
      egressDistance += segmentDistance;
    }
  });

  return (
    <>
      {revealFlightInfo && (
        <div
          className={styles.flightInfoContainer}
          onClick={() => revealFlightInfoSetter()}
        >
          <div
            className={styles.innerContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.close}>
              <button onClick={() => revealFlightInfoSetter()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="var(--logo_yellow)"
                    d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
                  ></path>
                </svg>
              </button>
            </div>
            <h1>Flight Info</h1>
            <p className={styles.flightInfo}>{sessionData}</p>

            <div className={styles.calculatedDistance}>
              <p>
                (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-start">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_start)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-start)"
                  />
                </svg>
                ) Start, (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-ingress">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_ingress)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-ingress)"
                  />
                </svg>
                ) Ingress, & (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-target">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_target)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-target)"
                  />
                </svg>
                ) Target Distance: {ingressDistance}
                {isKilometers ? 'km' : 'mi'}
              </p>
              <p>
                (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-extraction">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_extraction)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-extraction)"
                  />
                </svg>
                ) Egress Distance: {egressDistance}
                {isKilometers ? 'km' : 'mi'}
              </p>
              <p>
                Total Distance: {totalDistance}
                {isKilometers ? 'km' : 'mi'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FlightInfo;
