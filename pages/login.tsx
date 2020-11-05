import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { GetStaticProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import Logo from 'components/logo/Logo';
import Page404 from 'pages/404';
import styles from 'styles/LoginPage.module.scss';

interface Props {
  isDevelopment: boolean;
}

export const getServerSideProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      isDevelopment: process.env.NODE_ENV === 'development',
    },
  };
};

export default function LoginPage({
  isDevelopment,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { type, value } = event.target;
    if (type === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const signIn = async () => {
    try {
      await Auth.signIn(email, password);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log({ err });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn();
  };

  if (!isDevelopment) {
    return <Page404 />;
  }

  return (
    <>
      <div className={styles.loginPage}>
        <div className={styles.logo}>
          <Link href="/landing">
            <a>
              <Logo symbolWidth={6} />
            </a>
          </Link>
        </div>
        <div className={styles.loginFormWrapper}>
          <form onSubmit={(e) => handleSubmit(e)} className={styles.loginForm}>
            <input
              className={styles.input}
              type="email"
              placeholder="Enter your email"
              onChange={(e) => handleChange(e)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              onChange={(e) => handleChange(e)}
              required
            />
            <button type="submit" className={styles.loginSubmit}>
              Login
            </button>
            <p className={styles.loginMessage}>
              Don't have account? Please{' '}
              <span className={styles.toggleLink}>
                <Link href="/signup">
                  <a>sign up</a>
                </Link>
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
