import React, {useCallback} from 'react'
import {
    AppBar,
    createStyles, Drawer,
    GridProps,
    Hidden,
    IconButton, makeStyles, Theme,
    Toolbar
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {DefaultMenu} from './default'
import {LoadingMenu} from './loading'
import {OwnerMenu} from './owner'
import {UnAuthMenu} from './unauth'

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
            padding: '8px 0 24px 24px',
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

    if (cEvent.founderId === cUser.id) {
        drawer = <OwnerMenu onClick={onLinkClick}/>
    } else if (cUser.id === '-1') {
        drawer = <UnAuthMenu onClick={onLinkClick}/>
    } else if (cUser.id !== '-1' && cEvent.id !== '-1') {
        drawer = <DefaultMenu onClick={onLinkClick}/>
    }
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