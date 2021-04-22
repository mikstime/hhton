import React, {Fragment, useCallback, useState} from 'react'
import {AdditionalText, GrayPlate, Plate} from '../common'
import {
    Box,
    CircularProgress, Collapse, createStyles,
    Grid, Hidden,
    IconButton, IconButtonProps, makeStyles, Popper, Theme,
    Tooltip,
    Typography, TypographyProps
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {format} from 'date-fns'
import {PlateProps} from '../common/plate'
import {Link} from 'react-router-dom'
import {ReactComponent as LeaveIcon} from '../../assets/team/leave.svg'
import {ReactComponent as CloseIcon} from '../../assets/team/close.svg'
import leaderIcon from '../../assets/team/leader.svg'
import {ReactComponent as ExpandIcon} from '../../assets/team/expand.svg'
import {ReactComponent as CollapseIcon} from '../../assets/team/collapse.svg'
import {useSnackbar} from 'notistack'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {leaveTeam, unVoteFor, voteFor} from '../../model/api'
import {usePromptModal} from '../modals/prompt'
import {User} from '../tools/use-app-state/user'
import Image from 'material-ui-image/lib/components/Image/Image'
import {ReactComponent as VoteActiveIcon} from '../../assets/team/vote_active.svg'
import {ReactComponent as VoteIconBase} from '../../assets/team/vote.svg'

const SideItem: React.FC<{ title: string, value: string }> = ({title, value}) => (
    <Box clone flexDirection={{xs: 'column', md: 'row'}}>
        <Grid item container>
            <AdditionalText
                style={{width: 140}}>{title}</AdditionalText>
            <Typography
                variant='body1'>{value}</Typography>
        </Grid>
    </Box>
)

export const EventDetails: React.FC<PlateProps> = ({children, ...props}) => {
    const {cEvent} = useAppState()

    if (cEvent.notFound) {
        return null
    }

    if (cEvent.isNullEvent) {
        return <GrayPlate>
            <Grid container justify='center' alignItems='center'>
                <CircularProgress size='3rem'/>
            </Grid>
        </GrayPlate>
    }

    return <GrayPlate padding={16} {...props}>
        <Grid container direction='column' wrap='nowrap' spacing={1}>
            <Grid item>
                <Link to={`event/${cEvent.id}`}
                      style={{textDecoration: 'none'}}>
                    <Typography variant='h1'>
                        {cEvent.name}
                    </Typography>
                </Link>
            </Grid>
            <Box paddingTop={1}/>
            <Grid item container xs spacing={1}>
                <SideItem title='Дата начала:' value={
                    cEvent.settings.start ? format(cEvent.settings.start, 'dd.MM.yyyy') : 'Не известна'
                }/>
                <SideItem title='Дата окончания:' value={
                    cEvent.settings.finish ? format(cEvent.settings.finish, 'dd.MM.yyyy') : 'Не известна'
                }/>
                <SideItem title='Размер команды:' value={
                    cEvent.settings.teamSize ? (cEvent.settings.teamSize + ' чел. ') : 'любой'
                }/>
            </Grid>
        </Grid>
        {children}
    </GrayPlate>
}

export const LeadDetails: React.FC<TypographyProps> = (props) => {
    const {cUser} = useAppState()

    if (!cUser.team.teamLead) {
        return null
    }
    const fName = cUser.team.teamLead.firstName.length > 17 ?
        cUser.team.teamLead.firstName.slice(0, 14) + '...'
        : cUser.team.teamLead.firstName
    const leaderName = cUser.team.teamLead.id === cUser.id ? 'Вы' :
        `${fName ?? ''} ${cUser.team.teamLead.lastName[0] ? cUser.team.teamLead.lastName[0] + '.' : ''}`

    const toolTipMessage = cUser.team.teamLead.id === cUser.id ?
        'Теперь Вы можете принимать решение о приеме и отклонении заявок, а также исключать членов команды' :
        'Лидер команды может принимать решение о приеме и отклонении заявок, а также исключать членов команды'

    return <Tooltip
        title={toolTipMessage}>
        <div>
            <Typography {...props}>
                <b>{leaderName.length > 20 ? leaderName.slice(0, 17) + '...' : leaderName}</b> &mdash; Лидер
                команды
            </Typography>
        </div>
    </Tooltip>

}

const LeaveButton: React.FC = () => {
    const {cUser} = useAppState()
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const pModal = usePromptModal()
    const onClick = useCallback(async () => {
        pModal.open({
            onSubmit: async () => {
                if (cUser.team.id) {
                    const didLeave = await leaveTeam(cUser.team.id)
                    if (didLeave) {
                        enqueueSnackbar('Вы покинули команду', {
                            variant: 'success'
                        })
                    } else {
                        enqueueSnackbar('Не удалось покинуть команду', {
                            variant: 'error'
                        })
                    }
                } else {
                    enqueueSnackbar('Не удалось покинуть команду', {
                        variant: 'error'
                    })
                }
                pModal.close()
                nc.update()
            },
            message: 'Выйти из команды?',
            accept: 'Покинуть',
            decline: 'Остаться'
        })
    }, [cUser.team.id, nc.update, enqueueSnackbar, pModal.open])

    if (!cUser.team.teamLead) {
        return null
    }

    return <IconButton size='small' onClick={onClick}>
        <LeaveIcon/>
    </IconButton>
}

const OpenButton: React.FC<{ isOpen?: boolean } & IconButtonProps> = ({isOpen, ...props}) => {
    return <IconButton {...props}>
        {isOpen ? <CollapseIcon/> : <ExpandIcon/>}
    </IconButton>
}
const MobileSide: React.FC = () => {
    const {cUser} = useAppState()
    const [isOpen, setIsOpen] = useState(false)

    if (!cUser.team.members.length) {
        return null
    }
    // @ts-ignore
    return <Grid item container direction='column' wrap='nowrap'>
        <Box clone height='48px' style={{zIndex: 2}} padding='16px'>
            <Grid item container alignItems='center' wrap='nowrap'>
                <Grid item xs zeroMinWidth>
                    <LeadDetails noWrap/>
                </Grid>
                <Grid item>
                    <OpenButton size='small' isOpen={isOpen} onClick={() => {
                        setIsOpen(!isOpen)
                    }}/>
                </Grid>
            </Grid>
        </Box>
        <Box clone marginTop={isOpen ? '' : '-48px'} minHeight='16px'
             style={{transition: '.5s'}}>
            <Plate padding={16}>
                <Collapse in={isOpen}>
                    <Grid item container direction='column' wrap='nowrap'>
                        <VotingHeader/>
                        <Voting/>
                        <Box paddingTop={1}/>
                        <Grid item container>
                            <Box flex={1}/><LeaveButton/>
                        </Grid>
                    </Grid>
                </Collapse>
            </Plate>
        </Box>
    </Grid>
}

const useVotingStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            width: 24,
            height: 24,
            padding: 0,
            fontSize: '13px',
            borderRadius: '50%',
            background: '#F0F2F5',
            border: '1px solid #EDEDED'
        }
    })
)

