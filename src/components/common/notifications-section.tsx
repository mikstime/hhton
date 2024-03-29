import React, {
    Fragment,
    MutableRefObject,
    useEffect,
    useRef,
    useState
} from 'react'
import {
    Box, createStyles,
    Grid, Hidden,
    IconButton, makeStyles, Popover, PopoverProps,
    Theme
} from '@material-ui/core'
import {AdditionalText, GrayishPlate} from './index'
import {ReactComponent as NotificationIcon} from '../../assets/navigation/notifications.svg'
import {ReactComponent as NotificationWhiteIcon} from '../../assets/navigation/notifications_white.svg'
import {ReactComponent as OpenIcon} from '../../assets/navigation/open.svg'
import {ReactComponent as CloseIcon} from '../../assets/navigation/close.svg'
import Image from 'material-ui-image'
import {useAppState} from '../tools/use-app-state'
import {
    Message,
    useNotificationHandlers
} from '../tools/notification-handlers'
import {fetchEvent, getNotificationsHistory} from '../../model/api'
import {Hackathon} from '../tools/use-app-state/hackathon'
import {useHistory} from 'react-router-dom'
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            shadow: theme.shadows[4],
            maxWidth: '90vw',
            [theme.breakpoints.only('lg')]: {
                maxWidth: '912px'
            },
            [theme.breakpoints.only('md')]: {
                maxWidth: 'calc( 800px - 48px - 48px)',
            },
            [theme.breakpoints.only('sm')]: {
                maxWidth: 'calc( 100vw - 48px - 200px)',
            },
            [theme.breakpoints.only('xs')]: {
                maxWidth: 'calc(100vw - 48px)'
            }
        }
    })
)

