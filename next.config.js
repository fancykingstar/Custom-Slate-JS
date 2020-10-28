module.exports = {
  env: {
    IDP_DOMAIN: "deca-dev.auth.us-east-2.amazoncognito.com",
    USER_POOL_ID: "us-east-2_eYJTk8al1",
    USER_POOL_CLIENT_ID: "572n5ndpf3s4660lq4cpg3ahoi",
    REDIRECT_SIGN_IN: "http://localhost:3000/token",
    REDIRECT_SIGN_OUT: "http://localhost:3000/",
    AUTH_COOKIE_DOMAIN: "localhost",
  },
  experimental: {
    granularChunks: true,
  },
  reactStrictMode: true,
};
