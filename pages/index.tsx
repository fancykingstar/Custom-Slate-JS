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

  return (
    <>
      <Head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
          window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
          heap.load("2673011679");
        `,
          }}
        />

        <title>Deca</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Monoton&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@500&display=swap"
          rel="stylesheet"
        />
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
          <HeaderContext.Provider value={headerContextValue}>
            <Header />
            <div className={styles.wrapper}>
              <Sidebar />
              <main className={styles.main}>
                {activeDoc != null && currentDoc != null ? (
                  <DecaEditor key={activeDoc} doc={currentDoc} />
                ) : null}
              </main>
            </div>
          </HeaderContext.Provider>
        </Store.Provider>
      </Context.Provider>
    </>
  );
}
