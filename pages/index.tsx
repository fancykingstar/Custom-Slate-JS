import { useState, useReducer, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';

import DecaEditor from 'components/DecaEditor';
import { Env, EnvProps } from 'components/env';
import { Context, DecisionCategory } from 'components/context';
import Sidebar from 'components/sidebar/Sidebar';
import Header from 'components/header/Header';
import { reducer, Store, Action } from 'store/store';
import styles from 'styles/Home.module.scss';
import { HeaderContext } from 'components/header/HeaderContext';
import { PaneContext } from 'components/panes/PaneContext';
import NavPane from 'components/panes/navpane/NavPane';
import ReviewPane from 'components/panes/reviewpane/ReviewPane';
import GlobalPane from 'components/panes/globalpane/GlobalPane';

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<EnvProps> {
  const openaiKey: string = process.env.OPENAI_KEY
    ? process.env.OPENAI_KEY
    : (process.env.NEXT_PUBLIC_OPENAI_KEY as string);
  const openaiSecretKey: string = process.env.OPENAI_SECRET_KEY
    ? process.env.OPENAI_SECRET_KEY
    : (process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY as string);

  return {
    props: {
      openaiKey,
      openaiSecretKey,
    },
  };
}

export default function Home(env: Env): JSX.Element {
  const [
    decisionCategory,
    setDecisionCategory,
  ] = useState<DecisionCategory | null>(null);
  const [viewMode, setViewMode] = useState('private');
  const [viewableElements, setViewableElements] = useState([] as Array<string>);
  const [expandedPanes, setExpandedPanes] = useState([] as Array<string>);

  const [state, dispatch] = useReducer(reducer, {
    sidebarVisible: false,
    activeDocId: null,
    docs: [],
    showStarBar: false,
  });
  // Memoize reducer to avoid unnecessary re-renders
  const value = useMemo(() => ({ state, dispatch }), [state]);

  // If we have no stored docs, create a new one
  useEffect(() => {
    // Load state from localStorage
    const stateData = window.localStorage.getItem('state');
    const parsedState = stateData != null ? JSON.parse(stateData) : null;

    if (parsedState == null) {
      // Create new doc if there is not persisted localStorage state
      dispatch({ type: Action.createNewDoc });
    } else {
      dispatch({ type: Action.initState, state: parsedState });
    }
  }, []);

  const { activeDocId: activeDoc, docs } = state;
  const currentDoc = docs.find((doc) => doc.id === activeDoc) ?? null;
  const headerContextValue = {
    setViewMode,
    setViewableElements,
    viewMode,
    viewableElements,
  };

  const paneContextValue = {
    expandedPanes,
    setExpandedPanes,
  };
  const mainContentWidth = `calc(100% - ${expandedPanes.length * 20}rem)`;

  return (
    <>
      <Head>
        <title>Deca</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Context.Provider
        value={{
          categorizer: {
            decisionCategory,
            setDecisionCategory,
          },
          env,
        }}
      >
        <Store.Provider value={value}>
          <PaneContext.Provider value={paneContextValue}>
            <HeaderContext.Provider value={headerContextValue}>
              <div className={styles.paneContainer}>
                <GlobalPane />
                <NavPane />
                <div
                  className={styles.mainContent}
                  style={{ width: mainContentWidth }}
                >
                  <Header />
                  <main className={styles.main}>
                    {activeDoc != null && currentDoc != null ? (
                      <DecaEditor key={activeDoc} doc={currentDoc} />
                    ) : null}
                  </main>
                </div>
                {/* to be added in separate PR */}
                {/* <ReviewPane /> */}
              </div>
            </HeaderContext.Provider>
          </PaneContext.Provider>
        </Store.Provider>
      </Context.Provider>
    </>
  );
}
