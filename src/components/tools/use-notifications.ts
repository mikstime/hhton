import {useAppState} from './use-app-state'
import {useEffect, useRef} from 'react'
import { w3cwebsocket} from 'websocket'
import {PREFIX, WS_DOMAIN} from '../../config/network'
import {useSnackbar} from 'notistack'

export const useNotifications = () => {
    const {cUser} = useAppState()

    const client = useRef<null|w3cwebsocket>(null)
    const {enqueueSnackbar} = useSnackbar()
    useEffect(() => {
        if(cUser.id !== '-1') {
            if(client.current) client.current.close()

            client.current = new w3cwebsocket(`${WS_DOMAIN}${PREFIX}/user/${cUser.id}/connect`)
            client.current.onopen = () => {
                console.log('connection established')
            }
            client.current.onmessage = (m) => {
                enqueueSnackbar(m)
            }
        }
    }, [cUser.id])
}