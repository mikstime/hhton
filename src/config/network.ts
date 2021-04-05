const env = process.env.REACT_APP_ENV

// @ts-ignore
export const WS_DOMAIN = env === 'local' ? 'ws://localhost:8080' : env === 'prod' ? 'wss://team-up.online' : 'wss://dev.team-up.online'
// @ts-ignore
export const HOST_DOMAIN = env === 'local' ? 'http://localhost:8080' : env === 'prod' ? 'https://team-up.online' : 'https://dev.team-up.online'
// @ts-ignore
export const PREFIX = env === 'local' ? '' : '/api'