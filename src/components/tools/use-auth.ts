import {useEffect} from 'react'
import {useAppState} from './use-app-state'
import {checkUser} from '../../model/api'

export const useAuth = () => {

    const {cEvent, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            const userId = '17'//'181853117'// await checkUser()
            cEvent.change({id: '6'})
            cUser.change({id: userId})
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}