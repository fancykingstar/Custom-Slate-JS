import { useState } from 'react';
import Head from 'next/head';
import DecaEditor from 'components/DecaEditor';
import styles from 'styles/Home.module.scss';
import Header from 'components/Header';
import {
  CategorizerContext,
  CategorizerDataCompleteness,
  CategorizerEasyToCompare,
  CategorizerEasyToReverse,
} from 'components/context';

export default function Home(): JSX.Element {
  const [
    easyToReverse,
    setEasyToReverse,
  ] = useState<CategorizerEasyToReverse | null>(null);
  const [
    easyToCompare,
    setEasyToCompare,
  ] = useState<CategorizerEasyToCompare | null>(null);
  const [
    dataCompleteness,
    setDataCompleteness,
  ] = useState<CategorizerDataCompleteness | null>(null);

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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <CategorizerContext.Provider
        value={{
          easyToReverse,
          easyToCompare,
          dataCompleteness,
          setEasyToReverse,
          setEasyToCompare,
          setDataCompleteness,
        }}
      >
        <Header />
        <main className={styles.main}>
          <DecaEditor />
        </main>
      </CategorizerContext.Provider>
    </>
  );
}
