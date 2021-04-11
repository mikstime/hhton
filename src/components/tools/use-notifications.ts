import {useAppState} from './use-app-state'
import {useEffect, useRef} from 'react'
import {w3cwebsocket} from 'websocket'
import {PREFIX, WS_DOMAIN} from '../../config/network'
import {useNotificationHandlers} from './notification-handlers'

export const useNotifications = () => {
    const {cUser} = useAppState()
    const nc = useNotificationHandlers()
    const client = useRef<null | w3cwebsocket>(null)
    useEffect(() => {
        if (cUser.id !== '-1') {
            if (client.current) {
                client.current.close()
            }
            try {
                client.current = new w3cwebsocket(`${WS_DOMAIN}${PREFIX}/notification/channel/${cUser.id}`)
                client.current.onmessage = (m) => {
                    const json = JSON.parse(m.data as string)
                    switch (json.status) {
                        case 'NewTeamNotification':
                            nc.newTeamNotification(json)
                            break
                        case 'NewMembersNotification':
                            nc.newMembersNotification(json)
                            break
                        case 'NewInviteNotification':
                            nc.newInviteNotification(json)
                            break
                        case 'NewDenyNotification':
                            nc.newDenyNotification(json)
                            break
                        case 'NewTeamLeadNotification':
                            nc.newTeamLeadNotification(json)
                            break
                        case 'NewVoteNotification':
                            nc.newVoteNotification(json)
                            break
                        default:
                            console.log('Unknown json.status')
                            nc.default(json)
                    }
                }
                client.current.onerror = (e) => {
                }
            } catch (e) {
                console.log(e)
            }
        }
    }, [cUser.id, nc])
}