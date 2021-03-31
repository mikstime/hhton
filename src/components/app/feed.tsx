import React, {Fragment, useCallback, useEffect, useState} from 'react'
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

const StyledDiv = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
`
export const FeedApp: React.FC = () => {

    const [key, setKey] = useState(Math.random())

    const location = useLocation()
    const [users, setUsers] = useState<string[]>([])
    const [current, setCurrent] = useState(0)

    const [isFetching, setIsFetching] = useState(false)
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const {cEvent, user} = useAppState()
    const sModal = useSearchModal()
    const theme = useTheme()
    useEffect(() => {
        (async () => {
            if (cEvent.id !== '-1') {
                const users = await getFeed(cEvent.id, location.search)
                if (users.length) {
                    setUsers(users)
                    setCurrent(0)
                }
            }
            if (cEvent.notFound) {
                history.push('/user')
            }
        })()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cEvent.id, location, cEvent.notFound])

    const nextUser = useCallback(() => {
        (async () => {
            if (cEvent.id === '-1') {
                enqueueSnackbar('Не удалось загрузить пользователей', {
                    variant: 'error'
                })
                return
            }
            if (current >= users.length - 1) {
                setIsFetching(true)
                const newUsers = await getFeed(cEvent.id, location.search, users[current])
                if (newUsers.length) {
                    setUsers([...users, ...newUsers])
                }
                setIsFetching(false)
            }
            setCurrent(current + 1)
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
                               boxShadow: theme.shadows[1]
                           }}
                           onClick={nextUser}>Следующий</PrimaryButton>
        </StyledDiv>
    </Fragment>
}