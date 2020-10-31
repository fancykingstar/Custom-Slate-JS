import styles from './Header.module.scss';
import HeaderDecisionCategory from './HeaderCategory';
import HeaderViewToggle from './HeaderViewToggle';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <HeaderDecisionCategory />
      <div className={styles.spacer} />
      <HeaderViewToggle />
    </header>
  );
}
