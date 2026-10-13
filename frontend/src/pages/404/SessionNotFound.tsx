import styles from './NotFound.module.css';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import Menu from '../../components/menu/Menu';

function SessionNotFound() {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <>
      <Menu />
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <p className={styles.fourohfour}>404</p>
          <div className={styles.textContainer}>
            <h3>Session Not Found</h3>
            {from && (
              <h6 className={styles.errorLink}>
                {window.location.origin}
                {from}
              </h6>
            )}
            <ul className={styles.possiblesList}>
              <li>The session could have been renamed/deleted</li>
              <li>The link copied could be incorrect</li>
              <li>There could be a connection error</li>
            </ul>
            <Link className={styles.homeLink} to="/">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default SessionNotFound;
