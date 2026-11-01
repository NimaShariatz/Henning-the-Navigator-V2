import Menu from '../../components/menu/Menu';
import styles from './AdminPanel.module.css';

function AdminPanel() {
  return (
    <>
      <Menu />
      <p className={styles.temp}>admin panel</p>
    </>
  );
}

export default AdminPanel;
