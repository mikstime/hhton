import {useAppState} from './use-app-state'
import {useEffect, useRef} from 'react'
import {w3cwebsocket} from 'websocket'
import {PREFIX, WS_DOMAIN} from '../../config/network'
import {useSnackbar} from 'notistack'
import {notificationHandlers} from "./notification-handlers";

export const useNotifications = () => {
    const {cUser} = useAppState()

    const client = useRef<null | w3cwebsocket>(null)
    const {enqueueSnackbar} = useSnackbar()
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
                            notificationHandlers().newTeamNotification()
                            break;
                        case 'NewMembersNotification':
                            notificationHandlers().newMembersNotification()
                            break;
                        case 'NewInviteNotification':
                            notificationHandlers().newInviteNotification()
                            break;
                        case 'NewDenyNotification':
                            notificationHandlers().newDenyNotification()
                            break;
                        default:
                            console.log("Unknown json.status")
                            notificationHandlers().default()
                    }
                    enqueueSnackbar(json.message)
                }
                client.current.onopen = () => {
                    // if (client.current) {
                        // console.log('sending')
                        // client.current.send(JSON.stringify({
                        //     "ID":17,"type":"notification","status":"good",
                        //     "message":"Ping","userID":17,
                        //     "created":"2021-03-23T14:45:19.661708689+03:00"}))
                    // }
                }
                client.current.onerror = (e) => {}
            } catch (e) {
                console.log(e)
            }
        }
    }, [cUser.id])
}