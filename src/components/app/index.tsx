import React, {Fragment} from 'react'
import {Switch, Route, Link, LinkProps} from 'react-router-dom'
import {UserApp} from './user'
import {EventApp} from './event'
import {TeamApp} from './team'
import {FeedApp} from './feed'
// import {DevTools} from '../tools/dev-tools'
import {HomeApp} from './home'
import {useFetcher} from '../tools/use-fetcher'
import {useAuth} from '../tools/use-auth'
import {useInvitesFetcher} from '../tools/use-invites-fetcher'
import {
    AppBar,
    Container, ContainerProps, createStyles, Drawer,
    GridProps,
    Hidden,
    IconButton, makeStyles, Theme, Toolbar, Box,
    useTheme
} from '@material-ui/core'
// import {ReactComponent as BackIcon} from '../../assets/back_gray.svg'
import {useAppState} from '../tools/use-app-state'
import {AdditionalText} from '../common'
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
        <Hidden lgUp>
            <Box clone
                 marginRight={{md: '50px !important', lg: '200px !important'}}
                 paddingLeft={{md: 'calc(15vw - 120px) !important'}}
                 paddingRight={{md: 'calc(15vw - 130px) !important'}}>
                <StyledContainer maxWidth='md' {...props}/>
            </Box>
        </Hidden>
        <Hidden mdDown>
            <Box clone
                 marginRight={{md: '50px !important', lg: '250px !important'}}
                 paddingLeft={{md: '72px !important'}}
                 paddingRight={{md: '62px !important'}}>
                <StyledContainer maxWidth='md' {...props}/>
            </Box>
        </Hidden>
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
