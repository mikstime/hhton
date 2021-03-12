import React, {Fragment, useCallback, useEffect, useState} from 'react'
import {UserApp} from './user'
import {Slide} from '@material-ui/core'
import {useLocation} from 'react-router-dom'
import {getFeed} from '../../model/api'
import {useAppState} from '../tools/use-app-state'
import styled from 'styled-components'
import {PrimaryButton} from '../common/buttons'

const StyledDiv = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
`
export const FeedApp: React.FC = () => {

    const [key, setKey] = useState(Math.random())

    const location = useLocation()
    const [users, setUsers] = useState<string[]>([])
    const [current, setCurrent] = useState(0)

    const [isFetching, setIsFetching] = useState(false)

    const {event, user} = useAppState()
    useEffect(() => {
        (async () => {
            const users = await getFeed(event.id, location.search)
            if (users.length) {
                setUsers(users)
            }
        })()
    }, [location, setUsers])

    const nextUser = useCallback(() => {
        (async () => {
            if (current >= users.length - 1) {
                setIsFetching(true)
                const newUsers = await getFeed(location.search, users[current])
                if (newUsers.length) {
                    setUsers([...users, ...newUsers])
                }
                setIsFetching(false)
            }
            setCurrent(current + 1)
            setKey(Math.random())
        })()
    }, [current, users, location, setCurrent, setIsFetching])

    useEffect(() => {
        if (users.length > 0) {
            user.change({id: users[current]})
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current])
    return <Fragment>
        <Slide key={key} in direction='right'>
            <div>
                <UserApp>
                </UserApp>
            </div>
        </Slide>
        <StyledDiv>
            <PrimaryButton style={{transform: 'scale(1.5)', transformOrigin: 'bottom right'}} disabled={isFetching}
                           onClick={nextUser}>Следующий</PrimaryButton>
        </StyledDiv>
    </Fragment>
}