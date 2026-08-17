import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Menu from '../../components/menu/Menu';
import { getUser } from '../../api/User';
import styles from './UserSessions.module.css';
import { sessionBg, sessionHeader } from '../../constants';
import { lowResArras } from '../../constants';
import { Link } from 'react-router';
import CreateSession from '../../components/createSession/CreateSession';

function UserSessions() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [revealCreateSession, setCreateSessionClicked] = useState(false);
  function RevealCreateSessionClicked_handler(input: boolean) {
    setCreateSessionClicked(input);
  }

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
      <CreateSession
        revealCreateSession={revealCreateSession}
        RevealCreateSessionClicked_handler={RevealCreateSessionClicked_handler}
        sectionTitle={'New Session'}
      />
      <div className={styles.initialContainer}>
        <h1>{username}'s Sessions</h1>
        <img src={sessionHeader} />
      </div>

      <div className={styles.coreContainer}>
        <div className={styles.filterContainer}>
          <form className={styles.searchFormContainer}>
            <input type="text" placeholder="Search session names" />
            <button>Search</button>
          </form>

          <div className={styles.filtersRow}>
            <p>
              Sort: Alphabetically [or by last updated] [or by date created]
            </p>

            <button
              className={styles.createSessionButton}
              onClick={() => setCreateSessionClicked(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
              >
                <path d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"></path>
              </svg>
              Create Session
            </button>
          </div>
        </div>

        <div className={styles.deleteSessionsContainer}>
          <button disabled>Delete Selected Sessions (0)</button>
        </div>

        <div className={styles.sessionContainer}>
          <img src={sessionBg} className={styles.sessionBackgroundImg} />
          <div className={styles.leftContainer}>
            <div className={styles.upperLeft}>
              <h2>Novosolinki Raid Session</h2>
              <p>Last Edit: March 22nd 2027</p>
              <p>Edit Permission: By Invite</p>
              <p className={styles.shareLink}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="var(--text_color)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3z"
                  ></path>
                </svg>
                Share Link
              </p>
              <Link className={styles.enterSessionLink} to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    fill="currentcolor"
                    d="m15 21l-6-2.1l-4.65 1.8q-.5.2-.925-.112T3 19.75v-14q0-.325.188-.575T3.7 4.8L9 3l6 2.1l4.65-1.8q.5-.2.925.113T21 4.25v14q0 .325-.187.575t-.513.375zm-1-2.45V6.85l-4-1.4v11.7zm2 0l3-1V5.7l-3 1.15zM5 18.3l3-1.15V5.45l-3 1zM16 6.85v11.7zm-8-1.4v11.7z"
                  />
                </svg>
                Enter Session
              </Link>
            </div>
            <div className={styles.upperBottom}>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"></path>
                </svg>
              </button>
            </div>
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
