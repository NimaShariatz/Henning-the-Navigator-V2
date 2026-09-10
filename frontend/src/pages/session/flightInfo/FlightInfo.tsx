import styles from './FlightInfo.module.css';

interface FlightInfoProps {
  revealFlightInfo: boolean;
  revealFlightInfoSetter: () => void;
}

function FlightInfo({
  revealFlightInfo,
  revealFlightInfoSetter,
}: FlightInfoProps) {
  console.log(revealFlightInfo);
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
          </div>
        </div>
      )}
    </>
  );
}

export default FlightInfo;
