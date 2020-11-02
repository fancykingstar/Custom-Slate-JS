import Link from 'next/link';

import Logo from 'components/landing/Logo';
import SocialLinks from 'components/landing/SocialLinks';

import styles from './Header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <Logo symbolWidth={4.2} />
        </Link>
        <div className={styles.social}>
          <SocialLinks />
        </div>
      </div>
    </header>
  );
}
