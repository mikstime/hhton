import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {getTeam, personalInvites, teamInvites} from '../../model/api'


export const useInvitesFetcher = () => {

    const {cUser, cEvent, invites} = useAppState()

    useEffect(() => {
        (async () => {
            if (cEvent.id !== '-1' && cUser.id !== '-1') {
                const [team, personal, userTeam] = await Promise.all([
                    teamInvites(cEvent.id, cUser.id),
                    personalInvites(cEvent.id, cUser.id),
                    getTeam(cEvent.id, cUser.id)
                ])

                cUser.change({team: userTeam})
                invites.set({team, personal})
                const t = team.map(u => getTeam(cEvent.id, u.id))
                const teams = await Promise.all(t)
                teams.forEach((t, i) => {
                    team[i].team = t
                })
                invites.set({team, personal})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, cEvent.id])

    useEffect(() => {
        (async () => {
            //update team when invite is accepted or declined
            if (cUser.id !== '-1' && cEvent.id !== '-1') {
                const team = await getTeam(cEvent.id, cUser.id)
                if (team) {
                    cUser.change({team})
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, invites.team.length, invites.personal.length])

    return null
}