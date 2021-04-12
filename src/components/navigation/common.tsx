import React, {
    MouseEventHandler,
    ReactElement,
    useCallback,
    useEffect,
    useState
} from 'react'
import {Link, LinkProps} from 'react-router-dom'
import {
    CircularProgress,
    Grid,
    IconButton,
    useTheme,
    Box, makeStyles, createStyles, Typography, Switch, withStyles, Theme
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {LabelText, GrayishPlate} from '../common'
import {ReactComponent as OpenIcon} from '../../assets/navigation/open.svg'
import {ReactComponent as CloseIcon} from '../../assets/navigation/close.svg'
import {Hackathon} from '../tools/use-app-state/hackathon'
import {getActiveEvents, getHostEvents} from '../../model/api'
import {useHistory} from 'react-router-dom'
import Image from 'material-ui-image'
import logoImage from '../../assets/navigation/teamup.svg'

export const NavLink: React.FC<LinkProps & { wrap?: boolean, icon?: ReactElement }> = ({children, wrap, icon, ...props}) => {
    const theme = useTheme()
    if (icon) {
        return <Box clone color={theme.typography.body2.color} marginTop={2}
                    padding='3px'>
            <Link {...props}
                  style={{textDecoration: 'none', ...(props.style || {})}}>
                <Grid container alignItems='center'>
                    <Box clone width={24} height={24}>
                        <Grid item>
                            {icon}
                        </Grid>
                    </Box>
                    <Grid item>
                        <LabelText noWrap={!wrap} style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            paddingLeft: 8
                        }}>
                            {children}
                        </LabelText>
                    </Grid>
                </Grid>
            </Link>
        </Box>
    }
    return <Box clone color={theme.typography.body2.color} marginTop={2}>
        <Link {...props}
              style={{textDecoration: 'none', ...(props.style || {})}}>
            <LabelText noWrap={!wrap} style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: 8
            }}>
                {children}
            </LabelText>
        </Link>
    </Box>
}

export const ExtLink: React.FC<{ href: string }> = ({children, href}) => {
    const theme = useTheme()
    return <Box clone color={theme.typography.body2.color} marginTop={2}>
        <a href={href} style={{textDecoration: 'none'}}>
            <LabelText style={{
                paddingLeft: 8
            }}>
                {children}
            </LabelText>
        </a>
    </Box>
}

export type MenuProps = {
    onClick: MouseEventHandler
}

export const MenuBase: React.FC = ({children}) => {
    return <Box display='flex' height='100%'
                maxHeight={1040}
                flexDirection='column'>
        <Link to='/'>
            <Box display='flex' justifyContent='center'><Image style={{
                paddingTop: 40,
                width: 113,
                background: 'none'
            }} src={logoImage} onDragStart={e => e.preventDefault()}/></Box>
        </Link>
        {children}
    </Box>
}

export type EventLinkProps = {
    onClick?: MouseEventHandler
    onEventChange?: () => void
}

