import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {checkUser} from '../../model/api'

export const useAuth = () => {

    const {cEvent, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            const userId = '17'//'181853117'//await checkUser()//'181853117'
            cEvent.change({id: '6'})
            // @ts-ignore
            cUser.change({id: userId, isNotAuthorized: userId === '-1'})
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}