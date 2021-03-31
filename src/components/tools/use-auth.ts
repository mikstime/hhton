import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {checkUser, fetchEvent} from '../../model/api'

export const useAuth = () => {

    const {cEvent, event, cUser} = useAppState()

    useEffect(() => {
        if(event.id !== '-1') {
            localStorage.setItem('eventId', event.id)
            if (cEvent.id !== event.id)
                cEvent.change({id: event.id})
        }
    }, [event.id])
    useEffect(() => {
        (async () => {
            const eventId = localStorage.getItem('eventId')
            const userId = await checkUser()//'181853117'

            if(eventId) {
                cEvent.change({id: eventId})
                const e = await fetchEvent(eventId)
                if(e) {
                    cEvent.set(e)
                } else {
                    cEvent.change({notFound: true})
                }
            } else {
                // cEvent.change({id: eventId})
            }
            // @ts-ignore
            cUser.change({id: userId, isNotAuthorized: userId === '-1'})
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}