import Head from "next/head";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Deca</title>
        <link rel="icon" href="/favicon.ico" />
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
