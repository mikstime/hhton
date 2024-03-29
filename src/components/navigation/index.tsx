import React, {useCallback} from 'react'
import {
    AppBar, Box,
    createStyles, Drawer,
    GridProps,
    Hidden,
    IconButton, makeStyles, Theme,
    Toolbar
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {DefaultMenu} from './default'
import {LoadingMenu} from './loading'
import {UnAuthMenu} from './unauth'
import {
    NotificationSectionSmall
} from '../common/notifications-section'
import {ReactComponent as MenuIcon} from '../../assets/navigation/menu.svg'
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
            backgroundColor: '#F9F9F9',
            marginLeft: drawerWidth,
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            }
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            padding: `8px 0 24px 24px`,
            boxSizing: 'border-box',
            [theme.breakpoints.up('md')]: {
                marginLeft: `calc((100vw - 912px - ${drawerWidth}px) / 2 - 24px)`,
                width: drawerWidth
            },
            [theme.breakpoints.down('md')]: {
                marginLeft: 0
            },
            width: drawerWidth,
            background: 'transparent',
            border: 'none'
        },
        drawerPaper2: {
            width: drawerWidth,
            height: 'calc(100vh - 24px)',
            padding: `8px 24px 24px 24px`,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    })
)

export const AppNavigation: React.FC<GridProps> = ({children}) => {
    const {cEvent, cUser} = useAppState()
    const classes = useStyles()

    const container = document.getElementById('root')

    const [mobileOpen, setMobileOpen] = React.useState(false)

    const onLinkClick = useCallback(() => {
        setMobileOpen(false)
    }, [setMobileOpen])
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }
    let drawer = <LoadingMenu onClick={onLinkClick}/>

    if(!cUser.isLoading) {
        if (cEvent.founderId === cUser.id && cEvent.founderId !== '-1') {
            drawer = <DefaultMenu onClick={onLinkClick}/>
        } else if (cUser.id === '-1') {
            drawer = <UnAuthMenu onClick={onLinkClick}/>
        } else if (cUser.id !== '-1' && cEvent.id !== '-1') {
            drawer = <DefaultMenu onClick={onLinkClick}/>
        }
    }

    return <div className={classes.root}>
        <Hidden smUp implementation="js">
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Box flex={1}/>
                    <NotificationSectionSmall/>
                </Toolbar>
            </AppBar>
        </Hidden>
        <nav className={classes.drawer} aria-label="navigation mobile">
            <Hidden smUp implementation="js">
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
                            keepMounted: true
                        }}
                >
                    {drawer}
                    <Box height='64px'/>
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