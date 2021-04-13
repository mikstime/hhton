import {useAppState} from './use-app-state'
import {useEffect, useRef} from 'react'
import {w3cwebsocket} from 'websocket'
import {PREFIX, WS_DOMAIN} from '../../config/network'
import {Message, useNotificationHandlers} from './notification-handlers'


export const useNotifications = () => {
    const {cUser} = useAppState()
    const nc = useNotificationHandlers()
    const client = useRef<null | w3cwebsocket>(null)
    const shouldReconnect = useRef(true)
    useEffect(() => {
        if (cUser.id !== '-1' && !cUser.isNullUser) {
            if (client.current) {
                shouldReconnect.current = false
                client.current.close()
                setTimeout(() => {
                    shouldReconnect.current = true
                }, 1000)
            }
            client.current = new w3cwebsocket(
                `${WS_DOMAIN}${PREFIX}/notification/channel/${cUser.id}`
            )
        }
    }, [cUser.id, cUser.isNullUser])
    useEffect(() => {
        if (!client.current) return

        client.current.onmessage = (m) => {
            const json = JSON.parse(m.data as string) as Message
            nc[json.status] ? nc[json.status](json) : nc.default(json)
        }
        client.current.onerror = () => {
        }
        client.current.onclose = () => {
            if(shouldReconnect.current) {
                client.current = new w3cwebsocket(
                    `${WS_DOMAIN}${PREFIX}/notification/channel/${cUser.id}`
                )
            }
        }
    }, [client.current, nc, shouldReconnect.current])
}