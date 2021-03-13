import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {
    getTeam,
    personalInvites,
    teamInvites
} from '../../model/api'


export const useInvitesFetcher = () => {

    const {cUser, cEvent, invites} = useAppState()

    useEffect(() => {
        (async () => {
            const [team, personal] = await Promise.all([teamInvites(cEvent.id, cUser.id), personalInvites(cEvent.id, cUser.id)])
            invites.set({team, personal})
            const t = team.map(u => getTeam(cEvent.id, u.id))
            const teams = await Promise.all(t)
            teams.forEach((t, i) => {team[i].team = t})
            invites.set({team, personal})
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, cEvent.id])

    return null
}