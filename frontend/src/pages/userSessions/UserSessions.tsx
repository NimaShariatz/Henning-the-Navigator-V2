import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Menu from '../../components/menu/Menu';
import { getUser } from '../../api/User';
import { BasicSessionData } from '../../api/Session';
import type { SessionListItem } from '../../api/Session';
import styles from './UserSessions.module.css';
import { sessionBg, sessionHeader } from '../../constants';
import { HennLogo1, lowResMapImages } from '../../constants';
import { Link } from 'react-router';
import EditCreateSession from '../../components/editCreateSession/EditCreateSession';

function UserSessions() {
  const navigate = useNavigate();

  const [editingSession, setEditingSession] = useState<SessionListItem | null>(
    null,
  ); //is set when edit button is clicked

  const [showCreateSession, setShowCreateSession] = useState(false);

  const [username, setUsername] = useState('');
  const [sessionData, setSessionData] = useState<SessionListItem[]>([]);
  useEffect(() => {
    if (!localStorage.getItem('access')) {
      navigate('/login');
      return;
    }
    getUser() //calls getUser, sets username, calls BasicSessionData with the username as input. finally sets data in the useState
      .then((data) => {
        setUsername(data.username);
        return BasicSessionData(data.username);
      })
      .then((sessions) => setSessionData(sessions))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const formatTimestamp = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  return (
    <>
      <Menu />

      {showCreateSession && (
        <EditCreateSession revealHandler={() => setShowCreateSession(false)} />
      )}

      {/* have CreateSession be in a conditional. it can then be reused for the edit button by using a bunch of variable inputs*/}
      {editingSession && (
        <EditCreateSession
          revealHandler={() => setEditingSession(null)}
          sessionSlug={editingSession.slug}
          sessionUsername={username}
        />
      )}
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
              onClick={() => setShowCreateSession(true)}
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

        {sessionData.map((session) => (
          <div key={session.slug} className={styles.sessionContainer}>
            <img src={sessionBg} className={styles.sessionBackgroundImg} />
            <div className={styles.leftContainer}>
              <div className={styles.upperLeft}>
                <h2>{session.title}</h2>
                <p>Last Updated: {formatTimestamp(session.last_updated)}</p>
                {session.all_can_edit && <p>Edit Permission: All</p>}
                {!session.all_can_edit && <p>Edit Permission: By Invite</p>}
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
                <button className={styles.deleteButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"></path>
                  </svg>
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingSession(session)}
                >
                  {/* pass session data to the useState */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g fill="currentColor">
                      <path d="M8 7a1 1 0 0 1-1 1H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1a1 1 0 0 1 2 0v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1a1 1 0 0 1 1 1"></path>
                      <path d="m14.596 5.011l4.392 4.392l-6.28 6.303A1 1 0 0 1 12 16H9a1 1 0 0 1-1-1v-3a1 1 0 0 1 .294-.708zm6.496-2.103a3.097 3.097 0 0 1 .165 4.203l-.164.18l-.693.694l-4.387-4.387l.695-.69a3.1 3.1 0 0 1 4.384 0"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.rightContainer}>
              <div>
                <img
                  className={styles.lowResImg}
                  src={lowResMapImages[session.map_selected] ?? HennLogo1}
                />
                <small className={styles.mapName}>{session.map_selected}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserSessions;
