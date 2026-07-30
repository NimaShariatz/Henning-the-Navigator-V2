import styles from './Menu.module.css';
import { HennLogo1 } from '../../constants';

function Menu() {
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
          <div className={styles.rightSide}></div>
        </div>
      </menu>
    </>
  );
}

export default Menu;
