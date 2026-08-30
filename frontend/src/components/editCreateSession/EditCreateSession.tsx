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
  onSuccess?: () => void; // triggers list re-fetch in parent. called later below!
  showToast?: () => void;
  sessionSlug?: string;
  sessionUsername?: string;
}

// default shape used in create mode, before any data is fetched
const emptySessionData: SessionDetailedItem = {
  slug: '',
  title: '',
  map_selected: '',
  all_can_edit: true,
  permitted_to_edit: [],
  sessionInfo: '',
  created_at: '',
  last_updated: '',
};

function EditCreateSession({
  revealHandler,
  username,
  onSuccess,
  sessionSlug,
  sessionUsername,
  showToast,
}: SessionProps) {
  const [sessionData, setSessionData] =
    useState<SessionDetailedItem>(emptySessionData);
  const [error, setError] = useState('');

  const maxCharacRefName = useRef<HTMLElement>(null);
  const maxCharacRefInfo = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    nameLengthCalc(newValue, 300, maxCharacRefInfo);
  };

  const handleInputSessionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    nameLengthCalc(newValue, 50, maxCharacRefName);
  };

  const nameLengthCalc = (
    inputWord: string,
    maxLength: number,
    textRef: React.RefObject<HTMLElement | null>,
  ) => {
    const overLimit = maxLength - inputWord.length < 0;
    if (textRef.current) {
      textRef.current.textContent = String(maxLength - inputWord.length);
      textRef.current.style.color = overLimit
        ? 'var(--delete_red)'
        : 'var(--text_color_white)';
    }
    return overLimit;
  };

  //make the API call for detailed list
  useEffect(() => {
    if (sessionSlug && sessionUsername) {
      SpecificSessionData(sessionUsername, sessionSlug).then((data) => {
        //make the API call for detailed list
        setSessionData(data);
        nameLengthCalc(data.title, 50, maxCharacRefName);
        nameLengthCalc(data.sessionInfo, 300, maxCharacRefInfo);
      });
    }
  }, [sessionSlug, sessionUsername]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sessionData.map_selected === '') {
      setError('Error: select a map');
      return;
    } else if (sessionData.title === '') {
      setError('Error: set a session name');
      return;
    } else if (nameLengthCalc(sessionData.title, 50, maxCharacRefName)) {
      setError('Error: session name beyond 50 character limit');
      return;
    } else if (nameLengthCalc(sessionData.sessionInfo, 300, maxCharacRefInfo)) {
      setError('Error: session info beyond 300 character limit');
      return;
    }
    const payload = {
      title: sessionData.title,
      map_selected: sessionData.map_selected,
      all_can_edit: sessionData.all_can_edit,
      sessionInfo: sessionData.sessionInfo,
      permitted_to_edit: sessionData.permitted_to_edit,
    };

    try {
      if (sessionSlug && sessionUsername) {
        await UpdateSession(sessionUsername, sessionSlug, payload); //call api/UpdateSesson
      } else if (username) {
        await CreateSession(username, payload); //call api/CreateSession
      }
      revealHandler(false); // destroy EditCreateSession.tsx
      onSuccess?.(); // fetch the sessions again!
      showToast?.(); // do the toast
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
                  value={sessionData.title}
                  onChange={(e) => {
                    setSessionData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                    handleInputSessionName(e);
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
                          sessionData.map_selected === name
                            ? 'var(--logo_yellow)'
                            : 'transparent',
                        backgroundColor:
                          sessionData.map_selected === name
                            ? 'rgba(0, 0, 0, 0.1)'
                            : 'rgba(0, 0, 0, 0.4)',
                      }}
                      onClick={() =>
                        setSessionData((prev) => ({
                          ...prev,
                          map_selected: name,
                        }))
                      }
                    >
                      <p>{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.sessionInfoContainer}>
                <h3 className={styles.sessionSectionTitle}>Session Info</h3>
                <textarea
                  value={sessionData.sessionInfo}
                  onChange={(e) => {
                    setSessionData((prev) => ({
                      ...prev,
                      sessionInfo: e.target.value,
                    }));
                    handleTextAreaInput(e);
                  }}
                  placeholder="General session information..."
                />
                <small ref={maxCharacRefInfo}>300</small>
              </div>

              <div className={styles.sessionPermissionStatusContainer}>
                <p>Edit status:</p>
                {sessionData.all_can_edit && (
                  <button
                    type="button"
                    onClick={() =>
                      setSessionData((prev) => ({
                        ...prev,
                        all_can_edit: false,
                      }))
                    }
                  >
                    All
                  </button>
                )}
                {!sessionData.all_can_edit && (
                  <button
                    type="button"
                    onClick={() =>
                      setSessionData((prev) => ({
                        ...prev,
                        all_can_edit: true,
                      }))
                    }
                  >
                    Invite Only
                  </button>
                )}
              </div>

              <SessionUserList
                permissionType={!sessionData.all_can_edit ? 'invite' : ''}
                editUsers={sessionData.permitted_to_edit}
                setEditUsers={(users) =>
                  setSessionData((prev) => ({
                    ...prev,
                    permitted_to_edit: users,
                  }))
                }
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
