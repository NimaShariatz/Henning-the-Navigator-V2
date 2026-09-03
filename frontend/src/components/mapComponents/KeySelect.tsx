import { useEffect, useRef, useState } from 'react';
import styles from './KeySelect.module.css';

function KeySelect() {
  const shiftRef = useRef<HTMLParagraphElement>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  //add event listeners for shift key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={styles.keySelectContainer}>
      <small
        ref={shiftRef}
        className={styles.shift}
        style={{ opacity: isShiftPressed ? 0.7 : 0.25 }}
      >
        Shift
      </small>
    </div>
  );
}
export default KeySelect;
