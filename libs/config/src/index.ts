export const CONFIG = {
  JWT: {
    SECRET: {
      ACCESS:
        process.env.ACCESS_TOKEN_JWT_SECRET || 'access_token_not_configured',
      REFRESH:
        process.env.REFRESH_TOKEN_JWT_SECRET || 'refresh_token_not_configured',
    },
    TIMEOUT: {
      ACCESS: '365d', // TODO : update time
      REFRESH: '365d',
    },
  },
};
