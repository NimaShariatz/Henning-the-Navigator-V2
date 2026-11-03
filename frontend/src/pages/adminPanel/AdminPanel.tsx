import Menu from '../../components/menu/Menu';
import { adminHeader } from '../../constants';
import styles from './AdminPanel.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function AdminPanel() {
  const navigate = useNavigate();

  useEffect(() => {}, [navigate]);

  return (
    <>
      <Menu />
      <div className={styles.initialContainer}>
        <h1>Admin Panel</h1>
        <img src={adminHeader} />
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.usersContainer}>
          <h2>Users</h2>
          <form className={styles.searchFormContainer}>
            <input type="text" placeholder="Search session names" />
            <button type="button">Search</button>
          </form>
          <p>User1</p>
          <p>User2</p>
          <p>User3</p>
        </div>

        <div className={styles.sessionsContainer}>
          <h1>Sessions</h1>
        </div>
        <div className={styles.dataContainer}></div>
      </div>
    </>
  );
}

export default AdminPanel;
