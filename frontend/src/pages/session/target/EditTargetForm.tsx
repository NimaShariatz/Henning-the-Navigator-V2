import styles from './EditTarget.module.css';
import type { Targetpoint } from '../../../constants';
import { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

interface EditTargetFormProps {
  selectedTarget: Targetpoint;
  updateTarget: (
    id: number,
    name: string,
    rotation: number,
    color: string,
    scale: number,
  ) => void;
  deleteTarget: (id: number) => void;
}
//name, scale, color, rotation
function EditTargetForm({
  selectedTarget,
  updateTarget,
  deleteTarget,
}: EditTargetFormProps) {
  const maxNameLength = useRef<HTMLElement>(null);
  const [name, setName] = useState(selectedTarget.name);
  const [scale, setScale] = useState(selectedTarget.scale);
  const [rotation, setRotation] = useState(selectedTarget.rotation);
  const [color, setColor] = useState(selectedTarget.color);
  const dialRef = useRef<HTMLDivElement>(null);

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const overLimit = 30 - newValue.length < 0;
    if (maxNameLength.current) {
      maxNameLength.current.textContent = String(31 - newValue.length);
      maxNameLength.current.style.color = overLimit
        ? 'var(--delete_red)'
        : 'var(--text_color_white)';
    }
    if (!overLimit) {
      setName(newValue);
    }
  };

  const adjustScale = (input: number) => {
    setScale(scale + input);
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
      <h1>Edit Target</h1>
      <div className={styles.editTargetOption}>
        <div className={styles.nameInputContainer}>
          <p>Name</p>
          <input
            onChange={(e) => {
              handleNameInput(e);
            }}
            value={name}
          />
          <small ref={maxNameLength}>{30 - name.length}</small>
          <p className={styles.nameInputDissappear}>
            Empty the field to make the target name popup dissappear
          </p>
        </div>
      </div>

      <div className={`${styles.editTargetOption} ${styles.row}`}>
        <h5>Scale:</h5>
        <button
          className={styles.leftIncrement}
          onClick={() => adjustScale(-0.25)}
          disabled={scale === 0.25}
          style={{
            cursor: scale === 0.25 ? 'not-allowed' : 'pointer',
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

        <h6 className={styles.scaleFactor}>{scale}</h6>

        <button
          className={styles.rightIncrement}
          onClick={() => adjustScale(0.25)}
          disabled={scale === 5}
          style={{
            cursor: scale === 5 ? 'not-allowed' : 'pointer',
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

      <div className={styles.editTargetOption}>
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

      <div className={styles.editTargetOption}>
        <HexColorPicker color={color} onChange={setColor} />
      </div>

      <div className={styles.UpdateDeleteOptions}>
        <button
          className={styles.updateTextButton}
          onClick={() =>
            updateTarget(selectedTarget.id, name, rotation, color, scale)
          }
        >
          Update
        </button>
        <button
          className={styles.deleteTextButton}
          onClick={() => deleteTarget(selectedTarget.id)}
        >
          Delete
        </button>
      </div>
    </>
  );
}

export default EditTargetForm;
