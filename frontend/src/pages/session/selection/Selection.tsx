import styles from './Selection.module.css';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import type { OptionKey, OptionSelected } from '../../../constants';
import { DEFAULT_COLORSELECT_OPTIONS } from '../../../constants';
import { useRef } from 'react';
import { useEffect } from 'react';
import type { Waypoint } from '../../../constants';

interface selectionProps {
  optionSelected: OptionSelected;
  selectOption: (option: OptionKey) => void;
  clearWaypoints: () => void;
  clearTargets: () => void;
  clearTexts: () => void;
  clearFrontlines: () => void;
  waypoints: Waypoint[];
  waypointId: number;
  setWaypointId: (newId: number) => void;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

function Selection({
  optionSelected,
  selectOption,
  clearWaypoints,
  clearTargets,
  clearTexts,
  clearFrontlines,
  waypoints,
  waypointId,
  setWaypointId,
  color,
  setColor,
}: selectionProps) {
  const leftIncrement = useRef<HTMLButtonElement>(null);
  const rightIncrement = useRef<HTMLButtonElement>(null);
  const [revealColorPicker, setColorPicker] = useState(false);
  const [changeOptions, setChangeOptions] = useState(1);
  const ChangeOptionsHandler = () => {
    // 1 = targets
    // 2 = waypoints
    // 3 = miscellanous
    if (changeOptions == 4) {
      setChangeOptions(1);
      return;
    }
    setChangeOptions(changeOptions + 1);
  };

  useEffect(() => {
    if (leftIncrement.current) {
      const disableLeft = waypoints.length === 0 || waypointId === 1;
      leftIncrement.current.disabled = disableLeft;
      leftIncrement.current.style.cursor = disableLeft
        ? 'not-allowed'
        : 'pointer';
    }
    if (rightIncrement.current) {
      const disableRight = waypointId > waypoints.length;
      rightIncrement.current.disabled = disableRight;
      rightIncrement.current.style.cursor = disableRight
        ? 'not-allowed'
        : 'pointer';
    }
  }, [waypointId, waypoints, changeOptions]);

  return (
    <div className={styles.overallContainer}>
      {changeOptions === 2 && (
        <div className={styles.waypoinIdContainer}>
          <button
            className={styles.leftIncrement}
            ref={leftIncrement}
            onClick={() => setWaypointId(waypointId - 1)}
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
          <p>{waypointId}</p>
          <button
            className={styles.rightIncrement}
            ref={rightIncrement}
            onClick={() => setWaypointId(waypointId + 1)}
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
      )}
      {!revealColorPicker &&
        (changeOptions === 1 || changeOptions === 3 || changeOptions === 4) && ( // if targets or text or frontline and colorreveal not clicked...
          <div
            className={styles.rgba}
            onClick={() => setColorPicker(true)}
            style={{ backgroundColor: color }}
          ></div>
        )}
      {revealColorPicker &&
        (changeOptions === 1 || changeOptions === 3 || changeOptions === 4) && ( // if targets or text or frontline and colorreveal clicked...
          <div className={styles.rgbaContainer}>
            <div className={styles.colorDefaultRow}>
              <button
                style={{
                  backgroundColor: DEFAULT_COLORSELECT_OPTIONS.redTarget,
                }}
                onClick={() => setColor(DEFAULT_COLORSELECT_OPTIONS.redTarget)}
              >
                Red
              </button>
              <button
                style={{
                  backgroundColor: DEFAULT_COLORSELECT_OPTIONS.blueTarget,
                }}
                onClick={() => setColor(DEFAULT_COLORSELECT_OPTIONS.blueTarget)}
              >
                Blue
              </button>
              <button
                style={{
                  backgroundColor: DEFAULT_COLORSELECT_OPTIONS.greyTarget,
                }}
                onClick={() => setColor(DEFAULT_COLORSELECT_OPTIONS.greyTarget)}
              >
                Grey
              </button>
            </div>
            <HexColorPicker color={color} onChange={setColor} />
            <button
              className={styles.doneButton}
              onClick={() => setColorPicker(false)}
            >
              Done
            </button>
          </div>
        )}
      <div className={styles.selectionContainer}>
        <button className={styles.changeOptions} onClick={ChangeOptionsHandler}>
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

        <div className={styles.optionsContainer}>
          {changeOptions === 1 && ( // Targets
            <>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('radar')}
                style={{
                  outlineColor: optionSelected.radar
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <path
                      d="M5.269 4.026c.557-.628 1.463-.628 2.044-.148l.105.095l4.848 4.847l.087-.087a1 1 0 0 1 
                  1.497 1.32l-.083.094l-.087.087l4.347 4.348c.572.572.614 1.557-.053 2.15a8.97 8.97 0 0 1-4.466 2.142l-.341.051l.98 1.318a1.1 1.1 0 0 
                  1-.766 1.751l-.116.006h-6.58a1.1 1.1 0 0 1-1.058-1.403l.04-.115l1.254-3.051A8.99 8.99 0 0 1 3 10a8.97 8.97 0 0 1 2.269-5.974m3.426 14.348L8.028 20h3.446l-.819-1.1a9 9 0 0 1-1.582-.387l-.378-.14ZM6.407 5.79a7 
                  7 0 0 0 9.803 9.803l-3.944-3.944l-1.559 1.558a1 1 0 0 1-1.414-1.414l1.558-1.559zm7.7-.737a3.5 3.5 0 0 1 2.859 2.96a1 1 0 0 1-1.958.393l-.023-.115a1.5 1.5 
                  0 0 0-1.07-1.233l-.155-.035a1 1 0 0 1 .348-1.97ZM14 2a6 6 0 0 1 6 6a1 1 0 0 1-1.993.117L18 8a4 4 0 0 0-4-4a1 1 0 1 1 0-2"
                    />
                  </g>
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('factory')}
                style={{
                  outlineColor: optionSelected.factory
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 12V9.95l-5 2V10l-3 1.32V20h16v-8zm-3 6H7v-4h2zm4 0h-2v-4h2zm4 0h-2v-4h2z"
                    opacity="0.3"
                  />
                  <path d="M22 22H2V10l7-3v2l5-2v3h3l1-8h3l1 8zM12 9.95l-5 2V10l-3 1.32V20h16v-8h-8zM11 18h2v-4h-2zm-4 0h2v-4H7zm10-4h-2v4h2z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('city')}
                style={{
                  outlineColor: optionSelected.city
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 15h-2v-2h2m0 6h-2v-2h2M13 7h-2V5h2m0 6h-2V9h2m0 6h-2v-2h2m0 6h-2v-2h2m-6-6H5V9h2m0 6H5v-2h2m0 6H5v-2h2m8-6V5l-3-3l-3 3v2H3v14h18V11z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('railyard')}
                style={{
                  outlineColor: optionSelected.railyard
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 512 512"
                >
                  <path d="M18 112v39h38v-39zm102 0v39h48v-39zm112 0v39h48v-39zm112 0v39h48v-39zm112 0v39h38v-39zM18 169v30h476v-30zm0 48v78h38v-78zm102 0v78h48v-78zm112 0v78h48v-78zm112 0v78h48v-78zm112 0v78h38v-78zM18 313v30h476v-30zm0 48v39h38v-39zm102 0v39h48v-39zm112 0v39h48v-39zm112 0v39h48v-39zm112 0v39h38v-39z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('train')}
                style={{
                  outlineColor: optionSelected.train
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                >
                  <path d="M4.25 12.68v-.32c0-.1.03-.18.1-.25s.15-.1.25-.1h7.58c.1 0 .18.03.25.1s.1.15.1.25v.32c0 .1-.03.18-.1.25s-.15.1-.25.1h-.44v1.65h2.12c.02-.28.14-.52.35-.71s.46-.29.75-.29s.53.1.74.29s.32.43.35.71h1.32v-3.39a.52.52 0 0 1-.35-.16c-.1-.1-.15-.23-.15-.37v-.31c0-.14.05-.27.16-.38s.24-.16.39-.16h1.99c.15 0 .28.05.38.16s.15.23.15.38v.31c0 .14-.05.27-.14.37s-.2.16-.34.16v3.39h1.56c.27 0 .51.1.71.3s.3.44.3.71v2.93l3.73 4.87h-4.74v-3.04h-.71c.11.26.16.54.16.83c0 .61-.21 1.12-.64 1.56c-.43.43-.95.65-1.55.65c-.61 0-1.12-.22-1.56-.65a2.13 2.13 0 0 1-.65-1.56c0-.29.05-.57.16-.83h-1c.11.27.17.55.17.83c0 .61-.22 1.12-.65 1.56s-.95.65-1.56.65s-1.12-.22-1.55-.65s-.64-.95-.64-1.56c0-.29.05-.57.16-.83H9.97c.12.29.18.57.18.83c0 .61-.22 1.12-.65 1.56s-.95.65-1.56.65s-1.12-.22-1.56-.65s-.65-.95-.65-1.56c0-.29.06-.57.17-.84c-.24-.04-.45-.15-.61-.34s-.24-.41-.24-.66v-.86h-.02v-5.55H4.6c-.1 0-.18-.03-.25-.1a.33.33 0 0 1-.1-.25m2.05 3.94c0 .21.07.39.22.54s.33.22.54.22H8.5c.21 0 .39-.07.53-.22s.22-.33.22-.54v-2.3a.7.7 0 0 0-.22-.53a.7.7 0 0 0-.53-.22H7.07c-.21 0-.39.07-.54.23c-.15.15-.22.32-.22.52v2.3zm9.48-11.19c0 .41.16.76.47 1.04c0 .2.09.43.26.68s.36.4.56.44c.04.22.15.41.31.57c.16.15.36.25.59.3c-.11.11-.16.24-.16.39q0 .27.18.45t.45.18c.18 0 .33-.06.46-.19c.13-.12.19-.28.19-.45c0-.02 0-.05-.01-.09s-.01-.08-.01-.1h.03c.21 0 .39-.08.54-.23s.23-.34.23-.55c0-.1-.04-.22-.12-.38c.17-.09.31-.25.41-.47h.45c.39-.02.73-.17 1-.45c.28-.28.42-.61.42-1.01q0-.51-.33-.9c-.22-.26-.5-.43-.83-.52c-.08-.4-.29-.73-.62-.99s-.71-.39-1.12-.39s-.77.13-1.08.38s-.52.58-.62.97h-.11q-.615 0-1.08.39c-.31.25-.46.57-.46.93" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('oildepot')}
                style={{
                  outlineColor: optionSelected.oildepot
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M288 133v18h160v-18zm41 34v16h78v-16zM64 201c-5.75 0-10.406 1.939-15.074 6.023c-4.668 
                  4.085-9.078 10.48-12.701 18.631C28.978 241.96 25 265 25 288s3.978 46.041 11.225 62.346c3.623 8.152 8.033 14.546 12.7 
                  18.63C53.595 373.062 58.25 375 64 375h5.055l2-17.994l.89-8.006h80.11l2.888 26H183V201zm137 0v46h46v-46zm64 0v174h28.055l2-17.994l.89-8.006h80.11l2.888 
                  26H448c5.75 0 10.406-1.94 15.074-6.023c4.668-4.085 9.08-10.48 12.703-18.631c7.247-16.304 11.225-39.343 
                  11.225-62.342c0-23-3.976-46.04-11.223-62.344c-3.623-8.152-8.034-14.55-12.703-18.635c-4.668-4.084-9.326-6.024-15.076-6.025zm-64 64v46h46v-46zm0 64v46h46v-46zM88.057 367l-14 126h75.886l-13.998-126zm224 0l-14 126h75.886l-13.998-126zM183 384v110h18v-37h46v37h18V384h-18v55h-46v-55zm226 
                  9v30h30v-30zm6.803 48c5.844 19.928 16.417 32.884 28.318 40.563C462.214 493.235 482 493 490 493v-18c-8 0-23.214-.235-36.121-8.563c-7.548-4.87-14.772-12.42-19.473-25.437z"
                  />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('tank')}
                style={{
                  outlineColor: optionSelected.tank
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 32 32"
                >
                  <path d="M30 13v-2H18.618l-.723-1.447A1 1 0 0 0 17 9H9a1 1 0 0 0-1 1v5H4v2h18.638l3.6 3H3a1 1 0 0 0-1 1v2a5.006 5.006 0 0 0 5 5h18a5.006 5.006 0 0 0 5-5v-2a1 1 0 0 0-.36-.769l-6-5A1 1 0 0 0 23 15h-2.382l-1-2Zm-2 10a3.003 3.003 0 0 1-3 3H7a3.003 3.003 0 0 1-3-3v-1h24Zm-18-8v-4h6.382l2 4Z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('ship')}
                style={{
                  outlineColor: optionSelected.ship
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 4h5.446a1 1 0 0 1 .848.47L18.75 10h4.408a.5.5 0 0 1 .439.74L19.637 18H19a6 6 0 0 1-1.535-.198L20.63 12H3.4l1.048 5.824A6 6 0 0 1 3 18h-.545l-1.24-6.821A1 1 0 0 1 2.197 10H3V5a1 1 0 0 1 1-1h1V1h4zm-4 6h11.392l-2.5-4H5zM3 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 11 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 19 20h2v2h-2a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 11 22a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 3 22H1v-2z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('bridge')}
                style={{
                  outlineColor: optionSelected.bridge
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="80%"
                  height="80%"
                  viewBox="0 0 512 512"
                >
                  <path d="M18 151v18h37v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h37v-18zm0 66v30h23v179.1c7.95-1.8 15.9-3.1 23-3.1c13.18 0 24.7 4.6 35.2 8.6c1.3.5 2.5 1 3.8 1.4V284.3l37.2-37.3h231.5l37.3 36.7V433c1.3-.4 2.5-.9 3.8-1.4c10.5-4 22-8.6 35.2-8.6c7.1 0 15.1 1.3 23 3.1V247h23v-30zm46 226c-16.54.8-31.84 5.3-46 9.4v18.8c2.59-.8 5.39-1.7 8.35-2.6C39.27 464.7 55.18 461 64 461s18.3 3.4 28.8 7.4s22 8.6 35.2 8.6s24.7-4.6 35.2-8.6s20-7.4 28.8-7.4s18.3 3.4 28.8 7.4s22 8.6 35.2 8.6s24.7-4.6 35.2-8.6s20-7.4 28.8-7.4s18.3 3.4 28.8 7.4s22 8.6 35.2 8.6s24.7-4.6 35.2-8.6s20-7.4 28.8-7.4s24.7 3.7 37.6 7.6c3 .9 5.8 1.8 8.4 2.6v-18.8c-14.8-4-32-9.2-46-9.4c-13.2 0-24.7 4.6-35.2 8.6s-20 7.4-28.8 7.4s-18.3-3.4-28.8-7.4s-22-8.6-35.2-8.6s-24.7 4.6-35.2 8.6s-20 7.4-28.8 7.4s-18.3-3.4-28.8-7.4s-22-8.6-35.2-8.6s-24.7 4.6-35.2 8.6s-20 7.4-28.8 7.4s-18.3-3.4-28.8-7.4S77.18 443 64 443" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('truck')}
                style={{
                  outlineColor: optionSelected.truck
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="87%"
                  height="87%"
                  viewBox="0 0 512 512"
                >
                  <path
                    fillRule="evenodd"
                    d="M138.667 341.333c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32m256 0c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32m-96-192v149.333H320v-128h106.667L469.334 256v106.666h-22.4C441.991 338.322 420.468 320 394.666 320s-47.325 18.322-52.266 42.666H190.933C185.992 338.322 164.47 320 138.667 320s-47.325 18.322-52.266 42.666H42.667V149.333zM256 192H85.334v106.666H256zm144.3 21.333h-37.632v42.666h58.965z"
                  />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('defence')}
                style={{
                  outlineColor: optionSelected.defence
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 6.39v4.7c0 4 2.55 7.7 6 8.83c3.45-1.13 6-4.82 6-8.83v-4.7l-6-2.25z"
                    opacity="0.3"
                  />
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5zm6 9.09c0 4-2.55 7.7-6 8.83c-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25l6 2.25z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('artillary')}
                style={{
                  outlineColor: optionSelected.artillary
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="80%"
                  height="80%"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="m372.386 52.97l-14.822 13.064l103.244 117.142l14.822-13.064zm-30.23 26.646l-36.649 32.303l15.549 17.64zm16.865 16.346l-20.442 48.382l-1.457 3.448l19.012 21.57l21.897-51.832zm-67.537 28.318L119.939 275.485l.054.062l-1.294 1.141c-19.625 17.298-36.277 35.67-49.407 53.91l92.854 105.356c19.745-10.734 40.062-24.948 59.687-42.246l1.295-1.143l.055.063l6.23-5.493l165.313-145.713zm102.615 11.482l-20.443 48.385l-1.456 3.445l20.838 23.641l21.897-51.83zm36.904 41.873l-20.441 48.385l-.973 2.303l37.194-32.783zM58.583 346.723c-4.228 6.959-7.93 13.848-11.015 20.592c-6.73 
                14.712-10.7 28.778-11.157 41.78c-.457 13.001 2.827 25.259 10.93 34.452c8.103 9.194 19.85 13.989 32.805 15.168c12.955 1.18 27.408-.992 42.847-5.822c7.078-2.214 14.377-5.02 21.811-8.342z"
                  />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('airfield')}
                style={{
                  outlineColor: optionSelected.airfield
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="88%"
                  height="88%"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13.105 12.609v2.279a.12.12 0 0 0 .061.105l.622.355a.49.49 0 0 1 .242.365l.049.413a.243.243 0 0 1-.307.263l-1.641-.459a.5.5 0 0 0-.262 0l-1.641.459a.244.244 0 0 1-.308-.263l.05-.413a.49.49 0 0 1 .242-.365l.621-.355a.12.12 0 0 0 .062-.105v-2.279a.122.122 0 0 0-.137-.121l-3.485.435A.242.242 0 0 1 7 12.682v-.624a.49.49 0 0 1 .316-.455l3.5-1.313a.12.12 0 0 0 .079-.114v-.741a4.8 4.8 0 0 1 .1-.981a1.015 1.015 0 0 1 1.2-.833a1.06 1.06 0 0 1 .819.9l.015.094a6 6 0 0 1 .077.976v.587a.12.12 
                0 0 0 .079.114l3.5 1.313a.49.49 0 0 1 .316.455v.624a.243.243 0 0 1-.274.241l-3.484-.435a.12.12 0 0 0-.138.119"
                  />
                  <path d="M12 21.933A9.933 9.933 0 1 1 21.933 12A9.944 9.944 0 0 1 12 21.933m0-18.866A8.933 8.933 0 1 0 20.933 12A8.943 8.943 0 0 0 12 3.067" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('antiair')}
                style={{
                  outlineColor: optionSelected.antiair
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="73%"
                  height="73%"
                  viewBox="0 0 512 512"
                >
                  <path d="m472.7 22.8l-38.5 44.91L448 84.24l48-34.65zm-50.4 55.05L312.2 178.7l-25.3 8.1l-66.3 69.6l22.8 24.7l69.3-65.4l12.9-21.5L435.7 93.27zm-8.7 72.65l-19.9 25.6l10.3 13.4l26.6-19.6zm-32.4 37.1l-68.5 62.3l-16 3.6l-42.1 39.2l20.7 22.3l43.6-39.5l6.4-13.8l65.2-62.4zm-245.8 67.3c-26.6.3-52.06 25.8-52.33 52.4c-.33 17.8 9.08 34.4 24.53 43.3l23.6-7.6c-18-2.1-31.59-17.5-31.39-35.7c0-19.7 15.89-35.7 35.59-35.7c10-.2 19.5 3.8 26.4 11v-17c-8-4.7-17.1-11-26.4-10.7m44.5 8.2v78.5L120.5 365v23.5h145v-55.2l-65.4-70.2zM87.51 407.2l-43.29 43h13.47l11.54 8l35.57-27.3h107.6l11.5 19.3H245l6.1-19.3h23.4l97.3 28.2l9.6-8.9h16l-106.5-43zm-50.68 59.9l-20.85 22.1h62.55l-20.84-22.1zm187.07 0L203 489.2h62.9L245 467.1zm160.7 0l-19.3 22.1h61L407 467.1z" />
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('parachute')}
                style={{
                  outlineColor: optionSelected.parachute
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="75%"
                  height="75%"
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <mask id="SVGjj1J1bLL">
                      <g
                        fill="none"
                        stroke="#fff"
                        strokeLinejoin="round"
                        strokeWidth={3}
                      >
                        <path
                          fill="#555"
                          d="M16.727 24q3.636-3.636 7.273-3.636T31.273 24q4.243-3.636 6.363-3.636q2.122 0 6.364 3.636c0-11.046-8.954-20-20-20S4 12.954 4 24q4.243-3.636 6.364-3.636T16.727 24Z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          d="m4 24l20 20l-7.273-20m14.546 0L24 44l20-20"
                        ></path>
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill={color}
                    d="M0 0h48v48H0z"
                    mask="url(#SVGjj1J1bLL)"
                  ></path>
                </svg>
              </button>
              <button
                className={styles.targetButton}
                onClick={() => selectOption('unknown')}
                style={{
                  outlineColor: optionSelected.unknown
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  fill={color}
                  xmlns="http://www.w3.org/2000/svg"
                  width="80%"
                  height="80%"
                  viewBox="0 0 32 32"
                >
                  <path d="M29.391 14.527L17.473 2.609C17.067 2.203 16.533 2 16 2s-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 24a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m1.125-6.752v1.877h-2.25V15H17c1.034 0 1.875-.841 1.875-1.875S18.034 11.25 17 11.25h-2a1.877 1.877 0 0 0-1.875 1.875v.5h-2.25v-.5A4.13 4.13 0 0 1 15 9h2a4.13 4.13 0 0 1 4.125 4.125a4.13 4.13 0 0 1-4 4.123" />
                  <path
                    fill="none"
                    d="M16 21a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 16 21m1.125-3.752a4.13 4.13 0 0 0 4-4.123A4.13 4.13 0 0 0 17 9h-2a4.13 4.13 0 0 0-4.125 4.125v.5h2.25v-.5c0-1.034.841-1.875 1.875-1.875h2c1.034 0 1.875.841 1.875 1.875S18.034 15 17 15h-2.125v4.125h2.25z"
                  />
                </svg>
              </button>
              <button
                className={styles.miscButton}
                onClick={() => clearTargets()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="65%"
                  height="65%"
                  viewBox="0 0 24 24"
                >
                  <g fill="#fff" fillRule="evenodd">
                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path d="M17.278 2.613a1 1 0 0 1 1.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 0 1-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 0 1 2.981-1.087l.199.046l.737.197zM10.5 13.348a44 44 0 0 1-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 0 0 1.426-1.338a7 7 0 0 0 .488-.654l.142-.232a1 1 0 0 1 1.747.973c-.234.42-.527.814-.832 1.184a10 10 0 0 1-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 0 1 1.793.887c-.229.462-.496.909-.78 1.339a11 11 0 0 1-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904zm2.819-2.35a1.09 1.09 0 0 0-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038zM5.565 7.716l.064.14A3.26 3.26 0 0 0 6.866 9.22l.1.058a.068.068 0 0 1 0 .118l-.1.058A3.26 3.26 0 0 0 5.63 10.82l-.064.139a.071.071 0 0 1-.13 0l-.064-.14a3.26 3.26 0 0 0-1.237-1.364l-.1-.058a.068.068 0 0 1 0-.118l.1-.058A3.26 3.26 0 0 0 5.37 7.855l.064-.139a.071.071 0 0 1 .13 0Zm2.832-4.859c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 0 0 1.97 2.171l.157.093a.108.108 0 0 1 0 .189l-.158.092a5.2 5.2 0 0 0-1.97 2.172l-.1.222a.113.113 0 0 1-.207 0l-.102-.222a5.2 5.2 0 0 0-1.97-2.172l-.158-.092a.108.108 0 0 1 0-.189l.159-.093a5.2 5.2 0 0 0 1.97-2.171l.1-.222Z" />
                  </g>
                </svg>
              </button>
            </>
          )}
          {changeOptions === 2 && ( // Waypoints
            <>
              <button
                className={styles.waypointButton}
                onClick={() => selectOption('startPoint')}
                style={{
                  outlineColor: optionSelected.startPoint
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-start">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_start)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-start)"
                  />
                </svg>
              </button>
              <button
                className={styles.waypointButton}
                onClick={() => selectOption('ingressPoint')}
                style={{
                  outlineColor: optionSelected.ingressPoint
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-ingress">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_ingress)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-ingress)"
                  />
                </svg>
              </button>
              <button
                className={styles.waypointButton}
                onClick={() => selectOption('targetPoint')}
                style={{
                  outlineColor: optionSelected.targetPoint
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-target">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_target)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-target)"
                  />
                </svg>
              </button>
              <button
                className={styles.waypointButton}
                onClick={() => selectOption('egressPoint')}
                style={{
                  outlineColor: optionSelected.egressPoint
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="85%"
                  height="85%"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <mask id="point-extraction">
                      <g fill="none">
                        <path
                          stroke="#ffffff"
                          strokeLinecap="round"
                          strokeOpacity="1"
                          d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5"
                        />
                        <path
                          fill="#fff"
                          fillOpacity="0.25"
                          d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="3"
                          fillOpacity="0.85"
                          fill="#fff"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="var(--waypoint_extraction)"
                    d="M0 0h24v24H0z"
                    mask="url(#point-extraction)"
                  />
                </svg>
              </button>
              <button
                className={styles.miscButton}
                onClick={() => clearWaypoints()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="65%"
                  height="65%"
                  viewBox="0 0 24 24"
                >
                  <g fill="#fff" fillRule="evenodd">
                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path d="M17.278 2.613a1 1 0 0 1 1.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 0 1-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 0 1 2.981-1.087l.199.046l.737.197zM10.5 13.348a44 44 0 0 1-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 0 0 1.426-1.338a7 7 0 0 0 .488-.654l.142-.232a1 1 0 0 1 1.747.973c-.234.42-.527.814-.832 1.184a10 10 0 0 1-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 0 1 1.793.887c-.229.462-.496.909-.78 1.339a11 11 0 0 1-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904zm2.819-2.35a1.09 1.09 0 0 0-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038zM5.565 7.716l.064.14A3.26 3.26 0 0 0 6.866 9.22l.1.058a.068.068 0 0 1 0 .118l-.1.058A3.26 3.26 0 0 0 5.63 10.82l-.064.139a.071.071 0 0 1-.13 0l-.064-.14a3.26 3.26 0 0 0-1.237-1.364l-.1-.058a.068.068 0 0 1 0-.118l.1-.058A3.26 3.26 0 0 0 5.37 7.855l.064-.139a.071.071 0 0 1 .13 0Zm2.832-4.859c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 0 0 1.97 2.171l.157.093a.108.108 0 0 1 0 .189l-.158.092a5.2 5.2 0 0 0-1.97 2.172l-.1.222a.113.113 0 0 1-.207 0l-.102-.222a5.2 5.2 0 0 0-1.97-2.172l-.158-.092a.108.108 0 0 1 0-.189l.159-.093a5.2 5.2 0 0 0 1.97-2.171l.1-.222Z" />
                  </g>
                </svg>
              </button>
            </>
          )}
          {changeOptions === 3 && ( // Comments
            <>
              <button
                className={styles.miscButton}
                onClick={() => selectOption('text')}
                style={{
                  outlineColor: optionSelected.text
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70%"
                  height="70%"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <path
                      fill="var(--logo_yellow)"
                      fillOpacity="0.16"
                      d="M19 16h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3"
                    />
                    <path
                      stroke="var(--logo_yellow)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="10"
                      strokeWidth="1.5"
                      d="M8 8h8m-8 3h8m3 5h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3"
                    />
                  </g>
                </svg>
              </button>
              <button
                className={styles.miscButton}
                onClick={() => clearTexts()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="65%"
                  height="65%"
                  viewBox="0 0 24 24"
                >
                  <g fill="#fff" fillRule="evenodd">
                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path d="M17.278 2.613a1 1 0 0 1 1.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 0 1-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 0 1 2.981-1.087l.199.046l.737.197zM10.5 13.348a44 44 0 0 1-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 0 0 1.426-1.338a7 7 0 0 0 .488-.654l.142-.232a1 1 0 0 1 1.747.973c-.234.42-.527.814-.832 1.184a10 10 0 0 1-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 0 1 1.793.887c-.229.462-.496.909-.78 1.339a11 11 0 0 1-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904zm2.819-2.35a1.09 1.09 0 0 0-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038zM5.565 7.716l.064.14A3.26 3.26 0 0 0 6.866 9.22l.1.058a.068.068 0 0 1 0 .118l-.1.058A3.26 3.26 0 0 0 5.63 10.82l-.064.139a.071.071 0 0 1-.13 0l-.064-.14a3.26 3.26 0 0 0-1.237-1.364l-.1-.058a.068.068 0 0 1 0-.118l.1-.058A3.26 3.26 0 0 0 5.37 7.855l.064-.139a.071.071 0 0 1 .13 0Zm2.832-4.859c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 0 0 1.97 2.171l.157.093a.108.108 0 0 1 0 .189l-.158.092a5.2 5.2 0 0 0-1.97 2.172l-.1.222a.113.113 0 0 1-.207 0l-.102-.222a5.2 5.2 0 0 0-1.97-2.172l-.158-.092a.108.108 0 0 1 0-.189l.159-.093a5.2 5.2 0 0 0 1.97-2.171l.1-.222Z" />
                  </g>
                </svg>
              </button>
            </>
          )}
          {changeOptions === 4 && ( // Frontline
            <>
              <button
                className={styles.miscButton}
                onClick={() => selectOption('frontline')}
                style={{
                  outlineColor: optionSelected.frontline
                    ? 'var(--active_color)'
                    : 'transparent',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70%"
                  height="70%"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill={color}
                    d="m2 19.99l7.5-7.51l4 4l7.09-7.97L22 9.92l-8.5 9.56l-4-4l-6 6.01zm1.5-4.5l6-6.01l4 4L22 3.92l-1.41-1.41l-7.09 7.97l-4-4L2 13.99z"
                  ></path>
                </svg>
              </button>
              <button
                className={styles.miscButton}
                onClick={() => clearFrontlines()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="65%"
                  height="65%"
                  viewBox="0 0 24 24"
                >
                  <g fill="#fff" fillRule="evenodd">
                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path d="M17.278 2.613a1 1 0 0 1 1.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 0 1-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 0 1 2.981-1.087l.199.046l.737.197zM10.5 13.348a44 44 0 0 1-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 0 0 1.426-1.338a7 7 0 0 0 .488-.654l.142-.232a1 1 0 0 1 1.747.973c-.234.42-.527.814-.832 1.184a10 10 0 0 1-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 0 1 1.793.887c-.229.462-.496.909-.78 1.339a11 11 0 0 1-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904zm2.819-2.35a1.09 1.09 0 0 0-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038zM5.565 7.716l.064.14A3.26 3.26 0 0 0 6.866 9.22l.1.058a.068.068 0 0 1 0 .118l-.1.058A3.26 3.26 0 0 0 5.63 10.82l-.064.139a.071.071 0 0 1-.13 0l-.064-.14a3.26 3.26 0 0 0-1.237-1.364l-.1-.058a.068.068 0 0 1 0-.118l.1-.058A3.26 3.26 0 0 0 5.37 7.855l.064-.139a.071.071 0 0 1 .13 0Zm2.832-4.859c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 0 0 1.97 2.171l.157.093a.108.108 0 0 1 0 .189l-.158.092a5.2 5.2 0 0 0-1.97 2.172l-.1.222a.113.113 0 0 1-.207 0l-.102-.222a5.2 5.2 0 0 0-1.97-2.172l-.158-.092a.108.108 0 0 1 0-.189l.159-.093a5.2 5.2 0 0 0 1.97-2.171l.1-.222Z" />
                  </g>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Selection;
