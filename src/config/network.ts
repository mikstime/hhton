const local = false

export const WS_DOMAIN = local ? 'ws://localhost:8080' : 'wss://team-up.online'
export const HOST_DOMAIN = local ? 'http://localhost:8080' : 'https://team-up.online'
export const PREFIX = local ? '' : '/api'