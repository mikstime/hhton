import {useEffect, useState} from 'react'
import {useAppState} from './use-app-state'
import {fetchUser} from '../../model/api'
import {NULL_USER} from './use-app-state/use-app-state'


export const useFetcher = () => {

    const appState = useAppState()

    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        (async () => {
            if(!isFetching) {
                setIsFetching(true)

                appState.user.set(NULL_USER)
                const user = await fetchUser(appState.user.id)

                if (user) {
                    appState.user.set(user)
                    setIsFetching(false)
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState.user.id])

    return null
}