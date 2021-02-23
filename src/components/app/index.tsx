import React from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import {UserApp} from './user'
import {EventApp} from './event'
import {TeamApp} from './team'
import {FeedApp} from './feed'
import {Container, Grid} from '@material-ui/core'
import styled from 'styled-components'

const RootContainer = styled(Container)`
  min-height: 100vh;
`
export const App: React.FC = () => {
    return <RootContainer>
        <Grid container spacing={1}>
            <Grid item>Меню разработчика: </Grid>
            <Grid item><Link to={'/user'}>user</Link></Grid>
            <Grid item><Link to={'/event'}>event</Link></Grid>
            <Grid item><Link to={'/team'}>team</Link></Grid>
            <Grid item><Link to={'/feed'}>feed</Link></Grid>
        </Grid>
        <Switch>
            <Route path='/user'>
                <UserApp/>
            </Route>
            <Route path='/event'>
                <EventApp/>
            </Route>
            <Route path='/team'>
                <TeamApp/>
            </Route>
            <Route path='/feed'>
                <FeedApp/>
            </Route>
        </Switch>
    </RootContainer>
}
