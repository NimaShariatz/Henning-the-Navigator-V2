import { Link } from 'react-router';
import './Home.css';
import Menu from '../../components/menu/Menu';

function Home() {
  return (
    <>
      <Menu />
      <h1>home component</h1>
      <Link to="/signup">Go to Signup</Link>
      <Link to="/signup">Go to Login</Link>
    </>
  );
}

export default Home;
