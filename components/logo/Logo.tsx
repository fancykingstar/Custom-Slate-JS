import styles from './Logo.module.scss';

export default function Logo(): JSX.Element {
  return (
    <div className={styles.logo}>
      <img
        className={styles.symbol}
        src="/img/logo/symbol.svg"
        alt="Deca symbol"
      />
      <img
        className={styles.wordmark}
        src="/img/logo/wordmark.svg"
        alt="Deca wordmark"
      />
    </div>
  );
}
