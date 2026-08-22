import styles from './EditCreateSession.module.css';
import type { SessionDetailedItem } from '../../api/Session';

interface SessionUserListProps {
  permissionType: string;
  specificSessionData: SessionDetailedItem | null;
}

function SessionUserList({
  permissionType,
  specificSessionData,
}: SessionUserListProps) {
  if (!permissionType) {
    return null;
  } else
    return (
      <div className={styles.usersContainer}>
        <h6>Search Users</h6>
        <div>
          <input />
          <button className={styles.sessionButton}>Search</button>
        </div>
        <div className={styles.userList}>
          <div>
            someusername1234
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1rem"
              height="1rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
              ></path>
            </svg>
          </div>
          <div>
            someusername1234
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1rem"
              height="1rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
              ></path>
            </svg>
          </div>
        </div>
        <div className={styles.userList}>
          <h6>Users Allowed To Edit</h6>

          {specificSessionData?.permitted_to_edit?.map((user) => (
            <div key={user}>
              {user}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={12} cy={12} r={9}></circle>
                  <path d="M7.5 12h9"></path>
                </g>
              </svg>
            </div>
          ))}
        </div>
      </div>
    );
}
export default SessionUserList;
