const env = import.meta.env;

export const config = {
  journeyName: env.VITE_JOURNEY_NAME,
  appId: 'default_application',
  clientId: env.VITE_CLIENT_ID,
  idoServerUrl: env.VITE_IDO_SERVER_URL,
  drsServerUrl: env.VITE_DRS_SERVER_URL,
    webauthnServerUrl: env.VITE_WEBAUTHN_SERVER_URL,
  stateExpirationTimeInMilliseconds: Number(env.VITE_STATE_EXPIRATION_TIME_IN_MILLISECONDS),
};