const useEventItemStyles = makeStyles(createStyles({
    root: {
        cursor: 'pointer',
        transition: '.1s',
        borderRadius: 4,
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,.05)'
        }
    }
}))
const EventItem: React.FC<{
    event: Hackathon, onClick?: MouseEventHandler
}> = ({event, onClick}) => {

    const classes = useEventItemStyles()
    return <Grid item xs zeroMinWidth className={classes.root}
                 onClick={onClick}>
        <Box clone paddingLeft='8px' overflow='hidden'>
            <LabelText noWrap>
                {event.name || ''}
            </LabelText>
        </Box>
    </Grid>
}
export const EventLink: React.FC<EventLinkProps> = (props) => {
    const theme = useTheme()
    const {cEvent, cUser} = useAppState()
    const [isOpen, setIsOpen] = useState(false)
    const [events, setEvents] = useState<Hackathon[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()

    const onClick = useCallback(async () => {
        setIsOpen(!isOpen)
        setIsLoading(true)
        const [e1, e2] = await Promise.all([getActiveEvents(cUser.id), getHostEvents()])
        const ids: {[key: string]: boolean} = {}
        const x = [...e1, ...e2].filter((e) => {
            if(!ids[e.id]) {
                ids[e.id] = true
                return e.id !== cEvent.id
            }
            return false
        })
        setEvents(x)
        setIsLoading(false)
    }, [setIsOpen, isOpen])

    useEffect(() => {
        if (cUser.id === '-1') {
            setIsOpen(false)
        }
    }, [cUser.id])
    let toRender = null

    if (events.length && isOpen) {
        toRender = events.map(e => <EventItem
            key={e.id}
            event={e}
            onClick={(ev) => {
                setIsOpen(false)
                props.onClick?.(ev)
                history.push(`/event/${e.id}`)
            }}
        />)
    } else if (isOpen) {
        toRender = <LabelText style={{paddingLeft: 12}}>
            Здесь будут мероприятия, в которых Вы участвуете
        </LabelText>
    }
    if (isLoading) {
        toRender = <Grid item container alignItems='center' justify='center'>
            <CircularProgress size='3rem'/>
        </Grid>
    }

    return <Box clone color={theme.typography.body2.color} marginTop={2}>
        <GrayishPlate padding={8} style={{
            borderRadius: '10px'
        }}>
            <Grid container direction='column' spacing={1}>
                <Grid item container alignItems='center' justify='flex-end'
                      wrap='nowrap'>
                    <Grid item xs style={{minHeight: 21}}>
                        <NavLink wrap
                                 to={cEvent.id === '-1' ? `/` : `/event/${cEvent.id}`}
                                 onClick={(ev) => {
                                     setIsOpen(false)
                                     props.onClick?.(ev)
                                 }}>
                            {cEvent.name || (isLoading ? '' : 'Нет активного мероприятия')}
                        </NavLink>
                    </Grid>
                    <Box clone paddingLeft='12px' width={42}>
                        <Grid item>
                            {cUser.id !== '-1' &&
                            <IconButton size='small' onClick={onClick}>
                                {isOpen ? <CloseIcon/> : <OpenIcon/>}
                            </IconButton>
                            }
                        </Grid>
                    </Box>
                </Grid>
                {toRender}
            </Grid>
        </GrayishPlate>
    </Box>
}

const AntSwitch = withStyles((theme: Theme) =>
    createStyles({
        root: {},
        switchBase: {
            color: theme.palette.primary.main,
            backgroundColor: 'none',
            '&$checked': {
                transform: 'translateX(10px)',
                color: theme.palette.primary.main,
                // color: theme.palette.common.white,
                '& + $track': {
                    opacity: 1
                    // backgroundColor: theme.palette.primary.main,
                    // borderColor: theme.palette.primary.main,
                }
            }
        },
        thumb: {
            width: 10,
            height: 10,
            boxShadow: 'none'
        },
        track: {
            // border: `1px solid ${theme.palette.grey[500]}`,
            opacity: 0.1,
            backgroundColor: 'transparent',
            '&$checked': {
                backgroundColor: 'transparent'
            }
            // backgroundColor: theme.palette.common.white,
        },
        checked: {}
    })
)(Switch)

export const HostModeToggler: React.FC = () => {
    const {settings} = useAppState()

    const r = settings.isHostMode ?
        <Grid item>
            <Typography
                style={{fontSize: 13, height: 18, cursor: 'default'}}> Режим
                организатора</Typography>
            <Typography style={{
                fontSize: 13,
                height: 18,
                color: '#818C99',
                cursor: 'pointer'
            }}
                        onClick={() => {
                            settings.setIsHostMode(false)
                        }}>
                Режим участника
            </Typography>
        </Grid>
        :
        <Grid item>
            <Typography style={{
                fontSize: 13,
                height: 18,
                color: '#818C99',
                cursor: 'pointer'
            }}
                        onClick={() => {
                            settings.setIsHostMode(true)
                        }}
            >
                Режим организатора
            </Typography>
            <Typography style={{fontSize: 13, height: 18, cursor: 'default'}}>Режим
                участника</Typography>
        </Grid>
    return <Grid container wrap='nowrap'>
        <Grid item style={{
            transform: 'rotate(-90deg)'
        }}>
            <AntSwitch size="small" color='primary'
                       checked={settings.isHostMode}
                       onChange={() => {
                           settings.setIsHostMode(!settings.isHostMode)
                       }}/>
        </Grid>
        {r}
    </Grid>
    // return <Button style={{
    //     textTransform: 'none'
    // }} onClick={() => {
    //     settings.setIsHostMode(!settings.isHostMode)
    // }}>
    //     <AdditionalText color={settings.isHostMode ? 'primary' : 'initial'}>
    //         Режим организатора
    //     </AdditionalText>
    // </Button>
}