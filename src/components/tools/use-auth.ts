import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {checkUser, fetchEvent, logOut} from '../../model/api'

export const useAuth = () => {

    const {cEvent, cUser} = useAppState()

    useEffect(() => {
        if (cEvent.id !== '-1') {
            localStorage.setItem('eventId', cEvent.id)
        }
    }, [cEvent.id])

    useEffect(() => {
        (async () => {
            if (cUser.notFound && cUser.id !== '-1') {
                await logOut()
                window.location.reload()
            }
        })()
    }, [cUser.notFound])

    useEffect(() => {
        (async () => {
            const eventId = localStorage.getItem('eventId')
            const userId = await checkUser()//'181853117'
            if (eventId) {
                cEvent.change({id: eventId})
                const e = await fetchEvent(eventId)
                if (e && e.id === cEvent.id) {
                    cEvent.set(e)
                } else {
                    if (eventId === cEvent.id) {
                        cEvent.change({notFound: true})
                    }
                }
            } else {
                // cEvent.change({id: eventId})
            }
            // @ts-ignore
            cUser.change({
                id: userId,
                isLoading: true,
                isNotAuthorized: userId === '-1'
            })
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}