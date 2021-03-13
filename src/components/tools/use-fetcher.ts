import {useEffect, useRef} from 'react'
import {useAppState} from './use-app-state'
import {fetchEvent, fetchUser, getTeam, isParticipating} from '../../model/api'
import {NULL_HACKATHON, NULL_USER} from './use-app-state'


export const useFetcher = () => {

    const isFetchingId = useRef('-1')
    const isFetchingEventId = useRef('-1')

    const appState = useAppState()

    useEffect(() => {
        (async () => {
            if (appState.user.id !== isFetchingId.current && appState.user.id !== '-1') {
                isFetchingId.current = appState.user.id
                appState.user.set(NULL_USER)
                const user = await fetchUser(appState.user.id)

                if (user) {
                    if (isFetchingId.current === appState.user.id) {
                        appState.user.set(user)
                        const team = appState.event.id !== '-1' ? await getTeam(appState.event.id, user.id): {members: []}
                        if(isFetchingId.current === appState.user.id) {
                            if(~team.members.findIndex((v) => v.id === appState.cUser.id)) {
                                appState.user.change({inMyTeam: true})
                            }
                            appState.user.change({team})
                        }
                    }
                } else {
                    if (isFetchingId.current === appState.user.id) {
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
                const participating = await isParticipating(appState.event.id, appState.cUser.id);
                appState.event.change({isParticipating: !!participating})
            }
        })()
    }, [appState.cUser.id, appState.event.id])

    useEffect(() => {
        (async () => {
            if (appState.event.id !== isFetchingEventId.current && appState.event.id !== '-1') {
                isFetchingEventId.current = appState.event.id
                appState.event.set(NULL_HACKATHON)
                const event = await fetchEvent(appState.event.id)
                if (event) {
                    if (isFetchingEventId.current === appState.event.id) {
                        appState.event.set(event)
                    }
                } else {
                    if (isFetchingEventId.current === appState.event.id) {
                        appState.event.set({
                            ...NULL_HACKATHON,
                            id: appState.event.id,
                            notFound: true
                        })
                    }
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.event.id])
    // useEffect(() => {
    //     (async () => {
    //         if (!isFetchingEvent) {
    //             setIsFetchingEvent(true)
    //
    //             appState.event.set(NULL_HACKATHON)
    //             const event = await fetchEvent(appState.event.id)
    //
    //             if (event) {
    //                 appState.event.set(event)
    //                 setIsFetchingEvent(false)
    //             }
    //         }
    //     })()
    //     //eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [appState.event.id])

    return null
}