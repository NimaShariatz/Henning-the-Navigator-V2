import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Menu from '../../components/menu/Menu';
import { getUser } from '../../api/User';
import styles from './UserSessions.module.css';

function UserSessions() {
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

      <div className={styles.coreContainer}></div>
    </>
  );
}

export default UserSessions;
