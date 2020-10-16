import Logo from 'components/logo/Logo';
import Head from 'next/head';
import { useState } from 'react';
import styles from 'styles/LoginPage.module.scss';

export default function LoginPage(): JSX.Element {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
              type="email"
              placeholder="Enter your email"
              onChange={(e) => handleChange(e)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => handleChange(e)}
              required
            />
            <button type="submit" className={styles.loginSubmit}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
