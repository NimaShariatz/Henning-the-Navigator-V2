import styles from './DeleteAccount.module.css';
import { useEffect, useState } from 'react';
import { deleteUser } from '../../api/User';
import { useNavigate } from 'react-router';

interface DeleteProfileProps {
  errorClicked: boolean;
  ErrorClicked_handler: (input: boolean) => void;
}

function DeleteProfile({
  errorClicked,
  ErrorClicked_handler,
}: DeleteProfileProps) {
  const navigate = useNavigate();

  type PopupKey = 'Check1' | 'Check2' | 'Check3';
  const [deleteFlags, setDeleteFlags] = useState<Record<PopupKey, boolean>>({
    //the flag checks for deleting an account
    Check1: false,
    Check2: false,
    Check3: false,
  });
  const handle_DeleteFlags = (sect: PopupKey) => {
    setDeleteFlags((prev) => ({ ...prev, [sect]: !prev[sect] })); //set flag to false
  };
  const resetDeleteFlags = () => {
    setDeleteFlags({
      Check1: false,
      Check2: false,
      Check3: false,
    });
    ErrorClicked_handler(false); // remove popup
  };

  useEffect(() => {
    //console.log(deleteFlags.Check1 == true && deleteFlags.Check2 == true && deleteFlags.Check3 == true)
    if (
      deleteFlags.Check1 == true &&
      deleteFlags.Check2 == true &&
      deleteFlags.Check3 == true
    ) {
      deleteUser().then(() =>
        navigate('/login', { state: { toast: 'Account deleted' } }),
      ); /* Trigger TOAST message! */
    }
  }, [deleteFlags, navigate]);

  return (
    <>
      <div
        style={{ display: errorClicked ? 'block' : 'none' }}
        className={styles.deleteContainer}
      >
        <div
          className={styles.outsideContainer}
          onClick={() => ErrorClicked_handler(false)}
        >
          <div
            className={styles.formContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Delete Account</h4>
            {!deleteFlags.Check1 && (
              <>
                <p>
                  Are you sure you want to delete your account?{' '}
                  <b>All created sessions will also be deleted.</b>
                </p>
                <div className={styles.optionsRow}>
                  <button onClick={resetDeleteFlags}>No</button>
                  <button onClick={() => handle_DeleteFlags('Check1')}>
                    Yes
                  </button>
                </div>
              </>
            )}
            {deleteFlags.Check1 && !deleteFlags.Check2 && (
              <>
                <p>Are you really really sure?</p>
                <div className={styles.optionsRow}>
                  <button onClick={resetDeleteFlags}>No</button>
                  <button onClick={() => handle_DeleteFlags('Check2')}>
                    Yes I'm sure
                  </button>
                </div>
              </>
            )}
            {deleteFlags.Check2 && !deleteFlags.Check3 && (
              <>
                <p>Just checking that wasn't a muscle spasm.</p>
                <div className={styles.optionsRow}>
                  <button onClick={resetDeleteFlags}>No</button>
                  <button onClick={() => handle_DeleteFlags('Check3')}>
                    It's not a muscle spasm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteProfile;
