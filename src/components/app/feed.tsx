import React, {
    Dispatch,
    Fragment,
    SetStateAction,
    useCallback,
    useEffect,
    useState
} from 'react'
import {UserApp} from './user'
import {Box, Grid, Slide, Typography, useTheme} from '@material-ui/core'
import {useLocation} from 'react-router-dom'
import {getFeed} from '../../model/api'
import {NULL_USER, useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {PrimaryButton} from '../common/buttons'
import {useHistory} from 'react-router-dom'
import {useSnackbar} from 'notistack'
import {useSearchModal} from '../modals/search'
import {ReactComponent as TweakIcon} from '../../assets/tweak.svg'
import {ReactComponent as BackIcon} from '../../assets/back_gray.svg'
import {ReactComponent as SearchIcon} from '../../assets/search.svg'
import {AdditionalText, GrayishPlate, Plate} from '../common'
import {ChosenSkills} from '../common/display-skills'

const StyledDiv = styled.div`
  position: fixed;
  display: flex;
`

//@ts-ignore
const FeedContext = React.createContext()

export const FeedProvider: React.FC = ({children}) => {

    const {cEvent} = useAppState()
    const [users, setUsers] = useState<string[]>([])
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        setUsers([])
        setCurrent(0)
    }, [cEvent.id])
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

const EndMessage: React.FC<{ isFetching?: boolean }> = ({isFetching}) => {
    const theme = useTheme()
    const sModal = useSearchModal()
    return <Grid container direction='column'>
        <Grid item container>
            <GrayishPlate padding={16}>
                <Grid container spacing={1}>
                    <Grid item>
                        <Typography variant='h2'>
                            Вы просмотрели всех пользователей, подходящих под
                            Ваш запрос.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <AdditionalText>
                            Попробуйте изменить параметры поиска
                        </AdditionalText>
                    </Grid>
                    <Grid item container>
                        <Plate elevation={4} padding={12}>
                            <Grid container spacing={2}>
                                <Grid item md container alignItems='center'
                                      spacing={1}>
                                    <Grid item>
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
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant='body1'>
                                            &mdash; для выбора навыков
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item md container alignItems='center'
                                      spacing={1}>
                                    <Grid item>
                                        <PrimaryButton disabled={isFetching}
                                                       style={{
                                                           height: 48,
                                                           backgroundColor: '#F0F2F5',
                                                           boxShadow: theme.shadows[1],
                                                           marginRight: theme.spacing(1)
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
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant='body1'>
                                            &mdash; для поиска по соцсетям
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Plate>
                    </Grid>
                </Grid>
            </GrayishPlate>
        </Grid>
    </Grid>
}
export const FeedApp: React.FC = () => {

    const [direction, setDirection] = useState<'right' | 'left'>('right')

    const [key, setKey] = useState(Math.random())

    const location = useLocation()
    const [lastLocation, setLastLocation] = useState(location.search)
    const [lastEvent, setLastEvent] = useState('-1')
    const {current, setCurrent, users, setUsers} = useFeed()

    const [isFetching, setIsFetching] = useState(true)
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
                setIsFetching(true)
                const newUsers = await getFeed(cEvent.id, location.search)
                setIsFetching(false)
                if (location.search !== lastLocation || lastEvent !== cEvent.id) {
                    setLastLocation(location.search)
                    setCurrent(0)
                    setUsers([...newUsers])
                } else {
                    setUsers([...newUsers])
                }
                setLastEvent(cEvent.id)
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cEvent.id, location, cEvent.notFound, cEvent.isParticipating, settings.isHostMode])

    const nextUser = useCallback(() => {
        (async () => {
            setDirection('right')
            if (cEvent.id === '-1') {
                enqueueSnackbar('Не удалось загрузить пользователей', {
                    variant: 'error'
                })
                return
            }
            let newCurrent = current
            if (newCurrent >= users.length) {
                // setIsFetching(true)
                // setUsers([])
                // const newUsers = await getFeed(cEvent.id, location.search, users[current])
                // if (newUsers.length) {
                // setUsers([...users, ...newUsers])
                setUsers([...users])
                newCurrent = -1
                // }
                setIsFetching(false)
            }
            setCurrent(newCurrent + 1)
            setKey(Math.random())
        })()
    }, [current, users, location, setCurrent, setIsFetching, cEvent.id, setDirection])

    const prevUser = useCallback(() => {
        (async () => {
            setDirection('left')
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
    }, [current, users, location, setCurrent, setIsFetching, cEvent.id, setDirection])

    useEffect(() => {
        if (users[current]) {
            user.change({id: users[current]})
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, current])
    console.log(users, isFetching)
    return <Fragment>
        <Slide key={key} in direction={direction}>
            <div>

                {users.length === 0 && isFetching ? null : current >= users.length && !isFetching ?
                    <EndMessage isFetching={isFetching}/> :
                    <UserApp/>
                }
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
                {current > 0 &&
                <PrimaryButton disabled={isFetching}
                               style={{
                                   height: 48,
                                   backgroundColor: '#F0F2F5',
                                   marginRight: theme.spacing(1),
                                   boxShadow: theme.shadows[1]
                               }}
                               onClick={prevUser}><BackIcon/></PrimaryButton>
                }
                <PrimaryButton disabled={isFetching}
                               style={{
                                   height: 48,
                                   width: 136,
                                   boxShadow: theme.shadows[1]
                               }}
                               onClick={nextUser}>{current >= users.length ? 'Заново' : 'Следующий'}</PrimaryButton>
            </StyledDiv>
        </Box>
    </Fragment>
}