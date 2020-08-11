import { useContext } from 'react';
import Link from 'next/link';
import { CategorizerContext, DecisionCategory } from 'components/context';
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

  let title = null;

  switch (decisionCategory) {
    case DecisionCategory.Fast:
      title = 'Fast decision';
      break;
    case DecisionCategory.Early:
      title = 'Early decision';
      break;
    case DecisionCategory.Close:
      title = 'Close decision';
      break;
    case DecisionCategory.Deliberate:
      title = 'Deliberate decision';
      break;
    default:
  }

  if (title == null) {
    return null;
  }

  return (
    <div className={`${styles.categoryPill} ${styles[decisionCategory]}`}>
      <span>{title}</span>
    </div>
  );
}
