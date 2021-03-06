import React, {Fragment, useState} from 'react'
import {Button, Container, Grid, InputBase, Typography} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {useAppState} from './use-app-state'
import {FlexSpace} from '../common'

export const DevTools: React.FC = () => {

    const [isOpen, setIsOpen] = useState(true)
    const [userId, setUserId] = useState('')
    const [eventId, setEventId] = useState('')
    const {user, event} = useAppState()

    if (process.env.NODE_ENV === 'production') {
        return null
    }

    return <Container><Grid container spacing={1}>
        <Button onClick={() => setIsOpen(!isOpen)}>Dev Tools</Button>
        <Grid container alignItems='center' spacing={2}
              style={{background: '#f2f2f2', marginBottom: 40}}>
            {isOpen && <Fragment><Grid item>Меню разработчика: </Grid>
              <Grid item><Link to={'/user'}>user</Link></Grid>
              <Grid item><Link to={'/event'}>event</Link></Grid>
              <Grid item><Link to={'/team'}>team</Link></Grid>
              <Grid item><Link to={'/feed'}>feed</Link></Grid>
              <Grid item><Link to={'/home'}>home</Link></Grid>
              <FlexSpace/>
              <Typography>User id:</Typography>
              <InputBase
                disabled={user.isNullUser && !user.notFound}
                style={{border: '1px solid red'}}
                placeholder='1'
                value={userId}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        user.change({id: userId})
                    }
                }}
                onChange={e => setUserId(e.target.value)}
                onBlur={(e) => {
                    if (e && e.target) {
                        user.change({id: e.target.value})
                    }
                }}
              />
              <Typography>Event id:</Typography>
              <InputBase
                disabled={!event.name}
                style={{border: '1px solid blue'}}
                placeholder='1'
                value={eventId}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        event.change({id: eventId})
                    }
                }}
                onChange={e => setEventId(e.target.value)}
                onBlur={(e) => {
                    if (e && e.target) {
                        event.change({id: e.target.value})
                    }
                }}
              />
            </Fragment>
            }
        </Grid>
    </Grid>
    </Container>
}