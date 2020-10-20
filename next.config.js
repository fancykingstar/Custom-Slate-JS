module.exports = {
  env: {
    IDP_DOMAIN: "deca.auth.us-east-2.amazoncognito.com",
    USER_POOL_ID: "us-east-2_AxC6EXtuX",
    USER_POOL_CLIENT_ID: "3158bgrnigqd95gi4llqvsvpc2",
    REDIRECT_SIGN_IN: "http://localhost:3000/token",
    REDIRECT_SIGN_OUT: "http://localhost:3000/",
    AUTH_COOKIE_DOMAIN: "localhost",
  },
  experimental: {
    granularChunks: true,
  },
  reactStrictMode: true,
};
