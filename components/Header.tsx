import Link from 'next/link';
import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <a className={styles.logo}>Deca</a>
        </Link>
      </div>
    </header>
  );
}
