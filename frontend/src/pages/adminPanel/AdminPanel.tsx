import Menu from '../../components/menu/Menu';
import { adminHeader } from '../../constants';
import styles from './AdminPanel.module.css';

function AdminPanel() {
  return (
    <>
      <Menu />
      <div className={styles.initialContainer}>
        <h1>Admin Panel</h1>
        <img src={adminHeader} />
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.usersContainer}></div>

        <div className={styles.sessionsContainer}></div>
        <div className={styles.dataContainer}></div>
      </div>
    </>
  );
}

export default AdminPanel;