const VotingDesktop: React.FC<PlateProps> = (props) => {
    return <Plate padding={16} elevation={4} {...props}>
        <Grid container direction='column' wrap='nowrap'>
            <VotingHeader/>
            <Voting/>
        </Grid>
    </Plate>
}
const VotingHeader: React.FC = () => {
    const classes = useVotingStyles()
    const [isOpen, setIsOpen] = useState(false)
    return <Fragment>
        <Grid item container>
            <Grid item xs>
                <Typography variant='h2'>
                    Голосование за лидера
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size='small'
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                setIsOpen(!isOpen)
                            }}
                            className={classes.button}
                            style={{
                                transition: '.3s',
                                backgroundColor: '#F5F5F5',
                                marginBottom: isOpen ? '-40px' : ''
                            }}
                >
                    {isOpen ? <CloseIcon/> : '?'}
                </IconButton>
            </Grid>
        </Grid>
        <Collapse in={isOpen}>
            <Box clone paddingTop={1}>
                <Grid item container>
                    <GrayPlate padding={8}>
                        <Typography variant='body2'>
                            Лидер команды может принимать решение о приеме и
                            отклонении заявок, а также исключать членов
                            команды.<br/>
                            Член команды с наибольшим числом голосов становится
                            лидером команды.
                        </Typography>
                    </GrayPlate>
                </Grid>
            </Box>
        </Collapse>
    </Fragment>
}

const VoteIcon: React.FC<{ active: boolean }> = ({active, ...props}) => {
    return active ? <VoteActiveIcon {...props}/> : <VoteIconBase {...props}/>
}

