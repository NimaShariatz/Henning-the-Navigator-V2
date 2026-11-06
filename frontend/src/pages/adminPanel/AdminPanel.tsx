import { getAdmin } from '../../api/User';
import Menu from '../../components/menu/Menu';
import { adminHeader } from '../../constants';
import styles from './AdminPanel.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {
    getAdmin().catch(() => navigate('/'));
  }, [navigate]);

  return (
    <>
      <Menu />

      <div className={styles.initialContainer}>
        <h1>Admin Panel</h1>
        <img src={adminHeader} />
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.usersContainer}>
          <h2>Data</h2>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
