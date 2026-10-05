import styles from './EditTarget.module.css';
import type { Targetpoint } from '../../../constants';

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

function EditTargetForm({
  selectedText,
  updateTarget,
  deleteTarget,
}: EditTargetFormProps) {
  return (
    <>
      <h1>Edit Target</h1>
    </>
  );
}

export default EditTargetForm;
