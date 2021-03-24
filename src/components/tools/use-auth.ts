import {useEffect} from 'react'
import {useAppState} from './use-app-state'

export const useAuth = () => {

    const {cEvent, cUser} = useAppState()

    useEffect(() => {
        (async () => {
            cEvent.change({id: '6'})
            cUser.change({id: '1'})
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}