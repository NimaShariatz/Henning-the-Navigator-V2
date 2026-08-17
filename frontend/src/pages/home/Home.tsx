import { Link } from 'react-router';
import styles from './Home.module.css';
import Menu from '../../components/menu/Menu';

function Home() {
  return (
    <>
      <Menu />
      <h1>home component</h1>
      <Link to="/signup">Go to Signup</Link>
      <Link to="/signup">Go to Login</Link>

      <p className={styles.tempo}>
        Background
        <span></span>
      </p>
    </>
  );
}

export default Home;
