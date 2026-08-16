import styles from './CreateSession.module.css';

interface CreateSessionProps {
  revealCreateSession: boolean;
  RevealCreateSessionClicked_handler: (input: boolean) => void;
}

function CreateSession({
  revealCreateSession,
  RevealCreateSessionClicked_handler,
}: CreateSessionProps) {
  /*
  - name
  - Edit permission
  - if by invite, search names and invite them by clicking
  */

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log(newValue);
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
          <div onClick={(e) => e.stopPropagation()}>
            <div className={styles.sessionContainer}>
              <form>
                <label>Session Name</label>
                <div className={styles.sessionNameContainer}>
                  <input
                    onChange={handleInput}
                    placeholder="Fuel, formations and loadouts..."
                  />
                  <small>50</small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSession;
