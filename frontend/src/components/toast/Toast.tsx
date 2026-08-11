import styles from './Toast.module.css';

interface ToastProps {
  ToastMessage: string;
}

function Toast({ ToastMessage }: ToastProps) {
  return (
    <div className={styles.ToastContainer}>
      <small>{ToastMessage}</small>
    </div>
  );
}
export default Toast;
