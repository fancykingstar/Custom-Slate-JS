import styles from './EndArrow.module.scss';

export default function EndArrow(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.arrow} />
    </div>
  );
}
