import Link from 'next/link';

import styles from './SignUp.module.scss';

export default function Signup(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <Link href="/signup">
        <a>Sign up</a>
      </Link>
    </div>
  );
}
