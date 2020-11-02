import Head from 'next/head';

import Header from 'components/landing/Header';
import Footer from 'components/landing/Footer';
import Hero from 'components/landing/Hero';
import Explanation from 'components/landing/Explanation';
import FAQ from 'components/landing/FAQ';
import EndArrow from 'components/landing/EndArrow';
import ContactBox from 'components/landing/ContactBox';
import config from 'components/landing/config';
import fetcher from 'lib/fetcher';

import styles from './landing.module.scss';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Deca: 10x decision making</title>
        <meta name="description" content={config.ogDesc} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={config.ogDesc} />
        <meta name="twitter:title" content={config.ogTitle} />
        <meta name="twitter:site" content={config.twitterHandle} />
        <meta name="twitter:image" content={config.ogCardUrl} />
        <meta name="twitter:image:alt" content={config.ogCardAltText} />
        <meta name="twitter:creator" content={config.twitterHandle} />

        {/* Facebook OG */}
        <meta property="og:url" content={config.fullURL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.ogTitle} />
        <meta property="og:image" content={config.ogCardUrl} />
        <meta property="og:image:alt" content={config.ogCardAltText} />
        <meta property="og:description" content={config.ogDesc} />
        <meta property="og:site_name" content={config.ogTitle} />
        <meta property="og:locale" content="en_US" />
      </Head>

      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          <Hero />
          {/*
          <Explanation />
          <FAQ />
          <EndArrow />
          <ContactBox />
          */}
        </main>

        <Footer showSocialLinks />
      </div>
    </>
  );
}
