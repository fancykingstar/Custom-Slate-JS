import Link from 'next/link';

import Logo from 'components/landing/Logo';
import SignUp from 'components/landing/SignUp';

import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <Logo symbolWidth={4.2} />
        </Link>
        <div className={styles.signUp}>
          <SignUp />
        </div>
      </div>
    </header>
  );
}
