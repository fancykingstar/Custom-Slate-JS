import Head from 'next/head';
import DecaEditor from '../components/DecaEditor';
import styles from '../styles/Home.module.scss';
import Header from '../components/Header';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Deca</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header />
      <main className={styles.main}>
        <DecaEditor />
      </main>
    </>
  );
}
