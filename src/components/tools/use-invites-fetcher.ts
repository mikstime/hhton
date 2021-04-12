import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {
    getTeam, getVotes, personalInvitedDeclined, personalInvitedPending,
    personalInvites, teamInvitedDeclined, teamInvitedPending,
    teamInvites
} from '../../model/api'
import {useNotificationHandlers} from './notification-handlers'


export const useInvitesFetcher = () => {

    const {user, cUser, cEvent, invites} = useAppState()
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
                let votes = {}
                if(userTeam.id) {
                    votes = await getVotes(userTeam.id, cUser.id)
                }
                cUser.change({
                    team: {
                        ...userTeam,
                        ...votes
                    },
                    isTeamLead: userTeam.teamLead?.id === cUser.id
                })
                if(user.id === cUser.id) {
                    user.change({
                        team: {
                            ...userTeam,
                            ...votes
                        },
                        isTeamLead: userTeam.teamLead?.id === cUser.id
                    })
                }
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
                    personalInvitedPending(cEvent.id, cUser.id)
                ])

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
                    personalInvitedDeclined(cEvent.id, cUser.id)
                ])

                invites.h.set({team, personal})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cUser.id, cEvent.id, nc.updates])
    return null
}