import { useContext } from 'react';
import Link from 'next/link';
import { CategorizerContext } from 'components/context';
import CompleteButton from 'components/CompleteButton';
import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link href="/">
            <a className={styles.logo}>Deca</a>
          </Link>
          <span className={styles.beta}>β</span>
        </div>
        <div className={styles.right}>
          <Category />
          <CompleteButton />
        </div>
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
