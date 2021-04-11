const env = process.env.REACT_APP_ENV || 'dev'

// @ts-ignore
export const WS_DOMAIN = env === 'dev' ? 'wss://dev.team-up.online' : env === 'prod' ? 'wss://team-up.online' : 'ws://localhost:8080'
// @ts-ignore
export const HOST_DOMAIN = env === 'dev' ? 'https://dev.team-up.online' : env === 'prod' ? 'https://team-up.online' : 'http://localhost:8080'
// @ts-ignore
export const PREFIX = env === 'dev' ? '/api' : env === 'prod' ? '/api' : ''