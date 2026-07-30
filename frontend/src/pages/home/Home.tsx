import { Link } from 'react-router';
import './Home.css';

function Home() {
  return (
    <>
      <Link to="/signup">Go to Signup</Link>
      <p>home component</p>
    </>
  );
}

export default Home;
