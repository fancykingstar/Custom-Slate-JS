import Link from 'next/link';
import SidebarToggle from 'components/sidebar/SidebarToggle';
import { useContext } from 'react';
import { CategorizerContext } from 'components/context';
import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <SidebarToggle />
        <Link href="/">
          <a className={styles.logo}>Deca</a>
        </Link>
      </div>
      <div className={styles.right}>
        <Category />
      </div>
    </header>
  );
}

function Category(): JSX.Element | null {
  const { decisionCategory } = useContext(CategorizerContext);

  if (decisionCategory == null) {
    return null;
  }

  return (
    <div className={`${styles.categoryPill} ${styles[decisionCategory]}`}>
      <span>{`${decisionCategory} decision`}</span>
    </div>
  );
}
