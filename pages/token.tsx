import { useAuthRedirect } from 'aws-cognito-next';
import { GetStaticProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React from 'react';

import Page404 from 'pages/404';

interface Props {
  isDevelopment: boolean;
}

export const getServerSideProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      isDevelopment: process.env.NODE_ENV === 'development',
    },
  };
};

const extractFirst = (value: string | string[]) => {
  return Array.isArray(value) ? value[0] : value;
};

// When a user comes back from authenticating, the url looks like this:
//   /token#id_token=....
// At this point, there will be no cookies yet. If we would render any page on
// the server now, it would seem as-if the user is not authenticated yet.
//
// We therefore wait until Amplify has set its cookies. It does this
// automatically because the id_token hash is present. Then we redirect the
// user back to the main page. That page can now use SSR as the user will have
// the necessary cookies ready.
export default function TokenSetter({
  isDevelopment,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  if (!isDevelopment) {
    return <Page404 />;
  }

  const router = useRouter();
  useAuthRedirect(() => {
    // We are not using the router here, since the query object will be empty
    // during prerendering if the page is statically optimized.
    // So the router's location would return no search the first time.
    const redirectUriAfterSignIn =
      extractFirst(queryString.parse(window.location.search).to || '') || '/';

    router.replace(redirectUriAfterSignIn);
  });

  return <p>Loading…</p>;
}
