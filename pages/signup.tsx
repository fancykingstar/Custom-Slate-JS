import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { GetStaticProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import { Stage } from 'components/stage';
import Logo from 'components/logo/Logo';
import Page404 from 'pages/404';
import styles from 'styles/LoginPage.module.scss';

interface Props {
  isProd: boolean;
}

export const getServerSideProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      isProd: process.env.STAGE === Stage.Prod,
    },
  };
};

export default function SignupPage({
  isProd,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const signUp = async () => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log({ err });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signUp();
  };

  if (isProd) {
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
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.loginSubmit}>
              Sign Up
            </button>
            <p className={styles.loginMessage}>
              Already have account? Please{' '}
              <span className={styles.toggleLink}>
                <Link href="/login">
                  <a>log in</a>
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
