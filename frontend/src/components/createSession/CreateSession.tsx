import styles from './CreateSession.module.css';
import { useRef, useState } from 'react';

interface CreateSessionProps {
  revealCreateSession: boolean;
  RevealCreateSessionClicked_handler: (input: boolean) => void;
  sectionTitle: string;
}

function CreateSession({
  revealCreateSession,
  RevealCreateSessionClicked_handler,
  sectionTitle,
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
      console.log('blue!');
    } else if (50 - newValue.length < 0 && maxCharacRef.current) {
      maxCharacRef.current.style.color = 'var(--delete_red)';
      console.log('red!');
    }
  };

  /*
    import more variables... so that component can be reused for edit
    add edit button to createsession sessions
    search and invite list would be stored in a useState() list. that list would be used for the API call info.
  */

  return (
    <>
      <div
        style={{ display: revealCreateSession ? 'block' : 'none' }}
        className={styles.createSessionContainer}
      >
        <div
          className={styles.outsideContainer}
          onClick={() => RevealCreateSessionClicked_handler(false)}
        >
          <div
            className={styles.sessionContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>{sectionTitle}</h1>
            <form>
              <label>Session Name</label>
              <div className={styles.sessionNameContainer}>
                <input
                  onChange={handleInput}
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
                    <button>Search</button>
                  </div>
                  <div className={styles.userSearchList}>
                    <p>someusername1234</p>
                    <p>someusername1234</p>
                    <p>someusername1234</p>
                  </div>
                  <div className={styles.allowedToEditList}>
                    <h6>Users Allowed To Edit</h6>
                    <p>someusername1234</p>
                    <p>someusername1234</p>
                    <p>someusername1234</p>
                  </div>
                </div>
              )}
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSession;
