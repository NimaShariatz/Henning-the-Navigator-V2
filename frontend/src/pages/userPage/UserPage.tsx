import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Menu from '../../components/menu/Menu';
import { getUser } from '../../api/User';

function UserPage() {
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

  return (
    <>
      <Menu />
      <p>user page</p>
      <p>Hi {username}!</p>
    </>
  );
}

export default UserPage;
