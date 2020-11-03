import Head from 'next/head';

import Footer from 'components/landing/Footer';
import Header from 'components/landing/Header';
import fetcher from 'lib/fetcher';

import styles from './404.module.scss';

export default function Page404(): JSX.Element {
  return (
    <>
      <Head>
        <title>404 | 10x decision making</title>
      </Head>

      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.desc}>Nothing found.</p>
        </main>

        <Footer showSocialLinks />
      </div>
    </>
  );
}
