import SidebarToggle from 'components/sidebar/SidebarToggle';
import styles from './Header.module.scss';
import Logo from '../logo/Logo';
import HeaderDecisionCategory from './HeaderCategory';
import HeaderViewToggle from './HeaderViewToggle';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <SidebarToggle />
        <Logo symbolWidth={3.2} />
      </div>
      <div className={styles.right}>
        <HeaderDecisionCategory />
        <HeaderViewToggle />
      </div>
    </header>
  );
}
