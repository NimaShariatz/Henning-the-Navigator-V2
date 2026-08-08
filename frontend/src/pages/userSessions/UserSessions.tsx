import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Menu from '../../components/menu/Menu';
import { getUser } from '../../api/User';
import styles from './UserSessions.module.css';

function UserSessions() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access')) {
      navigate('/login');
      return;
    }
    getUser()
      .then((data) => setUsername(data.username))
      .catch(() => navigate('/login'));
  }, [navigate]);

  /*
   * 
    Create mock sessions
    Set up fetching on views and /api
    Update admin.py
    Create sessions with django admin
    Update mock
    Make search, delete, and create all functional
   */

  return (
    <>
      <Menu />
      <div className={styles.initialContainer}>
        <h1>{username}'s Sessions</h1>
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.filterContainer}>
          <form>
            <input />
            <button>Search</button>
          </form>

          <div className={styles.filtersRow}>
            <div>
              <p>Sort by: Date or Name</p>
            </div>

            <div>Create Session</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSessions;
