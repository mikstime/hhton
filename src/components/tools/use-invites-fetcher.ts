import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {getTeam, personalInvites, teamInvites} from '../../model/api'


export const useInvitesFetcher = () => {

    const {cUser, event, invites} = useAppState()

    useEffect(() => {
        (async () => {
            if (event.id !== '-1' && cUser.id !== '-1') {
                const [team, personal, userTeam] = await Promise.all([
                    teamInvites(event.id, cUser.id),
                    personalInvites(event.id, cUser.id),
                    getTeam(event.id, cUser.id)
                ])

                cUser.change({team: userTeam})
                invites.set({team, personal})
                const t = team.map(u => getTeam(event.id, u.id))
                const teams = await Promise.all(t)
                teams.forEach((t, i) => {
                    team[i].team = t
                })
                invites.set({team, personal})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, event.id])

    useEffect(() => {
        (async () => {
            //update team when invite is accepted or declined
            if (cUser.id !== '-1' && event.id !== '-1') {
                const team = await getTeam(event.id, cUser.id)
                if (team) {
                    cUser.change({team})
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, invites.team.length, invites.personal.length])

    return null
}