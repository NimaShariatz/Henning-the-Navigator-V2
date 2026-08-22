import styles from './EditCreateSession.module.css';
import { useRef, useState, useEffect } from 'react';
import { SpecificSessionData } from '../../api/Session';
import type { SessionDetailedItem } from '../../api/Session';
import SessionUserList from './SessionUserList';

interface SessionProps {
  revealHandler: (input: boolean) => void;
  sessionSlug?: string;
  sessionUsername?: string;
}

function EditCreateSession({
  revealHandler,
  sessionSlug,
  sessionUsername,
}: SessionProps) {
  const [nameInput, setNameInput] = useState('');
  const [permissionInviteOnly, SetPermissionInviteOnly] = useState(false);
  const [specificSessionData, setSpecificSessionData] =
    useState<SessionDetailedItem | null>(null);

  const maxCharacRef = useRef<HTMLElement>(null);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    namelengthCalc(newValue);
  };
  const namelengthCalc = (inputWord: string) => {
    if (maxCharacRef.current)
      maxCharacRef.current.textContent = String(50 - inputWord.length);
    //console.log(newValue.length)
    if (50 - inputWord.length >= 0 && maxCharacRef.current) {
      maxCharacRef.current.style.color = 'var(--text_color_white)';
    } else if (50 - inputWord.length < 0 && maxCharacRef.current) {
      maxCharacRef.current.style.color = 'var(--delete_red)';
    }
  };

  //make the API call for detailed list
  useEffect(() => {
    if (sessionSlug && sessionUsername) {
      //if we have the fields, set invite boolean, the title, and a useState with all data
      SpecificSessionData(sessionUsername, sessionSlug).then((data) => {
        setNameInput(data.title);
        namelengthCalc(data.title);
        SetPermissionInviteOnly(!data.all_can_edit);
        setSpecificSessionData(data);
      });
    }
  }, [sessionSlug, sessionUsername]);

  return (
    <>
      <div className={styles.createSessionContainer}>
        <div
          className={styles.outsideContainer}
          onClick={() => revealHandler(false)}
        >
          <div
            className={styles.sessionContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.close}>
              <button onClick={() => revealHandler(false)}>
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
            <h1>{sessionSlug ? 'Edit Session' : 'Create Session'}</h1>
            <form>
              <p>Session Name</p>
              <div className={styles.sessionNameContainer}>
                <input
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    handleInput(e);
                  }}
                />

                <small ref={maxCharacRef}>50</small>
              </div>
              <div className={styles.sessionPermissionStatusContainer}>
                <p>Edit status:</p>
                {!permissionInviteOnly && (
                  <button onClick={() => SetPermissionInviteOnly(true)}>
                    All
                  </button>
                )}
                {permissionInviteOnly && (
                  <button onClick={() => SetPermissionInviteOnly(false)}>
                    Invite Only
                  </button>
                )}
              </div>

              <div className={styles.sessionInfoContainer}>
                <p>Session Info</p>
                <textarea />
              </div>

              <SessionUserList
                permissionType={permissionInviteOnly ? 'invite' : ''}
                specificSessionData={specificSessionData}
              />

              <button className={styles.sessionCreateButton} type="submit">
                {sessionSlug ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditCreateSession;
