import {useEffect} from 'react'
import {getTeam, isParticipating, signIn} from '../../model/api'
import {useAppState} from './use-app-state'

export const useAuth = () => {

    const {event, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            const user = await signIn()
            if (user) {
                cUser.set(user)
                event.change({id: '1'})
                const team = await getTeam('1', user.id)
                if (team) {
                    cUser.change({team})
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}