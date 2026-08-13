import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Menu from '../../components/menu/Menu';
import { getUser } from '../../api/User';
import styles from './UserSessions.module.css';
import { sessionHeader } from '../../constants';
import { lowResArras } from '../../constants';
import { Link } from 'react-router';

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
    Create mock sessions
    Set up fetching on views and /api
    Update admin.py
    Create sessions with django admin
    Update mock
    Make search, delete, and create all functional
    introduce pagination
   */

  return (
    <>
      <Menu />
      <div className={styles.initialContainer}>
        <h1>{username}'s Sessions</h1>
        <img src={sessionHeader} />
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.filterContainer}>
          <form>
            <input />
            <button>Search</button>
          </form>

          <div className={styles.filtersRow}>
            <p>
              Sort: Alphabetically [or by last updated] [or by date created]
            </p>

            <p>
              Create Session
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
              >
                <path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"></path>
              </svg>
            </p>
          </div>
        </div>

        <div className={styles.sessionContainer}>
          <div className={styles.leftContainer}>
            <h2>Novosolinki Raid Session</h2>
            <p>Last Edit: March 22nd 2027</p>
            <p>Edit Permission: By Invite</p>
            <p className={styles.shareLink}>
              Share link
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
              >
                <path
                  fill="var(--text_color)"
                  d="M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z"
                ></path>
              </svg>
            </p>
            <Link to="/">Enter Session</Link>
          </div>

          <div className={styles.rightContainer}>
            <div>
              <img className={styles.lowResImg} src={lowResArras} />
              <small className={styles.mapName}>Novosolinki</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSessions;
