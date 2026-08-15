import styles from './CreateSession.module.css';

interface CreateSessionProps {
  revealCreateSession: boolean;
  RevealCreateSessionClicked_handler: (input: boolean) => void;
}

function CreateSession({
  revealCreateSession,
  RevealCreateSessionClicked_handler,
}: CreateSessionProps) {
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
            <p>Hi</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSession;
