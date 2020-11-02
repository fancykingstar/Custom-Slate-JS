import HeroTextRotater from 'components/landing/HeroTextRotater';
import HeroNumbers from 'components/landing/HeroNumbers';

import styles from './Hero.module.scss';

export default function Hero(): JSX.Element {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Make hard
        <br />
        decisions <HeroTextRotater />
      </h1>
    </section>
  );
}
