import { useState } from 'react';
import Head from 'next/head';
import { Auth } from 'aws-amplify';
import Logo from 'components/logo/Logo';
import styles from 'styles/LoginPage.module.scss';

export default function SignupPage(): JSX.Element {
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

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Monoton&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.loginPage}>
        <div className={styles.loginFormWrapper}>
          <Logo />
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
          </form>
        </div>
      </div>
    </>
  );
}
