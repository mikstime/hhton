import React from 'react'
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
    const {cEvent} = useAppState()
    const classes = useStyles()

    const container = document.getElementById('root')

    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <Box>
            <NavLink to={`/event/${cEvent.id}`}>
                <AdditionalText
                    align='right'>
                    К мероприятию
                </AdditionalText>
            </NavLink>
            <Box paddingTop={2}/>
            <NavLink to={`/team`}>
                <AdditionalText align='right'>
                    К команде
                </AdditionalText>
            </NavLink>
            <Box paddingTop={2}/>
            <NavLink to={`/user`}>
                <AdditionalText align='right'>
                    К себе
                </AdditionalText>
            </NavLink>
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
                        Чуча
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
    return <Box clone
                marginRight={{md: '50px !important', lg: '200px !important'}}>
        <StyledContainer {...props}/>
    </Box>
}

export const App: React.FC = () => {

    useFetcher()
    useInvitesFetcher()
    useAuth()

    return <Switch>
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
        <Route>
            <HomeApp/>
        </Route>
    </Switch>
}
