import React, {MouseEventHandler, useCallback, useEffect, useState} from 'react'
import {Link, LinkProps} from 'react-router-dom'
import {
    CircularProgress,
    Grid,
    IconButton,
    useTheme,
    Box, makeStyles, createStyles
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {AdditionalText, GrayishPlate} from '../common'
import {ReactComponent as OpenIcon} from '../../assets/navigation/open.svg'
import {ReactComponent as CloseIcon} from '../../assets/navigation/close.svg'
import {Hackathon} from '../tools/use-app-state/hackathon'
import {getActiveEvents} from '../../model/api'
import {useHistory} from 'react-router-dom'
import Image from 'material-ui-image'
import logoImage from '../../assets/navigation/logo.png'

export const NavLink: React.FC<LinkProps & { wrap?: boolean }> = ({children, wrap, ...props}) => {
    const theme = useTheme()
    return <Box clone color={theme.typography.body2.color} marginTop={3}>
        <Link {...props}
              style={{textDecoration: 'none', ...(props.style || {})}}>
            <AdditionalText noWrap={!wrap} style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                paddingLeft: 8
            }}>
                {children}
            </AdditionalText>
        </Link>
    </Box>
}

export const ExtLink: React.FC<{ href: string }> = ({children, href}) => {
    const theme = useTheme()
    return <Box clone color={theme.typography.body2.color} marginTop={3}>
        <a href={href} style={{textDecoration: 'none'}}>
            <AdditionalText style={{
                paddingLeft: 8
            }}>
                {children}
            </AdditionalText>
        </a>
    </Box>
}

export type MenuProps = {
    onClick: MouseEventHandler
}

export const MenuBase: React.FC = ({children}) => {
    return <Box display='flex'
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
            <AdditionalText noWrap>
                {event.name || ''}
            </AdditionalText>
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
        const e = await getActiveEvents(cUser.id)
        setEvents(e.filter((e: Hackathon) => e.id !== cEvent.id))
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
        toRender = <AdditionalText align='center'>
            Здесь будут мероприятия, в которых Вы участвуете
        </AdditionalText>
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
                        <NavLink wrap to={`/event/${cEvent.id}`}
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