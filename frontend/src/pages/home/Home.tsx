import { Link } from 'react-router';
import './Home.css';
import Menu from '../../components/menu/Menu';

function Home() {
  return (
    <>
      <Menu />
      <Link to="/signup">Go to Signup</Link>
      <p>home component</p>
    </>
  );
}

export default Home;