const getVotingText = (v: number, my: boolean): string => {
    let res = ''

    switch (true) {
        case v === 0:
            res += 'Нет голосов'
            break
        case v >= 5 && v <= 20:
            res += `${v} голосов`
            break
        case v % 10 === 1:
            res += `${v} голос`
            break
        case v % 10 >= 2 && v % 10 <= 4:
            res += `${v} голоса`
            break
        default:
            res += `${v} голосов`
            break
    }

    if (my && v >= 1) {
        res += ', включая Ваш'
    }

    return res
}

const useVotingItemStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        textDecoration: 'none',
        position: 'relative',
        '&:after': {
            content: `''`,
            top: -12,
            right: -12,
            zIndex: 2,
            width: 24,
            height: 24,
            position: 'absolute',
            backgroundImage: `url("${leaderIcon}")`,
            transform: 'rotate(45deg)',
            backgroundSize: '80%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
    },
    rootD: {
        textDecoration: 'none'
    }
}))
const VotingItem: React.FC<{ user: User }> = ({user}) => {

    const classes = useVotingItemStyles()
    const {cUser, cEvent} = useAppState()
    const team = cUser.team
    const didVote = team.myVote === user.id
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const [isVoting, setIsVoting] = useState(false)
    const isFetching = isVoting

    const onVote = useCallback(async () => {
        if (isVoting) return

        setIsVoting(true)
        if (cUser.team.myVote === user.id) {
            const didUnVote = await unVoteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (!didUnVote) {
                enqueueSnackbar('Не удалось забрать голос', {
                    variant: 'error'
                })
            }
        } else {
            const didVote = await voteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (!didVote) {
                enqueueSnackbar('Не удалось проголосовать', {
                    variant: 'error'
                })
            }
        }
        setIsVoting(false)
        nc.update()
    }, [enqueueSnackbar, cEvent.id, cUser.team.id, user.id, nc.update, cUser.team.myVote])

    return <Box clone paddingTop={1}>
        <Grid item container xs>
            <Link to={`user/${user.id}`}
                  className={(team.teamLead?.id ?? '') === user.id ? classes.root : classes.rootD}>
                <Grid item style={{width: 48}}>
                    <Image src={user.avatar} style={{
                        width: 48,
                        paddingTop: 48,
                        borderRadius: 4
                    }} imageStyle={{
                        width: 48,
                        height: 48,
                        objectFit: 'cover',
                        borderRadius: 4
                    }}/>
                </Grid>
            </Link>
            <Box clone paddingLeft={1}>
                <Grid xs item container direction='column' wrap='nowrap'>
                    <Grid item xs zeroMinWidth style={{maxWidth: 150}}>
                        <Typography
                            noWrap>{user.firstName} {user.lastName}</Typography>
                    </Grid>
                    <Grid item xs>
                        <AdditionalText
                            style={{
                                wordWrap: 'break-word',
                                wordBreak: 'break-word',
                                hyphens: 'auto'
                            }}>
                            {getVotingText(team.votes?.[user.id] ?? 0, didVote)}
                        </AdditionalText>
                    </Grid>
                </Grid>
            </Box>
            <Grid item container style={{width: 30}} alignItems='center'>
                {user.id !== cUser.id &&
                <IconButton size='small' disabled={isFetching} onClick={() => {
                    onVote()
                }}>
                  <VoteIcon active={didVote}/>
                </IconButton>
                }
            </Grid>
        </Grid>
    </Box>
}
const Voting: React.FC = () => {

    const {cUser} = useAppState()
    const members = cUser.team.members

    const toRender = members.map((m, i) => {
        return <VotingItem user={m} key={i}/>
    })
    return <Fragment>
        {toRender}
    </Fragment>
}
export const SideSection: React.FC = () => {
    const {cUser} = useAppState()
    return <Fragment>
        <Hidden smDown>
            <Box style={{overflowY: 'auto', maxHeight: 'calc(100vh - 100px)'}}>
                <Box clone minHeight='40px' paddingTop='10px'>
                    <Grid item container alignItems='center'>
                        <Grid item xs>
                            <LeadDetails/>
                        </Grid>
                        <LeaveButton/>
                    </Grid>
                </Box>
                <Box paddingTop={1}/>
                <Grid item><EventDetails>
                    {cUser.team.members.length > 0 &&
                    <Box clone margin='16px -16px -16px -16px'>
                      <VotingDesktop/>
                    </Box>}
                </EventDetails></Grid>
            </Box>
        </Hidden>
        <Hidden mdUp>
            <MobileSide/>
        </Hidden>
    </Fragment>
}