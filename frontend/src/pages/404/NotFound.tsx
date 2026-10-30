import styles from './NotFound.module.css';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import Menu from '../../components/menu/Menu';

function NotFound() {
  const { pathname } = useLocation();
  return (
    <>
      <meta name="robots" content="noindex" />
      <Menu />
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <p className={styles.fourohfour}>404</p>
          <div className={styles.textContainer}>
            <h3>Page Not Found</h3>
            <h6 className={styles.errorLink}>
              {window.location.origin}
              {pathname}
            </h6>
            <Link className={styles.homeLink} to="/">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default NotFound;
