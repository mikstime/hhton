import React, {Fragment} from 'react'
import {Switch, Route} from 'react-router-dom'
import {UserApp} from './user'
import {EventApp} from './event'
import {TeamApp} from './team'
import {FeedApp} from './feed'
import {HomeApp} from './home'
import {useFetcher} from '../tools/use-fetcher'
import {useAuth} from '../tools/use-auth'
import {useInvitesFetcher} from '../tools/use-invites-fetcher'
import {
    Container, ContainerProps,
    Box
} from '@material-ui/core'
import styled from 'styled-components'
import {useNotifications} from '../tools/use-notifications'
import {HostApp} from './host'
import {CreateEventApp} from './create-event'
import {AppNavigation} from '../navigation'


const StyledContainer = styled(Container)`
  min-height: 100vh;
  padding-top: 64px;
  box-sizing: border-box;
`
const RootContainer: React.FC<ContainerProps> = (props) => {
    return <Fragment>
        <Box clone>
            <StyledContainer maxWidth='md' {...props}/>
        </Box>
    </Fragment>
}

export const App: React.FC = () => {

    useFetcher()
    useInvitesFetcher()
    useAuth()
    useNotifications()

    return <Switch>
        <Route path='/event/create'>
            <AppNavigation>
                <RootContainer>
                    <CreateEventApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/user/:userId'>
            <AppNavigation>
                <RootContainer>
                    <UserApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/user'>
            <AppNavigation>
                <RootContainer>
                    <UserApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/event/:eventId'>
            <AppNavigation>
                <RootContainer>
                    <EventApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/event'>
            <AppNavigation>
                <RootContainer>
                    <EventApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/team'>
            <AppNavigation>
                <RootContainer>
                    <TeamApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/feed'>
            <AppNavigation>
                <RootContainer>
                    <FeedApp/>
                </RootContainer>
            </AppNavigation>
        </Route>
        <Route path='/host'>
            <HostApp/>
        </Route>
        <Route>
            <HomeApp/>
        </Route>
    </Switch>
}
