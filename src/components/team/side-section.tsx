import React, {Fragment, useCallback, useState} from 'react'
import {AdditionalText, GrayishPlate, GrayPlate, Plate} from '../common'
import {
    Box, Button, ButtonProps,
    CircularProgress, Collapse, createStyles,
    Grid, GridProps, Hidden,
    IconButton, IconButtonProps, makeStyles, Popper, Theme,
    Tooltip,
    Typography, TypographyProps
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {format} from 'date-fns'
import {PlateProps} from '../common/plate'
import {Link} from 'react-router-dom'
import {ReactComponent as LeaveIcon} from '../../assets/team/leave.svg'
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

    const leaderName = cUser.team.teamLead.id === cUser.id ? 'Вы' :
        `${cUser.team.teamLead.firstName} ${cUser.team.teamLead.lastName}`

    const toolTipMessage = cUser.team.teamLead.id === cUser.id ?
        'Теперь Вы можете принимать решение о приеме и отклонении заявок, а также исключать членов команды' :
        'Лидер команды может принимать решение о приеме и отклонении заявок, а также исключать членов команды'

    return <Tooltip
        title={toolTipMessage}>
        <div>
            <Typography {...props}>
                <b>{leaderName}</b> &mdash; Лидер команды
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
                        <Grid item container>
                            <GrayPlate>
                                <AdditionalText>
                                    Скоро здесь будет кое-что
                                </AdditionalText>
                            </GrayPlate>
                        </Grid>
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
                            className={classes.button}>
                    ?
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
                            Член команды с наибольшим числом голосов становится лидером команды.
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

const VotingItem: React.FC<{ user: User }> = ({user}) => {

    const {cUser, cEvent} = useAppState()
    const team = cUser.team
    const didVote = team.myVote === user.id
    const {enqueueSnackbar} = useSnackbar()
    const nc = useNotificationHandlers()
    const pModal = usePromptModal()
    const [isKicking, setIsKicking] = useState(false)
    const [isVoting, setIsVoting] = useState(false)
    const isFetching = isKicking || isVoting

    const onVote = useCallback(async () => {
        setIsVoting(true)
        if (cUser.team.myVote !== user.id && cUser.team.myVote !== '-1' && cUser.team.myVote) {
            // const didUnVote = await unVoteFor(cUser.team.myVote, cEvent.id, cUser.team.id ?? '-1')
            const didVote = await voteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (didVote) {
                //nop
            } else {
                enqueueSnackbar('Не удалось проголосовать', {
                    variant: 'error'
                })
            }
        } else if (cUser.team.myVote === user.id) {
            const didUnVote = await unVoteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (didUnVote) {
                //nop
            } else {
                enqueueSnackbar('Не удалось забрать голос', {
                    variant: 'error'
                })
            }
        } else {
            const didVote = await voteFor(user.id, cEvent.id, cUser.team.id ?? '-1')
            if (didVote) {
                //nop
            } else {
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
            <Link to={`user/${user.id}`} style={{textDecoration: 'none'}}>
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
                <Grid xs item container direction='column'>
                    <Typography>{user.firstName} {user.lastName}</Typography>
                    <AdditionalText
                        style={{
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            hyphens: 'auto'
                        }}>
                        Голосование
                    </AdditionalText>
                </Grid>
            </Box>
            <Grid item>
                {user.id !== cUser.id &&
                <IconButton disabled={isFetching} onClick={() => {
                    onVote()
                }}>
                  <Box clone width={{xs: '24px', md: '48px'}}
                       height={{xs: '24px', md: '48px'}}>
                    <VoteIcon active={didVote}/>
                  </Box>
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
    return <Fragment>
        <Hidden xsDown>
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
                    <Box clone margin='16px -16px -16px -16px'>
                        <VotingDesktop/>
                    </Box>
                </EventDetails></Grid>
            </Box>
        </Hidden>
        <Hidden smUp>
            <MobileSide/>
        </Hidden>
    </Fragment>
}