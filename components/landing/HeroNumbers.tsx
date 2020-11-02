import { useState, useEffect } from 'react';

import HeroTextRotater from 'components/landing/HeroTextRotater';

import styles from './HeroNumbers.module.scss';

export default function HeroNumbers(): JSX.Element {
  const [numPart1Ready, setNumPart1Ready] = useState(false);
  const [numPart2Ready, setNumPart2Ready] = useState(false);
  const [numPart3Ready, setNumPart3Ready] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setNumPart1Ready(true);
    }, 500);
    const timeout2 = setTimeout(() => {
      setNumPart2Ready(true);
    }, 800);
    const timeout3 = setTimeout(() => {
      setNumPart3Ready(true);
    }, 1100);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <a className={styles.numberWrapper} href="tel:+1-123-456-7890">
      <span
        className={`${styles.numPart} ${styles.numPart1} ${
          numPart1Ready ? '' : styles.animatingIn
        }`}
      >
        123
      </span>
      <span
        className={`${styles.numPart} ${styles.numPart2} ${
          numPart2Ready ? '' : styles.animatingIn
        }`}
      >
        456
      </span>
      <span
        className={`${styles.numPart} ${styles.numPart3} ${
          numPart3Ready ? '' : styles.animatingIn
        }`}
      >
        7890
      </span>
    </a>
  );
}
