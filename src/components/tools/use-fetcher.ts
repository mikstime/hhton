import {useEffect, useRef, useState} from 'react'
import {useAppState} from './use-app-state'
import {fetchEvent, fetchUser, getTeam} from '../../model/api'
import {NULL_HACKATHON, NULL_USER} from './use-app-state'


// let isFetchingId = '-1'

export const useFetcher = () => {

    const isFetchingId = useRef('-1')
    const appState = useAppState()

    const [isFetchingEvent, setIsFetchingEvent] = useState(false)

    useEffect(() => {
        (async () => {
            if (appState.user.id !== isFetchingId.current && appState.user.id !== '-1') {
                isFetchingId.current = appState.user.id
                appState.user.set(NULL_USER)
                const user = await fetchUser(appState.user.id)

                if (user) {
                    if (isFetchingId.current === appState.user.id) {
                        appState.user.set(user)
                        const team = await getTeam(appState.event.id, user)
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
            if (!isFetchingEvent) {
                setIsFetchingEvent(true)

                appState.event.set(NULL_HACKATHON)
                const event = await fetchEvent(appState.event.id)

                if (event) {
                    appState.event.set(event)
                    setIsFetchingEvent(false)
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.event.id])

    return null
}