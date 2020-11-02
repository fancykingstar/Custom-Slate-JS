import WrapArrow from 'components/landing/WrapArrow';
import DownArrow from 'components/landing/DownArrow';

import styles from './Explanation.module.scss';

export default function Explanation(): JSX.Element {
  return (
    <section className={styles.wrapper}>
      <ol className={styles.list}>
        <li>
          <div>
            <h2>Call vo</h2>
            <p>As you walk, munch, relax, doodle, scroll, game, garden</p>
          </div>
          <div className={styles.rightWrapArrow}>
            <WrapArrow />
          </div>
        </li>
        <li>
          <div>
            <h2>We group you</h2>
            <p>Randomly with 1–3 other ppl</p>
          </div>
          <div className={styles.leftWrapArrow}>
            <WrapArrow />
          </div>
        </li>
        <li>
          <div>
            <h2>Say hello!</h2>
            <p>Listen — talk — be nice</p>
          </div>
        </li>
      </ol>
      <div className={styles.downArrow}>
        <DownArrow />
      </div>
    </section>
  );
}
