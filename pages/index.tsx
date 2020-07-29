import Head from 'next/head';
import Editor from '../components/Editor';
import styles from '../styles/Home.module.scss';

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
      </Head>

      <main className={styles.main}>
        <h1>Deca Prototype</h1>
        <Editor />
      </main>
    </>
  );
}
