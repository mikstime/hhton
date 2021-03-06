import {useEffect, useState} from 'react'
import {useAppState} from './use-app-state'
import {fetchEvent, fetchUser} from '../../model/api'
import {NULL_HACKATHON, NULL_USER} from './use-app-state'


let isFetchingId = '-1'

export const useFetcher = () => {

    const appState = useAppState()

    const [isFetchingEvent, setIsFetchingEvent] = useState(false)

    useEffect(() => {
        (async () => {
            if (appState.user.id !== isFetchingId && appState.user.id !== '-1') {
                isFetchingId = appState.user.id
                const user = await fetchUser(appState.user.id)

                if (user) {
                    if (isFetchingId === appState.user.id) {
                        appState.user.set(user)
                    }
                } else {
                    if (isFetchingId === appState.user.id) {
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