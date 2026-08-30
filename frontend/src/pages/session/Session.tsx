import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { SpecificSessionData } from '../../api/Session';
import type { SessionDetailedItem } from '../../api/Session';
import styles from './Session.module.css';

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

function Session() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [sessionData, setSessionData] =
    useState<SessionDetailedItem>(emptySessionData);

  useEffect(() => {
    if (!username || !slug) return;
    SpecificSessionData(username, slug).then(setSessionData);
  }, [username, slug]);

  return (
    <>
      <h1>{sessionData.title}</h1>
      <p className={styles.tempo}>hi!</p>
    </>
  );
}
export default Session;
