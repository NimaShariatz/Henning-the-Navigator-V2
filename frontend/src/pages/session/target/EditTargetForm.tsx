import styles from './EditTarget.module.css';
import type { Targetpoint } from '../../../constants';
import { useState, useRef } from 'react';

interface EditTargetFormProps {
  selectedTarget: Targetpoint;
  updateTarget: (
    id: number,
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
  const maxTextLength = useRef<HTMLElement>(null);
  const [text, setText] = useState(selectedTarget.name);

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

  return (
    <>
      <h1>Edit Target</h1>
      <div className={styles.editTargetOption}>
        <div className={styles.textInputContainer}>
          <p>Text</p>
          <input
            onChange={(e) => {
              handleTextInput(e);
            }}
            value={text}
          />
          <small ref={maxTextLength}>{30 - text.length}</small>
        </div>
      </div>
    </>
  );
}

export default EditTargetForm;
