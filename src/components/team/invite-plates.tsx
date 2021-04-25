import React, {useCallback, useState} from 'react'
import {PersonPlate} from './person-plate'
import {Team, User} from '../tools/use-app-state/user'
import {
    Grid,
    GridProps,
    IconButton,
    Box,
    makeStyles, ButtonGroup
} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {useSnackbar} from 'notistack'
import {acceptInvite, banInvite, declineInvite, unInvite} from '../../model/api'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {BlockIcon, KickIcon} from '../common/icons'
import {usePromptModal} from '../modals/prompt'
import Image from 'material-ui-image'
import {ReactComponent as CancelIcon} from '../../assets/cancel.svg'
import {ReactComponent as UnBlockIcon} from '../../assets/team/unblock.svg'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const {cEvent, cUser} = useAppState()
    const nc = useNotificationHandlers()
    const {enqueueSnackbar} = useSnackbar()
    const pModal = usePromptModal()

    const block = useCallback(() => {
        pModal.open({
            onSubmit: async () => {
                setIsFetching(true)
                const didBan = await banInvite(cEvent.id, cUser.id, user.id)
                if (didBan) {
                    enqueueSnackbar(`Заявка заблокирована`, {
                        variant: 'error'
                    })
                } else {
                    enqueueSnackbar(`Не удалось заблокировать заявку`, {
                        variant: 'error'
                    })
                }
                setIsFetching(false)
                nc.update()
                pModal.close()
            },
            message: 'Заблокировать входящие заявки от пользователя или команды?',
            accept: 'Заблокировать',
            decline: 'Отмена'
        })
    }, [cUser.id, cEvent.id, user.id, enqueueSnackbar, nc.update])

    const submit = useCallback(async () => {
        setIsFetching(true)
        const didAccept = await acceptInvite(cEvent.id, cUser.id, user.id)
        if (!didAccept) {
            enqueueSnackbar(`Не удалось принять заявку`, {
                variant: 'error'
            })
        }
        setIsFetching(false)
        nc.update()
    }, [cUser.id, cEvent.id, user.id, enqueueSnackbar, nc.update])

    const decline = useCallback(async () => {
        pModal.open({
            onSubmit: async () => {
                setIsFetching(true)
                const didDecline = await declineInvite(cEvent.id, cUser.id, user.id)
                if (didDecline) {
                    enqueueSnackbar(`Заявка отклонена`, {})
                } else {
                    enqueueSnackbar(`Не удалось отклонить заявку`, {
                        variant: 'error'
                    })
                }
                setIsFetching(false)
                nc.update()
                pModal.close()
            },
            message: 'Отклонить данную заявку?',
            accept: 'Отклонить',
            decline: 'Отмена'
        })
    }, [cUser.id, cEvent.id, user.id, enqueueSnackbar, nc.update])

    const cancel = useCallback(async () => {
        setIsFetching(true)
        const didDecline = await unInvite(cEvent.id, cUser.id, user.id)
        if (didDecline) {
            enqueueSnackbar(`Заявка отменена`, {})
        } else {
            enqueueSnackbar(`Не удалось отменить заявку`, {
                variant: 'error'
            })
        }
        setIsFetching(false)
        nc.update()
    }, [cUser.id, cEvent.id, user.id, enqueueSnackbar, nc.update])

    const unblock = useCallback(async () => {
        setIsFetching(true)
        const didUnBan = await declineInvite(cEvent.id, cUser.id, user.id)
        if (!didUnBan) {
            enqueueSnackbar(`Не удалось разблокировать заявку`, {
                variant: 'error'
            })
        }
        setIsFetching(false)
        nc.update()
    }, [cUser.id, cEvent.id, user.id, enqueueSnackbar, nc.update])

    return {
        isFetching,
        submit,
        decline,
        block,
        cancel,
        unblock
    }
}

export const IncomingPersonalInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const classes = useButtonStyles()

    const {cUser} = useAppState()

    const {isFetching, submit, decline, block} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={block}>
                            <BlockIcon active={false}/>
                        </IconButton>
                    </React.Fragment>}
            bottomElements={!canAccept ? <React.Fragment/> :
                <Grid item container>
                    <Box flex={1}/>
                    <Box clone maxHeight='36px' marginTop='12px' width='100%'>
                        <ButtonGroup variant="contained" color="primary">
                            <PrimaryButton
                                disabled={isFetching}
                                style={{flex: 1, height: 36}}
                                onClick={submit}>
                                Объединиться
                            </PrimaryButton>
                            <PrimaryButton
                                classes={classes}
                                disabled={isFetching}
                                style={{height: 36}}
                                startIcon={<CancelIcon/>}
                                onClick={decline}>

                            </PrimaryButton>
                        </ButtonGroup>
                    </Box>
                </Grid>}
            user={user}/>
    </Grid>
}

