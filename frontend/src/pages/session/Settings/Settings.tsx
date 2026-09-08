import styles from './Settings.module.css';

interface SettingsProps {
  revealSettings: boolean;
  revealSettingsSetter: () => void;
}

function Settings({ revealSettings, revealSettingsSetter }: SettingsProps) {
  return (
    <>
      {revealSettings && (
        <div
          className={styles.settingsContainer}
          onClick={() => revealSettingsSetter()}
        >
          <div
            className={styles.innerContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.close}>
              <button onClick={() => revealSettingsSetter()}>
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

            <h1>Settings</h1>
            <div className={styles.settingsOption}>
              <h5>Brightness:</h5>
              <button className={styles.leftIncrement}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 20 20"
                >
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                    <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                  </g>
                </svg>
              </button>

              <h6>3</h6>

              <button className={styles.rightIncrement}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 20 20"
                >
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                    <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                  </g>
                </svg>
              </button>
            </div>
            <div className={styles.settingsOption}>
              <h5>Scale:</h5>
              <button className={styles.leftIncrement}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 20 20"
                >
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                    <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                  </g>
                </svg>
              </button>

              <h6>3</h6>

              <button className={styles.rightIncrement}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 20 20"
                >
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                    <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                  </g>
                </svg>
              </button>
            </div>
            <div className={styles.settingsOption}>
              <button className={styles.download}>
                <h5>Download Map Data</h5>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="download_fill"
                    d="M12 15.575q-.2 0-.375-.062T11.3 15.3l-3.6-3.6q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L11 12.15V5q0-.425.288-.712T12 4t.713.288T13 5v7.15l1.875-1.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-3.6 3.6q-.15.15-.325.213t-.375.062M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20z"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.settingsOption}>
              <button className={styles.download}>
                <h5>Upload Map Data</h5>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 28 28"
                >
                  <path
                    className="folder_fill"
                    d="M2 6.75A3.75 3.75 0 0 1 5.75 3h3.672c.729 0 1.428.29 1.944.805L13.25 5.69l-2.944 2.945A1.25 1.25 0 0 1 9.422 9H2zm.004 3.75v9.75A3.75 3.75 0 0 0 5.754 24H22.25A3.75 3.75 0 0 0 26 20.25V9.75A3.75 3.75 0 0 0 22.25 6h-7.19l-3.694 3.695a2.75 2.75 0 0 1-1.944.805z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
