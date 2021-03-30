import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {checkUser} from '../../model/api'

export const useAuth = () => {

    const {cEvent, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            const userId = await checkUser()//'181853117'
            cEvent.change({id: '6'})
            cUser.change({id: userId})
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}