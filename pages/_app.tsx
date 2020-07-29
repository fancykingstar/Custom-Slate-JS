import type { AppProps } from 'next/app';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return <Component {...pageProps} />;
}

export default MyApp;
