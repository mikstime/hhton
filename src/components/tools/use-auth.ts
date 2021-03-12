import {useEffect} from 'react'
import {getTeam, signIn} from '../../model/api'
import {useAppState} from './use-app-state'

export const useAuth = () => {

    const {event, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            const user = await signIn()
            if (user) {
                cUser.set(user)
                const team = await getTeam(event.id, user.id)
                if (team) {
                    cUser.change({team})
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}