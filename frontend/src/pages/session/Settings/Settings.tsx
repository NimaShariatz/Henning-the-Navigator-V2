import styles from './Settings.module.css';

interface SettingsProps {
  revealSettings: boolean;
  revealSettingsSetter: () => void;
}

function Settings({ revealSettings, revealSettingsSetter }: SettingsProps) {
  console.log(revealSettings);

  return (
    <>
      {revealSettings && (
        <div
          className={styles.settingsContainer}
          onClick={() => revealSettingsSetter()}
        ></div>
      )}
    </>
  );
}

export default Settings;
