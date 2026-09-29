import styles from './FlightInfo.module.css';
import { useState } from 'react';

function Calculator() {
  const [distanceCalcInput, setDistanceCalcInput] = useState('');
  const [speedCalcInput, setSpeedCalcInput] = useState('');
  const [planeHeadingCalcInput, setPlaneHeadingCalcInput] = useState('');
  const [windHeadingCalcInput, setWindHeadingCalcInput] = useState('');
  const [windSpeetInput, setWindSpeedCalcInput] = useState('');

  const changeDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDistanceCalcInput(newValue);
  };
  const changeSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSpeedCalcInput(newValue);
  };

  const speedDistanceCalculations = () => {
    const distance = Number(distanceCalcInput);
    const time = distance / Number(speedCalcInput);
    // Convert time to hours and minutes
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);

    let timeDisplay = '';
    if (hours > 0) {
      // if there are hours
      timeDisplay += `${hours} hour${hours !== 1 ? 's' : ''}`; // if hour is not 1, make it hours
    }
    if (minutes > 0 || hours === 0) {
      if (hours > 0) timeDisplay += ' '; // if there are hours, add a space
      timeDisplay += `${minutes} minute${minutes !== 1 ? 's' : ''}`; // add minute or minutes
    }
    if (timeDisplay === '') {
      // if empty...
      timeDisplay = '0 minutes';
    }
    return timeDisplay;
  };

  const changePlaneHeading = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (Number(newValue) > 360) {
      newValue = '359';
    } else if (Number(newValue) < 0) {
      newValue = '0';
    }
    setPlaneHeadingCalcInput(newValue);
  };
  const changePlaneHeadingIncrement = (input: number) => {
    const newValue = Number(planeHeadingCalcInput) + input;
    if (newValue > 359) {
      setPlaneHeadingCalcInput('0');
    } else if (newValue < 0) {
      setPlaneHeadingCalcInput('359');
    } else {
      setPlaneHeadingCalcInput(String(newValue));
    }
  };

  const changeWindHeading = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (Number(newValue) > 359) {
      newValue = '359';
    } else if (Number(newValue) < 0) {
      newValue = '0';
    }
    setWindHeadingCalcInput(newValue);
  };
  const changeWindSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setWindSpeedCalcInput(newValue);
  };

  const bombingCalculations = () => {
    const plane = Number(planeHeadingCalcInput);
    const wind = Number(windHeadingCalcInput);
    const sightWindSpeed = windSpeetInput + 'm/s';

    let diff = (plane - wind) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    let heading_output: string;
    if (diff < 0) {
      heading_output = Math.abs(diff) + ' right';
    } else if (diff > 0) {
      heading_output = Math.abs(diff) + ' left';
    } else {
      heading_output = '0';
    }

    return (
      <p>
        Sight Wind Heading: {heading_output} @{sightWindSpeed}
      </p>
    );
  };

  return (
    <>
      <h6 className={styles.sectionTitle}>Speed Distance Calculator</h6>
      <div className={styles.distanceCalcRow}>
        <p>Distance:</p>
        <input
          className={styles.calcInput}
          type="number"
          onChange={changeDistance}
          value={distanceCalcInput}
        ></input>
        <span>Km</span>
      </div>
      <div className={styles.distanceCalcRow}>
        <p>Speed:</p>
        <input
          className={styles.calcInput}
          type="number"
          onChange={changeSpeed}
          value={speedCalcInput}
        ></input>
        <span>Kph</span>
      </div>
      <div className={styles.distanceCalcRow}>
        <p>Time: {speedDistanceCalculations()}</p>
      </div>

      <h6 className={styles.sectionTitle}>Bombing Calculator</h6>
      <div className={styles.bombingCalcRow}>
        <p>Plane Heading:</p>
        <button
          className={styles.leftIncrement}
          onClick={() => changePlaneHeadingIncrement(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 20 20"
          >
            <g fillRule="evenodd" clipRule="evenodd">
              <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
              <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
            </g>
          </svg>
        </button>
        <input
          className={styles.calcInput}
          type="number"
          onChange={changePlaneHeading}
          value={planeHeadingCalcInput}
        ></input>
        <button
          className={styles.rightIncrement}
          onClick={() => changePlaneHeadingIncrement(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 20 20"
          >
            <g fillRule="evenodd" clipRule="evenodd">
              <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
              <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
            </g>
          </svg>
        </button>
      </div>

      <div className={styles.bombingCalcRow}>
        <p>Wind Heading:</p>
        <input
          className={styles.calcInput}
          type="number"
          onChange={changeWindHeading}
          value={windHeadingCalcInput}
        ></input>
      </div>

      <div className={styles.bombingCalcRow}>
        <p>Wind speed(m/s):</p>
        <input
          className={styles.calcInput}
          type="number"
          onChange={changeWindSpeed}
          value={windSpeetInput}
        ></input>
      </div>

      <div className={styles.bombingCalcRow}>{bombingCalculations()}</div>
    </>
  );
}
export default Calculator;
