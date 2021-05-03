import {useAppState} from './use-app-state'
import {useEffect, useRef} from 'react'
import {w3cwebsocket} from 'websocket'
import {PREFIX, WS_DOMAIN} from '../../config/network'
import {Message, useNotificationHandlers} from './notification-handlers'


export const useNotifications = () => {
    const {cUser} = useAppState()
    const nc = useNotificationHandlers()
    const client = useRef<null | w3cwebsocket>(null)
    const shouldReconnect = useRef(false)

    useEffect(() => {
        if (cUser.id !== '-1' && !cUser.isNullUser) {
            shouldReconnect.current = true
        }
    }, [cUser.id, cUser.isNullUser])

    useEffect(() => {
        const id = setInterval(() => {
            if (shouldReconnect.current) {
                if (client.current) {
                    client.current.close()
                }
                client.current = new w3cwebsocket(
                    `${WS_DOMAIN}${PREFIX}/notification/channel/${cUser.id}`
                )
                client.current.onopen = () => {
                    shouldReconnect.current = false
                }
                client.current.onmessage = (m) => {
                    const json = JSON.parse(m.data as string) as Message
                    nc[json.status] ? nc[json.status](json) : nc.default(json)
                }
                client.current.onerror = () => {
                    shouldReconnect.current = true
                }
                client.current.onclose = () => {
                    shouldReconnect.current = true
                }
            }
        }, 1000)

        return () => {
            clearInterval(id)
        }
    }, [cUser.id])
}