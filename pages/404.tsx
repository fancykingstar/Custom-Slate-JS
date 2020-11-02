import Head from 'next/head';

import Footer from 'components/landing/Footer';
import Header from 'components/landing/Header';
import HeroNumbers from 'components/landing/HeroNumbers';
import fetcher from 'lib/fetcher';

import styles from './404.module.scss';

export default function Page404(): JSX.Element {
  return (
    <>
      <Head>
        <title>404 | vo for voice</title>
      </Head>

      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.desc}>nothing found. how about a vo call?</p>
          <HeroNumbers />
        </main>

        <Footer showSocialLinks={false} />
      </div>
    </>
  );
}
