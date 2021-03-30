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
import {HOST_DOMAIN, PREFIX} from '../../config/network'

const NavLink: React.FC<LinkProps> = (props) => {
    const theme = useTheme()
    return <Box clone color={theme.typography.body2.color}>
        <Link {...props} style={{textDecoration: 'none'}}/>
    </Box>
}

const drawerWidth = 200

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0
            }
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            }
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            paddingTop: 64,
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'transparent',
            border: 'none'
        },
        drawerPaper2: {
            width: drawerWidth,
            padding: theme.spacing(3)
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    })
)

const AppNav: React.FC<GridProps> = ({children}) => {
    const {cEvent, cUser} = useAppState()
    const classes = useStyles()

    const container = document.getElementById('root')

    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <Box display='flex' flexDirection='column'>
            <NavLink to={`/event/${cEvent.id}`}
                     onClick={() => setMobileOpen(false)}>
                <AdditionalText
                    align='right'>
                    К мероприятию
                </AdditionalText>
            </NavLink>
            <Box paddingTop={2}/>
            {cUser.id !== '-1' &&
            <NavLink to={`/team`} onClick={() => setMobileOpen(false)}>
              <AdditionalText align='right'>
                К команде
              </AdditionalText>
            </NavLink>
            }
            <Box paddingTop={2}/>
            {cUser.id !== '-1' &&
            <NavLink to={`/user`} onClick={() => setMobileOpen(false)}>
              <AdditionalText align='right'>
                К себе
              </AdditionalText>
            </NavLink>
            }
            <Box height='100px'/>
            <NavLink to={`/host`} onClick={() => setMobileOpen(false)}>
                <AdditionalText align='right'>
                    Организаторам
                </AdditionalText>
            </NavLink>
            {
                cUser.isNotAuthorized &&
                <a href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=${ window.location.pathname.replace('/', '')}`}
                   style={{textDecoration: 'none'}}>
                  <AdditionalText align='right'>
                    Регистрация
                  </AdditionalText>
                </a>
            }
        </Box>
    )
    return <div className={classes.root}>
        <Hidden smUp implementation="css">
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        Меню
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Hidden>
        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer className={classes.drawer}
                        container={container}
                        variant="temporary"
                        anchor={'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper2
                        }}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    variant="permanent"
                    open
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
        {children}
    </div>
}

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
            <AppNav>
                <RootContainer>
                    <CreateEventApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/user/:userId'>
            <AppNav>
                <RootContainer>
                    <UserApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/user'>
            <AppNav>
                <RootContainer>
                    <UserApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/event/:eventId'>
            <AppNav>
                <RootContainer>
                    <EventApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/event'>
            <AppNav>
                <RootContainer>
                    <EventApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/team'>
            <AppNav>
                <RootContainer>
                    <TeamApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/feed'>
            <AppNav>
                <RootContainer>
                    <FeedApp/>
                </RootContainer>
            </AppNav>
        </Route>
        <Route path='/host'>
            <HostApp/>
        </Route>
        <Route>
            <HomeApp/>
        </Route>
    </Switch>
}
