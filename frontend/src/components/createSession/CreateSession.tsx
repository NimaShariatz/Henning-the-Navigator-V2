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
  };

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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSession;
