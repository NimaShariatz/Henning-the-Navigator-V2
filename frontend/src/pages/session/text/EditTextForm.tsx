import styles from './EditText.module.css';
import { HexColorPicker } from 'react-colorful';
import { useState, useRef } from 'react';
import type { Textpoint } from '../../../constants';

interface EditTextFormProps {
  selectedText: Textpoint;
}

function EditTextForm({ selectedText }: EditTextFormProps) {
  const [rotation, setRotation] = useState(selectedText.rotation);
  const [text, setText] = useState(selectedText.text);
  const [size, setSize] = useState(selectedText.size);
  const [maxWidth, setMaxWidth] = useState(selectedText.maxWidth);
  const [color, setColor] = useState(selectedText.color);
  const maxTextLength = useRef<HTMLElement>(null);

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const overLimit = 50 - newValue.length < 0;
    if (maxTextLength.current) {
      maxTextLength.current.textContent = String(50 - newValue.length);
      maxTextLength.current.style.color = overLimit
        ? 'var(--delete_red)'
        : 'var(--text_color_white)';
    }
    if (!overLimit) {
      setText(newValue);
    }
  };

  const adjustSize = (input: number) => {
    setSize(size + input);
  };

  const adjustMaxWidth = (input: number) => {
    setMaxWidth(maxWidth + input);
  };

  const changeRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (newValue < 0 || newValue > 360) {
      newValue = 0;
    }
    setRotation(newValue);
  };

  return (
    <>
      <h1>Edit Text</h1>
      <div className={styles.editTextOption}>
        <div className={styles.textInputContainer}>
          <p>Text</p>
          <input
            onChange={(e) => {
              handleTextInput(e);
            }}
            value={text}
          />
          <small ref={maxTextLength}>{50 - text.length}</small>
        </div>
      </div>

      <div className={styles.editTextOption}>
        <h5>Size:</h5>
        <button
          className={styles.leftIncrement}
          onClick={() => adjustSize(-1)}
          disabled={size === 0}
          style={{
            cursor: size === 0 ? 'not-allowed' : 'pointer',
          }}
        >
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

        <h6>{size}</h6>

        <button
          className={styles.rightIncrement}
          onClick={() => adjustSize(1)}
          disabled={size === 5}
          style={{
            cursor: size === 5 ? 'not-allowed' : 'pointer',
          }}
        >
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
        <button
          className={styles.leftIncrement}
          onClick={() => adjustMaxWidth(-1)}
          disabled={maxWidth === 0}
          style={{
            cursor: maxWidth === 0 ? 'not-allowed' : 'pointer',
          }}
        >
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

        <h6>{maxWidth}</h6>

        <button
          className={styles.rightIncrement}
          onClick={() => adjustMaxWidth(1)}
          disabled={maxWidth === 5}
          style={{
            cursor: maxWidth === 5 ? 'not-allowed' : 'pointer',
          }}
        >
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
        <h5>Rotation:</h5>
        <input
          className={styles.rotationInput}
          type="number"
          onChange={changeRotation}
          value={rotation}
        ></input>
        °
      </div>

      <div className={styles.editTextOption}>
        <HexColorPicker color={color} onChange={setColor} />
      </div>

      <div className={styles.editTextOption}>
        <button className={styles.updateTextButton}>Update</button>
      </div>
    </>
  );
}
export default EditTextForm;
