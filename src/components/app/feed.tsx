import React, {
    Dispatch,
    Fragment,
    SetStateAction,
    useCallback,
    useEffect,
    useState
} from 'react'
import {UserApp} from './user'
import {Box, Slide, useTheme} from '@material-ui/core'
import {useLocation} from 'react-router-dom'
import {getFeed} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {PrimaryButton} from '../common/buttons'
import {useHistory} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import {useSearchModal} from '../modals/search'
import {ReactComponent as TweakIcon} from '../../assets/tweak.svg'
import {ReactComponent as BackIcon} from '../../assets/back_gray.svg'
import {ReactComponent as SearchIcon} from '../../assets/search.svg'

const StyledDiv = styled.div`
  position: fixed;
  display: flex;
`

//@ts-ignore
const FeedContext = React.createContext()

export const FeedProvider: React.FC = ({children}) => {

    const [users, setUsers] = useState<string[]>([])
    const [current, setCurrent] = useState(0)
    //event id can be accessed with useAppState

    const val = {
        current, setCurrent,
        users, setUsers
    }

    return <FeedContext.Provider value={val}>
        {children}
    </FeedContext.Provider>
}

const useFeed = () => {
    const context = React.useContext(FeedContext)

    if (context === undefined) {
        throw new Error('useFeed must be used within a FeedProvider')
    }
    return context as {
        current: number, setCurrent: Dispatch<SetStateAction<number>>,
        users: string[], setUsers: Dispatch<SetStateAction<string[]>>
    }
}

export const FeedApp: React.FC = () => {

    const [key, setKey] = useState(Math.random())

    const location = useLocation()
    const {current, setCurrent, users, setUsers} = useFeed()

    const [isFetching, setIsFetching] = useState(false)
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const {cEvent, user, cUser, settings} = useAppState()
    const sModal = useSearchModal()
    const theme = useTheme()
    useEffect(() => {
        (async () => {
            if (cEvent.notFound) {
                history.push('/user')
            }
            if (cUser.notFound || cEvent.isFinished || settings.isHostMode) {
                history.push('/event/' + cEvent.id)
            }
            if (cEvent.id !== '-1') {
                const newUsers = await getFeed(cEvent.id, location.search)
                if (newUsers.length) {
                    setUsers([...users, ...newUsers])
                }
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cEvent.id, location, cEvent.notFound, cEvent.isParticipating, settings.isHostMode])

    const nextUser = useCallback(() => {
        (async () => {
            if (cEvent.id === '-1') {
                enqueueSnackbar('Не удалось загрузить пользователей', {
                    variant: 'error'
                })
                return
            }
            let newCurrent = current
            if (newCurrent >= users.length - 1) {
                setIsFetching(true)
                const newUsers = await getFeed(cEvent.id, location.search, users[current])
                if (newUsers.length) {
                    // setUsers([...users, ...newUsers])
                    setUsers([...newUsers])
                    newCurrent = -1
                }
                setIsFetching(false)
            }
            setCurrent(newCurrent + 1)
            setKey(Math.random())
        })()
    }, [current, users, location, setCurrent, setIsFetching, cEvent.id])

    const prevUser = useCallback(() => {
        (async () => {
            if (cEvent.id === '-1') {
                enqueueSnackbar('Не удалось загрузить пользователей', {
                    variant: 'error'
                })
                return
            }
            let newCurrent = current
            if (newCurrent <= 0) {
                setIsFetching(true)
                const newUsers = await getFeed(cEvent.id, location.search, users[current])
                if (newUsers.length) {
                    // setUsers([...users, ...newUsers])
                    setUsers([...newUsers])
                    newCurrent = newUsers.length
                }
                setIsFetching(false)
            }
            setCurrent(newCurrent - 1)
            setKey(Math.random())
        })()
    }, [current, users, location, setCurrent, setIsFetching, cEvent.id])

    useEffect(() => {
        if (users[current]) {
            user.change({id: users[current]})
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, current])

    return <Fragment>
        <Slide key={key} in direction='right'>
            <div>
                <UserApp/>
                <Box height='70px'/>
            </div>
        </Slide>
        <Box clone
             height={48}
             width={138}
             left={{
            md: 'max(224px, calc((100vw - 912px) / 2 + 100px))',
            lg: `calc((100vw - 912px) / 2 - 24px + 100px)`
        }}
             right={{xs: '20px'}} bottom={{xs: 76, md: 20}}
             top={{lg: 'min(calc(100vh - 68px), 1000px)'}}>
            <StyledDiv>
                <PrimaryButton disabled={isFetching}
                               style={{
                                   height: 48,
                                   backgroundColor: '#F0F2F5',
                                   boxShadow: theme.shadows[1],
                                   marginRight: theme.spacing(1)
                               }}
                               onClick={() => {
                                   sModal.actions.open({
                                       current: 'smart',
                                       props: {
                                           canGoBack: false
                                       }
                                   })
                               }
                               }><TweakIcon/></PrimaryButton>
                <PrimaryButton disabled={isFetching}
                               style={{
                                   height: 48,
                                   backgroundColor: '#F0F2F5',
                                   boxShadow: theme.shadows[1]
                               }}
                               onClick={() => {
                                   sModal.actions.open({
                                       current: 'user',
                                       props: {
                                           canGoBack: false
                                       }
                                   })
                               }
                               }><SearchIcon/></PrimaryButton>
            </StyledDiv>
        </Box>
        <Box clone height={48} right={{
            xs: '20px',
            md: '20px',
            // md: 'max(48px, calc((100vw - 912px) / 2 - 24px))',
            lg: `calc((100vw - 960px - 200px) / 2 + 24px) !important`
        }}
             bottom={20}
             top={{lg: 'min(calc(100vh - 68px), 1000px)'}}>
            <StyledDiv>
                <PrimaryButton disabled={isFetching}
                               style={{
                                   height: 48,
                                   backgroundColor: '#F0F2F5',
                                   marginRight: theme.spacing(1),
                                   boxShadow: theme.shadows[1]
                               }}
                               onClick={prevUser}><BackIcon/></PrimaryButton>
                <PrimaryButton disabled={isFetching}
                               style={{
                                   height: 48,
                                   width: 136,
                                   boxShadow: theme.shadows[1]
                               }}
                               onClick={nextUser}>Следующий</PrimaryButton>
            </StyledDiv>
        </Box>
    </Fragment>
}