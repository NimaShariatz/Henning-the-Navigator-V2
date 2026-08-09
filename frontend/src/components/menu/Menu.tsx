import styles from './Menu.module.css';
import { Link } from 'react-router';
import { HennLogo1 } from '../../constants';
import { useNavigate } from 'react-router';
import { useState } from 'react';

function Menu() {
  const navigate = useNavigate();
  const [loggedIn] = useState(isAuthenticated);

  function isAuthenticated() {
    const token = localStorage.getItem('access');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // atob is a built-in browser function that decodes a Base64-encoded string back into plain text.
      //console.log(payload)
      return payload.exp * 1000 > Date.now(); // exp is in seconds, Date.now() is ms
    } catch {
      return false;
    }
  }

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
            <Link to="/" className={styles.leftHomeLink}>
              <img className={styles.henningLogo} src={HennLogo1} />
            </Link>
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
            {loggedIn ? (
              <>
                <Link to="/user-sessions">
                  Sessions
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth={48}
                      d="M144 144h320M144 256h320M144 368h320"
                    ></path>
                    <path
                      stroke="currentColor"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                      strokeWidth={32}
                      d="M64 128h32v32H64zm0 112h32v32H64zm0 112h32v32H64z"
                    ></path>
                  </svg>
                </Link>
                {/*
                <Link to="/profile">
                  Profile
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinejoin="round"
                        d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                      ></path>
                      <circle cx={12} cy={7} r={3}></circle>
                    </g>
                  </svg>
                </Link>
                */}
                <button onClick={handleSignOut}>
                  Log out
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"></path>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  Signup
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M7.263 3.26A2.25 2.25 0 0 1 9.5 1.25h5a2.25 2.25 0 0 1 2.237 2.01c.764.016 1.423.055 1.987.159c.758.14 1.403.404 1.928.93c.602.601.86 1.36.982 2.26c.116.866.116 1.969.116 3.336v6.11c0 1.367 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-6.11c-1.367 0-2.47 0-3.337-.116c-.9-.122-1.658-.38-2.26-.982s-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337v-6.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.525-.525 1.17-.79 1.928-.929c.564-.104 1.224-.143 1.987-.159m.002 1.5c-.718.016-1.272.052-1.718.134c-.566.104-.895.272-1.138.515c-.277.277-.457.665-.556 1.4c-.101.754-.103 1.756-.103 3.191v6c0 1.435.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h6c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191v-6c0-1.435-.002-2.437-.103-3.192c-.099-.734-.28-1.122-.556-1.399c-.244-.243-.572-.41-1.138-.515c-.446-.082-1-.118-1.718-.133A2.25 2.25 0 0 1 14.5 6.75h-5a2.25 2.25 0 0 1-2.235-1.99M9.5 2.75a.75.75 0 0 0-.75.75v1c0 .414.336.75.75.75h5a.75.75 0 0 0 .75-.75v-1a.75.75 0 0 0-.75-.75zM6.25 10.5A.75.75 0 0 1 7 9.75h10a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m1 3.5a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75m1 3.5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Link>
                <Link to="/login">
                  Login
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
                    ></path>
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </menu>
    </>
  );
}

export default Menu;
