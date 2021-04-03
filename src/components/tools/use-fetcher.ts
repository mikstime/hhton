import {useEffect, useRef} from 'react'
import {useAppState} from './use-app-state'
import {
    fetchEvent,
    fetchUser,
    getTeam,
    isInvited,
    isParticipating
} from '../../model/api'
import {NULL_HACKATHON, NULL_USER} from './use-app-state'
import {app} from '../../../server/src/server'


export const useFetcher = () => {

    const isFetchingUserId = useRef('-1')
    const isFetchingCuserId = useRef('-1')
    const isFetchingEventId = useRef('-1')
    const isFetchingCeventId = useRef('-1')

    const appState = useAppState()

    useEffect(() => {
        (async () => {
            if (appState.user.id !== isFetchingUserId.current && appState.user.id !== '-1') {
                isFetchingUserId.current = appState.user.id
                appState.user.set(NULL_USER)

                const user = await fetchUser(appState.user.id)

                if (user) {
                    if (isFetchingUserId.current === appState.user.id) {
                        appState.user.set(user)
                        const team = appState.cEvent.id !== '-1' ?
                            await getTeam(appState.cEvent.id, user.id) : user.team

                        if (isFetchingUserId.current === appState.user.id) {
                            appState.user.change({team})
                        }
                    }
                } else {
                    if (isFetchingUserId.current === appState.user.id) {
                        appState.user.set({
                            ...NULL_USER,
                            id: appState.user.id,
                            notFound: true
                        })
                    }
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.user.id])

    useEffect(() => {
        (async () => {
            if (appState.cUser.id !== '-1' && appState.event.id !== '-1') {
                const participating = await isParticipating(appState.event.id, appState.cUser.id)
                appState.event.change({isParticipating: !!participating})
            }
            if (appState.cUser.id !== '-1' && appState.cEvent.id !== '-1') {
                const participating = await isParticipating(appState.cEvent.id, appState.cUser.id)
                appState.cEvent.change({isParticipating: !!participating})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.cUser.id, appState.event.id, appState.cEvent.id])

    useEffect(() => {
        (async () => {
            if (appState.cUser.id !== isFetchingCuserId.current && appState.cUser.id !== '-1') {
                isFetchingCuserId.current = appState.cUser.id
                appState.cUser.set(NULL_USER)

                const user = await fetchUser(appState.cUser.id)

                if (user) {
                    if (isFetchingCuserId.current === appState.cUser.id) {
                        appState.cUser.set(user)
                        const team = appState.cEvent.id !== '-1' ?
                            await getTeam(appState.cEvent.id, user.id) : user.team

                        if (isFetchingCuserId.current === appState.cUser.id) {
                            appState.cUser.change({team})
                        }
                    }
                } else {
                    if (isFetchingCuserId.current === appState.cUser.id) {
                        appState.cUser.set({
                            ...NULL_USER,
                            id: appState.cUser.id,
                            notFound: true
                        })
                    }
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.cUser.id])

    useEffect(() => {
        (async () => {
            if (appState.user.id !== '-1' && appState.cUser.id !== '-1' && appState.cEvent.id !== '-1') {
                const invited = await isInvited(appState.cEvent.id, appState.cUser.id, appState.user.id)
                appState.user.change({isInvited: !!invited})
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.cUser.id, appState.user.id, appState.cEvent.id])

    useEffect(() => {
        (async () => {
            if (appState.event.id !== isFetchingEventId.current && appState.event.id !== '-1') {
                isFetchingEventId.current = appState.event.id
                appState.event.set(NULL_HACKATHON)
                const event = await fetchEvent(appState.event.id)
                if (event) {
                    if (isFetchingEventId.current === appState.event.id) {
                        appState.event.set(event)
                        appState.cEvent.set(event)
                    }
                } else {
                    if (isFetchingEventId.current === appState.event.id) {
                        appState.event.set({
                            ...NULL_HACKATHON,
                            id: appState.event.id,
                            notFound: true
                        })
                        appState.cEvent.set({
                            ...NULL_HACKATHON,
                            id: appState.event.id,
                            notFound: true
                        })
                    }
                }
                // isFetchingEventId.current = '-1'
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.event.id])

    useEffect(() => {
        (async () => {
            if (appState.cEvent.id !== isFetchingCeventId.current && appState.cEvent.id !== '-1') {
                isFetchingCeventId.current = appState.cEvent.id
                appState.cEvent.set(NULL_HACKATHON)
                const event = await fetchEvent(appState.cEvent.id)
                if (event) {
                    if (isFetchingCeventId.current === appState.cEvent.id) {
                        appState.cEvent.set(event)
                    }
                } else {
                    if (isFetchingCeventId.current === appState.cEvent.id) {
                        appState.cEvent.set({
                            ...NULL_HACKATHON,
                            id: appState.cEvent.id,
                            notFound: true
                        })
                    }
                }
                // isFetchingCeventId.current = '-1'
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.cEvent.id])

    useEffect(() => {
        const u = appState.cUser
        if (u.id !== '-1') {
            const i = appState.invites.i
            const personal = []
            const team = []
            const uTeam = []
            for (let p of i.personal) {
                if (p.id === u.id) {
                    personal.push(u)
                } else {
                    personal.push(p)
                }
            }

            for (let t of i.team) {
                if (t.id === u.id) {
                    team.push(u)
                } else {
                    team.push(t)
                }
            }

            for (let t of u.team.members) {
                if (t.id === u.id) {
                    uTeam.push(u)
                } else {
                    uTeam.push(t)
                }
            }

            i.set({team, personal})
            u.change({
                team: {
                    name: u.team.name,
                    members: uTeam
                }
            })
            if (u.id === appState.cUser.id) {
                appState.cUser.set({
                    ...u, team: {
                        name: u.team.name,
                        members: uTeam
                    }
                })
            }
        }
    }, [appState.user.firstName, appState.user.lastName, appState.user.bio,
        appState.user.avatar, appState.user.skills])
    return null
}