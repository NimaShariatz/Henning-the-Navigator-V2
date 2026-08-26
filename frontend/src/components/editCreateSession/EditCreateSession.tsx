import styles from './EditCreateSession.module.css';
import { useRef, useState, useEffect } from 'react';
import { SpecificSessionData } from '../../api/Session';
import type { SessionDetailedItem } from '../../api/Session';
import { CreateSession, UpdateSession } from '../../api/Session';
import SessionUserList from './SessionUserList';
import { lowResMapImages } from '../../constants';

interface SessionProps {
  revealHandler: (input: boolean) => void;
  username?: string; // needed for create mode
  onSuccess?: () => void; // triggers list re-fetch in parent
  sessionSlug?: string;
  sessionUsername?: string;
}

function EditCreateSession({
  revealHandler,
  username,
  onSuccess,
  sessionSlug,
  sessionUsername,
}: SessionProps) {
  const [nameInput, setNameInput] = useState('');
  const [sessionInput, setSessionInput] = useState('');
  const [permissionInviteOnly, SetPermissionInviteOnly] = useState(false);
  const [mapSelect, setMapSelect] = useState('');
  const [error, setError] = useState('');
  const [specificSessionData, setSpecificSessionData] =
    useState<SessionDetailedItem | null>(null);

  const maxCharacRefName = useRef<HTMLElement>(null);
  const maxCharacRefInfo = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    nameLengthCalc(newValue, 300, maxCharacRefInfo);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    nameLengthCalc(newValue, 50, maxCharacRefName);
  };

  const nameLengthCalc = (
    inputWord: string,
    maxLength: number,
    textRef: React.RefObject<HTMLElement | null>,
  ) => {
    if (textRef.current)
      textRef.current.textContent = String(maxLength - inputWord.length);
    //console.log(newValue.length)
    if (maxLength - inputWord.length >= 0 && textRef.current) {
      textRef.current.style.color = 'var(--text_color_white)';
    } else if (maxLength - inputWord.length < 0 && textRef.current) {
      textRef.current.style.color = 'var(--delete_red)';
    }
  };

  //make the API call for detailed list
  useEffect(() => {
    if (sessionSlug && sessionUsername) {
      //if we have the fields, set invite boolean, the title, and a useState with all data
      SpecificSessionData(sessionUsername, sessionSlug).then((data) => {
        setNameInput(data.title);
        setSessionInput(data.sessionInfo);
        SetPermissionInviteOnly(!data.all_can_edit);
        setMapSelect(data.map_selected);
        nameLengthCalc(data.title, 50, maxCharacRefName);
        nameLengthCalc(data.title, 300, maxCharacRefInfo);

        setSpecificSessionData(data);
      });
    }
  }, [sessionSlug, sessionUsername]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mapSelect === '') {
      setError('Error: select a map');
      return;
    } else if (nameInput === '') {
      setError('Error: set a session name');
      return;
    }
    const payload = {
      title: nameInput,
      map_selected: mapSelect,
      all_can_edit: !permissionInviteOnly,
      sessionInfo: sessionInput,
    };

    try {
      if (sessionSlug && sessionUsername) {
        await UpdateSession(sessionUsername, sessionSlug, payload); //call api/UpdateSesson
      } else if (username) {
        await CreateSession(username, payload); //call api/CreateSession
      }
      revealHandler(false); // destroy EditCreateSession.tsx
      onSuccess?.(); // fetch the sessions again!
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

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
            <form onSubmit={handleSubmit}>
              <h3 className={styles.sessionSectionTitle}>Session Name</h3>
              <div className={styles.sessionNameContainer}>
                <input
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    handleInput(e);
                  }}
                />

                <small ref={maxCharacRefName}>50</small>
              </div>

              <div className={styles.sessionMapSelectionContainer}>
                <h3 className={styles.sessionSectionTitle}>Map Selection</h3>
                <div className={styles.mapOptionsGrid}>
                  {Object.entries(lowResMapImages).map(([name, image]) => (
                    <div
                      key={name}
                      style={{
                        backgroundImage: `url(${image})`,
                        outlineColor:
                          mapSelect === name
                            ? 'var(--logo_yellow)'
                            : 'transparent',
                        backgroundColor:
                          mapSelect === name
                            ? 'rgba(0, 0, 0, 0.1)'
                            : 'rgba(0, 0, 0, 0.4)',
                      }}
                      onClick={() => setMapSelect(name)}
                    >
                      {/* needs onClick to set a useState, and onHover things. the usual. */}
                      <p>{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.sessionInfoContainer}>
                <h3 className={styles.sessionSectionTitle}>Session Info</h3>
                <textarea
                  value={sessionInput}
                  onChange={(e) => {
                    setSessionInput(e.target.value);
                    handleTextAreaInput(e);
                  }}
                  placeholder="General session information..."
                />
                <small ref={maxCharacRefInfo}>300</small>
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

              <SessionUserList
                permissionType={permissionInviteOnly ? 'invite' : ''}
                specificSessionData={specificSessionData}
              />
              {error && (
                <h5 className={styles.errorText} style={{ color: 'red' }}>
                  {error}
                </h5>
              )}
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
