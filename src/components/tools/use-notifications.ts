import {useAppState} from './use-app-state'
import {useEffect, useRef} from 'react'
import {w3cwebsocket} from 'websocket'
import {PREFIX, WS_DOMAIN} from '../../config/network'
import {useSnackbar} from 'notistack'

export const useNotifications = () => {
    const {cUser} = useAppState()

    const client = useRef<null | w3cwebsocket>(null)
    const {enqueueSnackbar} = useSnackbar()
    useEffect(() => {
        if (cUser.id !== '-1') {
            if (client.current) {
                client.current.close()
                console.log('close')
            }
            try {
                client.current = new w3cwebsocket(`${WS_DOMAIN}${PREFIX}/notification/channel/${cUser.id}`)
                client.current.onmessage = (m) => {
                    console.log(m)
                    enqueueSnackbar(m.data)
                }
                client.current.onopen = () => {
                    console.log('connection established')
                    if (client.current) {
                        // console.log('sending')
                        client.current.send(JSON.stringify({
                            "ID":1,"type":"notification","status":"good",
                            "message":"Ping","userID":1,
                            "created":"2021-03-23T14:45:19.661708689+03:00"}))
                    }
                }
                client.current.onerror = (e) => {
                }
            } catch (e) {
                console.log(e)
            }
        }
    }, [cUser.id])
}