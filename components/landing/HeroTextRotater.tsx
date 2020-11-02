import { useState, useEffect, useRef } from 'react';

import useInterval from 'lib/useInterval';

import styles from './HeroTextRotater.module.scss';

const phrases = [
  'fast',
  'meeting-free',
  'together',
  'remotely',
  'in writing',
  'rationally',
];

enum TextState {
  uninitialized,
  hidden,
  visible,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shuffle(array: Array<any>): Array<any> {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter -= 1;

    // And swap the last element with it
    const temp = array[counter];
    // eslint-disable-next-line no-param-reassign
    array[counter] = array[index];
    // eslint-disable-next-line no-param-reassign
    array[index] = temp;
  }

  return array;
}

export default function HeroTextRotater(): JSX.Element {
  const [textState, setTextState] = useState(TextState.uninitialized);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setTextState(TextState.visible);
    }, 1600);
  }, []);

  useInterval(() => {
    let newIndex = wordIndex + 1;
    if (newIndex >= phrases.length) {
      newIndex = 0;
    }

    setTextState(TextState.uninitialized);

    // Crazy hacky timeout chain
    setTimeout(() => {
      setTextState(TextState.hidden);
      setTimeout(() => {
        setWordIndex(newIndex);
        setTimeout(() => {
          setTextState(TextState.visible);
        }, 50);
      }, 200);
    }, 200);
  }, 6000);

  return (
    <span className={styles.wrapper}>
      <span
        className={`${styles.text} ${
          textState === TextState.visible ? styles.visible : ''
        } ${textState === TextState.hidden ? styles.hidden : ''}`}
        data-text={phrases[wordIndex]}
      >
        {phrases[wordIndex]}.
      </span>
    </span>
  );
}
