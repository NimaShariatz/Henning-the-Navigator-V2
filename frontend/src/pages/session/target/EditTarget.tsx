import styles from './EditText.module.css';
import type { Targetpoint } from '../../../constants';

interface EditTargetProps {
  revealEditTarget: boolean;
  revealEditTargetSetter: (idClicked: number) => void;
  targetClicked: number;
  targets: Targetpoint[];
}

function EditTarget({
  revealEditTarget,
  revealEditTargetSetter,
  targetClicked,
  targets,
}: EditTargetProps) {
  return <></>;
}

export default EditTarget;
