import styles from './CreateSession.module.css';
import { useRef, useState } from 'react';

interface CreateSessionProps {
  RevealCreateSessionClicked_handler: (input: boolean) => void;
  sectionTitle: string;
  sessionName?: string;
}

function CreateSession({
  RevealCreateSessionClicked_handler,
  sectionTitle,
  sessionName,
}: CreateSessionProps) {
  const [permissionInviteOnly, SetPermissionInviteOnly] = useState(false);

  const maxCharacRef = useRef<HTMLElement>(null);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (maxCharacRef.current)
      maxCharacRef.current.textContent = String(50 - newValue.length);
    //console.log(newValue.length)
    if (50 - newValue.length >= 0 && maxCharacRef.current) {
      maxCharacRef.current.style.color = 'var(--text_color_white)';
    } else if (50 - newValue.length < 0 && maxCharacRef.current) {
      maxCharacRef.current.style.color = 'var(--delete_red)';
    }
  };

  return (
    <>
      <div className={styles.createSessionContainer}>
        <div
          className={styles.outsideContainer}
          onClick={() => RevealCreateSessionClicked_handler(false)}
        >
          <div
            className={styles.sessionContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.close}>
              <button onClick={() => RevealCreateSessionClicked_handler(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="var(--logo_yellow)"
                    d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
                  ></path>
                </svg>
              </button>
            </div>
            <h1>{sectionTitle}</h1>
            <form>
              <label>Session Name</label>
              <div className={styles.sessionNameContainer}>
                <input
                  onChange={handleInput}
                  value={sessionName}
                  placeholder="Your session name..."
                />
                <small ref={maxCharacRef}>50</small>
              </div>
              <div className={styles.sessionPermissionStatusContainer}>
                <p>Edit status:</p>
                {!permissionInviteOnly && (
                  <button onClick={() => SetPermissionInviteOnly(true)}>
                    Invite Only
                  </button>
                )}
                {permissionInviteOnly && (
                  <button onClick={() => SetPermissionInviteOnly(false)}>
                    All
                  </button>
                )}
              </div>
              {!permissionInviteOnly && (
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
                    <div>
                      someusername1234
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
                    <div>
                      someusername1234
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
                    <div>
                      someusername1234
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
                  </div>
                </div>
              )}
              <button className={styles.sessionCreateButton} type="submit">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSession;
