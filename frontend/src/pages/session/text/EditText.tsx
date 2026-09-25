import styles from './EditText.module.css';
import { HexColorPicker } from 'react-colorful';

interface EditTextProps {
  revealEditText: boolean;
  revealEditTextSetter: () => void;
}

function EditText({ revealEditText, revealEditTextSetter }: EditTextProps) {
  //text input with max length. max width. font size. rotation. color.
  return (
    <>
      {revealEditText && (
        <div
          className={styles.editTextContainer}
          onClick={() => revealEditTextSetter()}
        >
          <div
            className={styles.innerContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.close}>
              <button onClick={() => revealEditTextSetter()}>
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

            <h1>Edit Text</h1>
            <div className={styles.editTextOption}>
              <div className={styles.textInputContainer}>
                <p>Text</p>
                <input />
                <small>50</small>
              </div>
            </div>

            <div className={styles.editTextOption}>
              <h5>Size:</h5>
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

              <h6>5</h6>

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

            <div className={styles.editTextOption}>
              <h5>Max Width:</h5>
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

              <h6>5</h6>

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

            <div className={styles.editTextOption}>
              <div className={styles.textInputContainer}>
                <p>Rotation</p>
                <input />
                <small>50</small>
              </div>
            </div>

            <div className={styles.editTextOption}>
              <HexColorPicker />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default EditText;
