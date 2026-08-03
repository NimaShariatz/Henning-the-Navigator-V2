import styles from './Menu.module.css';
import { HennLogo1 } from '../../constants';
import { useNavigate } from 'react-router';

function Menu() {
  const navigate = useNavigate();

  function handleSignOut() {
    //console.log(localStorage.getItem('access'));
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  }

  return (
    <>
      <menu>
        <div className={styles.menuContainer}>
          <div className={styles.leftSide}>
            <img className={styles.henningLogo} src={HennLogo1} />
          </div>
          <div className={styles.middleSide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
            >
              <g fill="var(--text_color)" fillRule="evenodd" clipRule="evenodd">
                <path d="M16.884 5.348a1.25 1.25 0 0 1 0 1.768L12 12L7.116 7.116a1.25 1.25 0 0 1 1.768-1.768L12 8.464l3.116-3.116a1.25 1.25 0 0 1 1.768 0"></path>
                <path d="M16.884 12.366a1.25 1.25 0 0 1 0 1.768L12 19.018l-4.884-4.884a1.25 1.25 0 0 1 1.768-1.768L12 15.482l3.116-3.116a1.25 1.25 0 0 1 1.768 0"></path>
              </g>
            </svg>
          </div>
          <div className={styles.rightSide}>
            <button onClick={handleSignOut}>
              log out
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"></path>
              </svg>
            </button>
          </div>
        </div>
      </menu>
    </>
  );
}

export default Menu;
