import styles from './Logo.module.scss';

export default function Logo(): JSX.Element {
  return (
    <div className={styles.logo}>
      <span className={styles.symbol}>D</span>
      <span className={styles.wordmark}>Deca</span>
    </div>
  );
}
