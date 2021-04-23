import React, {useCallback, useEffect, useState} from 'react'
import {PersonPlate} from './person-plate'
import {Id, Team, User} from '../tools/use-app-state/user'
import {Grid, GridProps, IconButton, Tooltip, Box} from '@material-ui/core'
import {useAppState} from '../tools/use-app-state'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {useSnackbar} from 'notistack'
import {acceptInvite, banInvite, declineInvite} from '../../model/api'
import {PrimaryButton} from '../common/buttons'
import {BlockIcon, KickIcon} from '../common/icons'
import {usePromptModal} from '../modals/prompt'
import Image from 'material-ui-image'

const useInviteActions = (user: User) => {
    const [isFetching, setIsFetching] = useState(false)
    const {cEvent, cUser, invites} = useAppState()
    const nc = useNotificationHandlers()
    const {enqueueSnackbar} = useSnackbar()
    const pModal = usePromptModal()

    const block = useCallback(() => {
        pModal.open({
            onSubmit: async () => {
                setIsFetching(true)
                const didAccept = await banInvite(cEvent.id, cUser.id, user.id)
                if (didAccept) {
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
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])

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
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])

    const decline = useCallback(async () => {
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
    }, [cUser.id, cEvent.id, user.id, invites, enqueueSnackbar, nc.update])
    return {
        isFetching,
        submit,
        decline,
        block
    }
}

export const IncomingPersonalInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const {cUser} = useAppState()

    const {isFetching, submit, decline, block} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            {...props}
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={block}>
                            <BlockIcon active={false}/>
                        </IconButton>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={decline}>
                            <KickIcon active={true}/>
                        </IconButton>
                    </React.Fragment>}
            bottomElements={!canAccept ? <React.Fragment/> :
                <Grid item container>
                    <Box flex={1}/>
                    <Box clone maxHeight='36px' marginTop='12px'>
                        <PrimaryButton onClick={submit}
                                       disabled={isFetching}>
                            Объединиться
                        </PrimaryButton>
                    </Box>
                </Grid>}
            user={user}/>
    </Grid>
}

const MemberPicker: React.FC<{
    team: Team, current: User, onSelect: (u: User) => void
}> = ({team, current, onSelect}) => {
    const users = [...team.members, ...team.members, ...team.members, ...team.members, ...team.members].map((m, i) =>
        <Box key={i} clone paddingBottom={1}>
            <Grid item>
                <Box clone width={24} height={24}
                     onClick={() => {
                         onSelect(m)
                     }}
                     style={{
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
                               width={current.id === m.id ? 20 : 24} imageStyle={{
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
export const IncomingTeamInvite: React.FC<{ user: User } & GridProps> = ({user, ...props}) => {

    const [selected, setSelected] = useState<User>(user)

    const onSelect = useCallback((u: User) => {
        setSelected(u)
    }, [setSelected, user.team.members, user])

    const {cUser} = useAppState()
    const {isFetching, submit, decline, block} = useInviteActions(user)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead

    return <Grid item xs container {...props}>
        <PersonPlate
            {...props}
            topElements={
                !canAccept ? <React.Fragment/> :
                    <React.Fragment>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={block}>
                            <BlockIcon active={false}/>
                        </IconButton>
                        <IconButton disabled={isFetching}
                                    size='small'
                                    onClick={decline}>
                            <KickIcon active={true}/>
                        </IconButton>
                    </React.Fragment>}
            bottomElements={!canAccept ? <React.Fragment/> :
                <Grid item container>
                    <Box flex={1}/>
                    <Box clone maxHeight='36px' marginTop='12px'>
                        <PrimaryButton onClick={submit}
                                       disabled={isFetching}>
                            Объединиться
                        </PrimaryButton>
                    </Box>
                </Grid>}
            rightElements={<MemberPicker team={cUser.team}
                                         current={selected}
                                         onSelect={onSelect}/>}
            user={selected}/>
    </Grid>
}