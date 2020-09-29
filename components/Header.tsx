import Link from 'next/link';
import SidebarToggle from 'components/sidebar/SidebarToggle';
import { useContext } from 'react';
import { Context } from 'components/context';
import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <SidebarToggle />
        <div className={styles.logo}>
          <span className={styles.symbol}>D</span>
          <span className={styles.wordmark}>Deca</span>
        </div>
      </div>
      <div className={styles.right}>
        <Category />
      </div>
    </header>
  );
}

function Category(): JSX.Element | null {
  const { categorizer } = useContext(Context);

  if (categorizer.decisionCategory == null) {
    return null;
  }

  return (
    <div
      className={`${styles.categoryPill} ${
        styles[categorizer.decisionCategory]
      }`}
    >
      <span>{`${categorizer.decisionCategory}`}</span>
    </div>
  );
}
