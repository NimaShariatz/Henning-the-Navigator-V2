import { useEffect, useRef, useState } from 'react';
import styles from './KeySelect.module.css';

interface KeySelectProps {
  resetCamera: () => void;
}

function KeySelect({ resetCamera }: KeySelectProps) {
  const shiftRef = useRef<HTMLParagraphElement>(null);
  const [isShift, setIsShift] = useState(false);
  const [isLeftClick, setIsLeftClick] = useState(false);
  const [isRightClick, setIsRightClick] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

  //add event listeners for shift key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShift(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShift(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsLeftClick(true);
      if (e.button === 2) setIsRightClick(true);
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) setIsLeftClick(false);
      if (e.button === 2) setIsRightClick(false);
    };

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleWheel = () => {
      setIsScroll(true);
      clearTimeout(scrollTimeout);
      // wheel has no discrete "end" event, so debounce the reset
      scrollTimeout = setTimeout(() => setIsScroll(false), 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={styles.keySelectContainer}>
      <small
        ref={shiftRef}
        className={styles.shift}
        style={{ opacity: isShift ? 0.7 : 0.3 }}
      >
        Shift
      </small>

      <svg
        className={styles.mouseSVG}
        viewBox="0 0 102 109"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={'var(--medium_yellow)'}
          strokeWidth={'3'}
          style={{ opacity: isLeftClick ? 0.7 : 0.3 }}
          d="M0.527832 43.6206H41.5278V0.620605C11.7501 7.10485 2.01896 15.9526 0.527832 43.6206Z"
          stroke="black"
        />
        <path
          fill={'var(--medium_yellow)'}
          strokeWidth={'3'}
          style={{ opacity: isRightClick ? 0.7 : 0.3 }}
          d="M100.528 43.6206H59.5278V0.620605C89.3055 7.10485 99.0367 15.9526 100.528 43.6206Z"
          stroke="black"
        />
        <path
          fill={'var(--medium_yellow)'}
          strokeWidth={'3'}
          style={{ opacity: isScroll ? 0.7 : 0.3 }}
          d="M59.5278 23.6206H41.5278V62.6206H59.5278V23.6206Z"
          stroke="black"
        />
        <path
          fill={'none'}
          strokeWidth={'1'}
          d="M100.528 44.6206V107.621H0.527832V44.6206"
          stroke="black"
        />
      </svg>

      <button className={styles.resetButton} onClick={resetCamera}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 32 32"
        >
          <path d="M0 0h32v32H0z" fill="none" />
          <path
            fill="currentColor"
            d="M22.448 21A10.86 10.86 0 0 0 25 14A10.99 10.99 0 0 0 6 6.466V2H4v8h8V8H7.332a8.977 8.977 0 1 1-2.1 8h-2.04A11.01 11.01 0 0 0 14 25a10.86 10.86 0 0 0 7-2.552L28.586 30L30 28.586Z"
          />
        </svg>
      </button>
    </div>
  );
}
export default KeySelect;
