import { useContext } from 'react';
import Link from 'next/link';
import { CategorizerContext } from 'components/context';
import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  const { easyToReverse, easyToCompare, dataCompleteness } = useContext(
    CategorizerContext
  );

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <a className={styles.logo}>Deca</a>
        </Link>
        <span className={styles.beta}>β</span>
      </div>
      {easyToReverse}
      {easyToCompare}
      {dataCompleteness}
    </header>
  );
}
