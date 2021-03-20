import {useEffect} from 'react'
import {signIn} from '../../model/api'
import {useAppState} from './use-app-state'

export const useAuth = () => {

    const {cEvent, event, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            const user = await signIn()
            if (user) {
                cUser.set(user)
                cEvent.change({id: '1'})
                event.change({id: '1'})

            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}