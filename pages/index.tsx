import { useState, useReducer, useMemo, useEffect } from 'react';
import Head from 'next/head';
import DecaEditor from 'components/DecaEditor';
import styles from 'styles/Home.module.scss';
import { CategorizerContext, DecisionCategory } from 'components/context';
import { reducer, Store, Action } from 'store/store';
import Sidebar from 'components/sidebar/Sidebar';
import Header from 'components/Header';

export default function Home(): JSX.Element {
  const [
    decisionCategory,
    setDecisionCategory,
  ] = useState<DecisionCategory | null>(null);

  const [state, dispatch] = useReducer(reducer, {
    sidebarVisible: false,
    activeDocId: null,
    docs: [],
  });
  // Memoize reducer to avoid unnecessary re-renders
  const value = useMemo(() => ({ state, dispatch }), [state]);

  // If we have no stored docs, create a new one
  useEffect(() => {
    // // Load state from localStorage
    // const stateData = window.localStorage.getItem('state');
    // const parsedState = stateData != null ? JSON.parse(stateData) : null;

    // if (parsedState == null) {
    // Create new doc if there is not persisted localStorage state
    dispatch({ type: Action.createNewDoc });
    // } else {
    //   dispatch({ type: Action.initState, state: parsedState });
    // }
  }, []);

  const { activeDocId: activeDoc, docs } = state;
  const currentDoc = docs.find((doc) => doc.id === activeDoc) ?? null;

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

      <CategorizerContext.Provider
        value={{
          decisionCategory,
          setDecisionCategory,
        }}
      >
        <Store.Provider value={value}>
          <Header />
          <div className={styles.wrapper}>
            <Sidebar />
            <main className={styles.main}>
              {activeDoc != null && currentDoc != null ? (
                <DecaEditor key={activeDoc} doc={currentDoc} />
              ) : null}
            </main>
          </div>
        </Store.Provider>
      </CategorizerContext.Provider>
    </>
  );
}