const NotificationsPopover: React.FC<Omit<PopoverProps, 'children'> & { notifications: Message[] }> = ({notifications, ...props}) => {

    const classes = useStyles()
    const [logos, setLogos] = useState<string[]>([])
    const nc = useNotificationHandlers()
    const history = useHistory()

    useEffect(() => {
        (async () => {
            if (props.open) {
                const events: (Hackathon | null)[] = await Promise.all(
                    notifications.map(n => fetchEvent(n.type))
                )
                setLogos(events.map(e => e ? e.logo : ''))
            }
        })()
    }, [notifications, props.open])

    const render = notifications.slice(1).map((n: Message, i) => {
        return <Grid key={i} container wrap='nowrap'
                     style={{padding: '4px 8px 8px 8px'}}>
            <Grid item onClick={(e) => {
                nc.navigation[n.status] ? nc.navigation[n.status](n) : nc.navigation.default(n)
                props.onClose?.(e, 'backdropClick')
            }} style={{marginBottom: 8, cursor: 'pointer'}}>

                <Image disableSpinner
                       style={{width: 24, height: 24, padding: 0}}
                       imageStyle={{borderRadius: 4}} src={logos[i] || ''}/>
            </Grid>
            <Grid item xs zeroMinWidth onClick={(e) => {
                const link = nc.navigation[n.status] ? nc.navigation[n.status](n) : nc.navigation.default(n)
                if(link) {
                    history.push(link || '/event/' + notifications[0].type)
                }
                props.onClose?.(e, 'backdropClick')
            }} style={{cursor: 'pointer'}}>
                <AdditionalText
                                style={{
                                    marginLeft: 12
                                }}>{n.message}</AdditionalText>
            </Grid>
        </Grid>
    })
    return <Popover
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        classes={classes}
        {...props}
    >
        <Grid container direction='column'>
            <Grid item container justify='flex-end'
                  wrap='nowrap'
                  style={{padding: '12px 8px 8px 8px'}}>
                <Grid item>
                <NotificationIcon style={{width: '24px', height: '24px'}}/>
                </Grid>
                <Grid item zeroMinWidth
                      onClick={(e) => {
                          const link = nc.navigation[notifications[0].status] ? nc.navigation[notifications[0].status](notifications[0]) : nc.navigation.default(notifications[0])
                          if(link) {
                              history.push(link || '/event/' + notifications[0].type)
                          }
                          props.onClose?.(e, 'backdropClick')
                      }} style={{cursor: 'pointer', minHeight: 30}}>
                    <AdditionalText
                                    style={{marginLeft: 12}}>{notifications[0].message}</AdditionalText>
                </Grid>
                <Box flex={1}/>
                <Box clone paddingLeft='12px' width={42}>
                    <Grid item>
                        <IconButton size='small'
                                    onClick={(e) => props.onClose?.(e, 'backdropClick')}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Box>
            </Grid>
            {render.length > 0 ? render : <Box clone paddingRight='42px' paddingBottom={1} paddingLeft='44px'>
                <Grid item container>
                <AdditionalText>
                    Больше уведомлений нет
                </AdditionalText>
            </Grid>
            </Box>}
        </Grid>
    </Popover>
}
export const NotificationSection: React.FC = () => {
    const [notifications, setNotifications] = useState<Message[]>([])
    const nc = useNotificationHandlers()
    const [isOpen, setIsOpen] = useState(false)
    const {cUser} = useAppState()
    const ref = useRef<HTMLElement | null>(null) as MutableRefObject<HTMLDivElement | null>

    const history = useHistory()

    const [lastId, setLastId] = useState('')
    useEffect(() => {
        (async () => {
            if (cUser.id !== '-1' && cUser.id + nc.updates !== lastId) {
                setLastId(cUser.id + nc.updates)
                // setIsFetching(true)
                const notifications = await getNotificationsHistory(cUser.id)
                setNotifications(notifications)
                // setIsFetching(false)
            }
        })()
    }, [cUser.id, nc.updates])

    if (notifications.length > 0) {
        return <Fragment>
            <Hidden smUp>
                <Box height='64px'/>
            </Hidden>
            <Hidden xsDown>
                <Box clone height='64px'>
                    <Grid container alignItems='center' style={{zIndex: 200}}>
                        <NotificationsPopover
                            open={isOpen} anchorEl={ref.current}
                            notifications={notifications}
                            onClose={() => {
                                setIsOpen(false)
                            }}/>
                        <Grid item xs/>
                        <Box clone
                             maxWidth={{
                                 xs: 'calc(100vw - 48px)',
                                 sm: 'calc( 100vw - 48px - 200px)',
                                 md: 'calc( 800px - 48px - 48px)',
                                 lg: '912px'
                             }}
                        >
                            <Grid item ref={ref}>
                                <GrayishPlate padding={8}>
                                    <Grid container alignItems='center'
                                          wrap='nowrap'>
                                        <div
                                            style={{height: 24, width: 24}}
                                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                                if (ref.current) {
                                                    setIsOpen(!isOpen)
                                                }
                                            }}><NotificationIcon/></div>
                                        <Grid item zeroMinWidth
                                              style={{cursor: 'pointer'}}
                                              onClick={(e) => {
                                                  const link = nc.navigation[notifications[0].status] ? nc.navigation[notifications[0].status](notifications[0]) : nc.navigation.default(notifications[0])
                                                  if(link) {
                                                      history.push(link || '/event/' + notifications[0].type)
                                                  }
                                              }}>
                                            <AdditionalText
                                                noWrap
                                                style={{marginLeft: 12}}>{notifications[0].message}</AdditionalText>
                                        </Grid>
                                        <Box clone paddingLeft='12px'
                                             width={42}>
                                            <Grid item>
                                                {cUser.id !== '-1' &&
                                                <IconButton size='small'
                                                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                                                if (ref.current) {
                                                                    setIsOpen(!isOpen)
                                                                }
                                                            }}>
                                                    {isOpen ? <CloseIcon/> :
                                                        <OpenIcon/>}
                                                </IconButton>
                                                }
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </GrayishPlate>
                            </Grid>
                        </Box>
                    </Grid>
                </Box>
            </Hidden>
        </Fragment>
    }
    return <Box height='64px'/>
}

export const NotificationSectionSmall: React.FC = () => {
    const [notifications, setNotifications] = useState<Message[]>([])
    const nc = useNotificationHandlers()
    const [isOpen, setIsOpen] = useState(false)
    const {cUser} = useAppState()
    const ref = useRef<HTMLElement | null>(null) as MutableRefObject<HTMLDivElement | null>
    useEffect(() => {
        (async () => {
            if (cUser.id !== '-1') {
                // setIsFetching(true)
                const notifications = await getNotificationsHistory(cUser.id)
                setNotifications(notifications)
                // setIsFetching(false)
            }
        })()
    }, [cUser.id, nc.updates])

    if (notifications.length > 0) {
        return <Box clone height='56px' paddingTop='8px' marginRight='-12px'>
            <div ref={ref}>
                <NotificationsPopover
                    open={isOpen} anchorEl={ref.current}
                    notifications={notifications}
                    onClose={() => {
                        setIsOpen(false)
                    }}/>
                <IconButton
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        if (ref.current) {
                            setIsOpen(!isOpen)
                        }
                    }}><NotificationWhiteIcon/></IconButton>
            </div>
        </Box>
    }
    return <Box height='64px'/>
}