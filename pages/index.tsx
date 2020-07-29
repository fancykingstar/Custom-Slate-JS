import Head from 'next/head';
import styles from '../styles/Home.module.scss';

export default function Home(): React.ReactNode {
  return (
    <div className={styles.container}>
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
        <h1 className={styles.title}>
          Welcome to <a href="https://deca.works/">Deca</a>!
        </h1>
        <p className={styles.description}>
          A Deca doc gives you decision-making superpowers.
        </p>
      </main>
    </div>
  );
}
