import { Link } from 'react-router';
import './Home.css';
import Menu from '../../components/menu/Menu';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();

  // if no access token, then send to /login
  useEffect(() => {
    if (!localStorage.getItem('access')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Menu />
      <Link to="/signup">Go to Signup</Link>
      <p>home component</p>
    </>
  );
}

export default Home;
