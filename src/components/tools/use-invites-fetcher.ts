import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {
    getTeam, personalInvitedDeclined, personalInvitedPending,
    personalInvites, teamInvitedDeclined, teamInvitedPending,
    teamInvites
} from '../../model/api'
import {useNotificationHandlers} from './notification-handlers'


export const useInvitesFetcher = () => {

    const {cUser, cEvent, invites} = useAppState()
    const nc = useNotificationHandlers()
    //incoming
    useEffect(() => {
        (async () => {
            if (cEvent.id !== '-1' && cUser.id !== '-1') {
                const [team, personal, userTeam] = await Promise.all([
                    teamInvites(cEvent.id, cUser.id),
                    personalInvites(cEvent.id, cUser.id),
                    getTeam(cEvent.id, cUser.id)
                ])

                cUser.change({team: userTeam, isTeamLead: userTeam.teamLead?.id === cUser.id})
                invites.i.set({team, personal})
                const t = team.map(u => getTeam(cEvent.id, u.id))
                const teams = await Promise.all(t)
                teams.forEach((t, i) => {
                    team[i].team = t
                })
                invites.i.set({team, personal})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, cEvent.id, nc.updates])

    //outgoing
    useEffect(() => {
        (async () => {
            if (cEvent.id !== '-1' && cUser.id !== '-1') {
                const [team, personal] = await Promise.all([
                    teamInvitedPending(cEvent.id, cUser.id),
                    personalInvitedPending(cEvent.id, cUser.id),
                ])

                invites.o.set({team, personal})

                const t = team.map(u => getTeam(cEvent.id, u.id))
                const teams = await Promise.all(t)
                teams.forEach((t, i) => {
                    team[i].team = t
                })
                invites.o.set({team, personal})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, cEvent.id, nc.updates])

    //history
    useEffect(() => {
        (async () => {
            if (cEvent.id !== '-1' && cUser.id !== '-1') {
                const [team, personal] = await Promise.all([
                    teamInvitedDeclined(cEvent.id, cUser.id),
                    personalInvitedDeclined(cEvent.id, cUser.id),
                ])

                invites.h.set({team, personal})

                const t = team.map(u => getTeam(cEvent.id, u.id))
                const teams = await Promise.all(t)
                teams.forEach((t, i) => {
                    team[i].team = t
                })
                invites.h.set({team, personal})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, cEvent.id, nc.updates])
    //both
    useEffect(() => {
        (async () => {
            //update team when invite is accepted or declined
            if (cUser.id !== '-1' && cEvent.id !== '-1') {
                const team = await getTeam(cEvent.id, cUser.id)
                if (team) {
                    cUser.change({team, isTeamLead: team.teamLead?.id === cUser.id})
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, invites.i.team.length, invites.i.personal.length,
        invites.o.team.length, invites.o.personal.length, nc.updates])
    return null
}