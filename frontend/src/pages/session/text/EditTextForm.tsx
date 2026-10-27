import styles from './EditText.module.css';
import { HexColorPicker } from 'react-colorful';
import { useState, useRef } from 'react';
import type { Textpoint } from '../../../constants';

interface EditTextFormProps {
  selectedText: Textpoint;
  updateText: (
    id: number,
    text: string,
    color: string,
    rotation: number,
    size: number,
  ) => void;
  deleteText: (id: number) => void;
}

function EditTextForm({
  selectedText,
  updateText,
  deleteText,
}: EditTextFormProps) {
  const [rotation, setRotation] = useState(selectedText.rotation);
  const [text, setText] = useState(selectedText.text);
  const [size, setSize] = useState(selectedText.size);
  const [color, setColor] = useState(selectedText.color);
  const maxTextLength = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const overLimit = 50 - newValue.length < 0;
    if (maxTextLength.current) {
      maxTextLength.current.textContent = String(51 - newValue.length);
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

  const setFromPointer = (e: React.PointerEvent, snap: boolean) => {
    const rect = dialRef.current!.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    // 0° = up, increasing clockwise
    const clockwiseFromTop = (Math.atan2(dx, -dy) * 180) / Math.PI;
    let deg = Math.round(180 - clockwiseFromTop) % 360;
    if (snap) deg = (Math.round(deg / 15) * 15) % 360;
    setRotation(deg);
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
          disabled={size === 1}
          style={{
            cursor: size === 1 ? 'not-allowed' : 'pointer',
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
        <h5>Rotation:</h5>
        <div
          ref={dialRef}
          className={styles.dial}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={rotation}
          tabIndex={0}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setFromPointer(e, e.shiftKey);
          }}
          onPointerMove={(e) => {
            if (e.buttons) setFromPointer(e, e.shiftKey);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp')
              setRotation((r) => (r + 1) % 360);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')
              setRotation((r) => (r + 359) % 360);
          }}
        >
          <div
            className={styles.needle}
            style={{ transform: `rotate(${180 - rotation}deg)` }}
          />
        </div>
      </div>

      <div className={styles.editTextOption}>
        <HexColorPicker color={color} onChange={setColor} />
      </div>

      <div className={styles.UpdateDeleteOptions}>
        <button
          className={styles.updateTextButton}
          onClick={() =>
            updateText(selectedText.id, text, color, rotation, size)
          }
        >
          Update
        </button>
        <button
          className={styles.deleteTextButton}
          onClick={() => deleteText(selectedText.id)}
        >
          Delete
        </button>
      </div>
    </>
  );
}
export default EditTextForm;