const MemberPicker: React.FC<{
    team: Team, current: User, onSelect: (u: User) => void
}> = ({team, current, onSelect}) => {
    const users = team.members.map((m, i) =>
        <Box key={i} clone paddingBottom={1}>
            <Grid item>
                <Box clone width={24} height={24}
                     onClick={() => {
                         onSelect(m)
                     }}
                     style={{
                         cursor: 'pointer',
                         borderRadius: 4,
                         border: current.id === m.id ? '1px solid #6D7885' : ''
                     }}>
                    <Grid item>
                        <Image src={m.avatar}
                               style={{
                                   paddingTop: current.id === m.id ? 20 : 24,
                                   border: current.id === m.id ? '1px solid #F5F5F5' : '',
                                   borderRadius: 3,
                                   background: 'transparent'
                               }}
                               width={current.id === m.id ? 20 : 24}
                               imageStyle={{
                                   objectFit: 'cover',
                                   borderRadius: current.id === m.id ? 3 : 4
                               }}/>
                    </Grid>
                </Box>
            </Grid>
        </Box>)

    return <Box clone width='32px !important'>
        <Grid item container direction='column' alignItems='flex-end'
              wrap='nowrap'>
            {users}
        </Grid>
    </Box>
}

const useButtonStyles = makeStyles({
    startIcon: {
        margin: 0
    }
})

export const IncomingTeamInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const classes = useButtonStyles()

    const [selected, setSelected] = useState<User>(user)

    const onSelect = useCallback((u: User) => {
        setSelected(u)
    }, [setSelected, user.team.members, user])

    const {cUser} = useAppState()
    const {isFetching, submit, decline, block} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <Box clone marginTop='-8px' marginBottom='8px'>
                            <IconButton disabled={isFetching}
                                        size='small'
                                        onClick={block}>
                                <BlockIcon active={false}/>
                            </IconButton>
                        </Box>
                    </React.Fragment>}
            bottomElements={!canAccept ? <React.Fragment/> :
                <Grid item container>
                    <Box clone maxHeight='36px' marginTop='12px' width='100%'>
                        <ButtonGroup variant="contained" color="primary">
                            <PrimaryButton
                                disabled={isFetching}
                                style={{flex: 1, height: 36}}
                                onClick={submit}>
                                Объединиться
                            </PrimaryButton>
                            <PrimaryButton
                                classes={classes}
                                disabled={isFetching}
                                style={{height: 36}}
                                startIcon={<CancelIcon/>}
                                onClick={decline}>

                            </PrimaryButton>
                        </ButtonGroup>
                    </Box>
                </Grid>}
            rightElements={<MemberPicker team={cUser.team}
                                         current={selected}
                                         onSelect={onSelect}/>}
            user={selected}/>
    </Grid>
}

export const OutgoingPersonalInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const {cUser} = useAppState()

    const {isFetching, cancel} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={cancel}>
                            <KickIcon active={true}/>
                        </IconButton>
                    </React.Fragment>}
            user={user}/>
    </Grid>
}

export const OutgoingTeamInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const [selected, setSelected] = useState<User>(user)

    const onSelect = useCallback((u: User) => {
        setSelected(u)
    }, [setSelected, user.team.members, user])

    const {cUser} = useAppState()
    const {isFetching, cancel} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <Box clone marginTop='-8px' marginBottom='8px'>
                            <IconButton disabled={isFetching}
                                        size='small'
                                        onClick={cancel}>
                                <KickIcon active={true}/>
                            </IconButton>
                        </Box>
                    </React.Fragment>}
            rightElements={<MemberPicker team={cUser.team}
                                         current={selected}
                                         onSelect={onSelect}/>}
            user={selected}/>
    </Grid>
}

export const BlockedPersonalInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const {cUser} = useAppState()

    const {isFetching, unblock} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={unblock}>
                            <UnBlockIcon/>
                        </IconButton>
                    </React.Fragment>}
            user={user}/>
    </Grid>
}

export const BlockedTeamInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const [selected, setSelected] = useState<User>(user)

    const onSelect = useCallback((u: User) => {
        setSelected(u)
    }, [setSelected, user.team.members, user])

    const {cUser} = useAppState()
    const {isFetching, unblock} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <Box clone marginTop='-8px' marginBottom='8px'>
                            <IconButton disabled={isFetching}
                                        size='small'
                                        onClick={unblock}>
                                <UnBlockIcon/>
                            </IconButton>
                        </Box>
                    </React.Fragment>}
            rightElements={<MemberPicker team={cUser.team}
                                         current={selected}
                                         onSelect={onSelect}/>}
            user={selected}/>
    </Grid>
}