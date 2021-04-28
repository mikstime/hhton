import React, {useCallback, useEffect, useState} from 'react'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'
import {
    acceptInvite, declineInvite,
    invitePerson
} from '../../model/api'
import {useSnackbar} from 'notistack'
import {Link} from 'react-router-dom'
import {ButtonGroup, makeStyles, Tooltip} from '@material-ui/core'
import {ReactComponent as CancelIcon} from '../../assets/cancel.svg'
import {usePromptModal} from '../modals/prompt'
import {useHistory} from 'react-router-dom'
import {useNotificationHandlers} from '../tools/notification-handlers'

const useUnite = () => {
    const {cEvent, user, cUser} = useAppState()
    const [actionId, setActionId] = useState<string | null>(null)

    const nc = useNotificationHandlers()
    const {enqueueSnackbar} = useSnackbar()


    const onClick = useCallback(() => {
        if (user.isNullUser) return
        if (user.isInvited) return

        const id = user.id + cUser.id
        setActionId(id)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, cUser, setActionId])

    useEffect(() => {
        if (actionId === null) return

        invitePerson(cEvent.id, cUser.id, user.id).then((wasInvited?: boolean) => {
            if (wasInvited) {
                user.change({isInvited: true})
                nc.update()
            } else {
                enqueueSnackbar('Не удалось предложить объединиться', {
                    variant: 'error',
                    preventDuplicate: true
                })
            }
            setActionId(null)
        })
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionId])

    return {
        onClick,
        isFetching: actionId === user.id + cUser.id
    }
}

const useStyles = makeStyles({
    startIcon: {
        margin: 0
    }
})

export const UniteButton: React.FC = () => {

    const nc = useNotificationHandlers()
    const classes = useStyles()
    const {onClick, isFetching} = useUnite()
    const {cUser, cEvent, user, invites, settings} = useAppState()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const pModal = usePromptModal()

    if (cEvent.isNullEvent || cEvent.notFound) {
        return null
    }

    if (user.isNullUser || !user.team || user.isLoading) {
        return <PrimaryButton disabled/>
    }

    if (isFetching) {
        return <PrimaryButton disabled>
            Подождите...
        </PrimaryButton>
    }

    if(settings.isHostMode) {
        return <PrimaryButton style={{width: '100%'}} onClick={() => {
            settings.setIsHostMode(false)
        }}>
            Режим участника
        </PrimaryButton>
    }

    if (user.isInvited) {
        return <PrimaryButton disabled>
            Заявка отправлена
        </PrimaryButton>
    }

    const inMyTeam = user.team && user.team.members.find(u => u.id === cUser.id)

    const onDeclineClick = () => {
        pModal.open({
            message: 'Отклонить заявку?',
            accept: 'Да',
            decline: 'Оставить заявку',
            onSubmit: async () => {
                const didDecline = await declineInvite(cEvent.id, cUser.id, user.id)
                nc.update()
                if (didDecline) {
                    enqueueSnackbar(`Вы отклонили заявку`)
                } else {
                    enqueueSnackbar(`Не удалось отклонить заявку`, {
                        variant: 'error'
                    })
                }
                pModal.close()
            }
        })
    }

    const onUniteClick = async () => {
        const didAccept = await acceptInvite(cEvent.id, cUser.id, user.id)
        nc.update()
        if(didAccept) {
            history.push('/team')
            enqueueSnackbar(`Вы объединились`)
        } else {
            enqueueSnackbar(`Не удалось принять заявку`, {
                variant: 'error'
            })
        }
    }

    if(!cEvent.isParticipating) {
        return <Link to={`/event/${cEvent.id}`} style={{textDecoration: 'none'}}>
            <SecondaryButton style={{width: '100%'}}>
                К регистрации
            </SecondaryButton>
        </Link>
    }

    if ((user.id === cUser.id || inMyTeam)) {
        return <Link to='/team' style={{textDecoration: 'none'}}>
            <SecondaryButton style={{width: '100%'}}>
                Управление командой
            </SecondaryButton>
        </Link>
    }

    const didInviteMe = !!invites.i.team.find(t => t.team.members.find(tt => user.id.toString() === tt.id))
        || !!invites.i.personal.find(t => t.id.toString() === user.id)

    const canAccept = cUser.team.members.length <= 1 || cUser.isTeamLead
    if(didInviteMe) {
        return <ButtonGroup variant="contained" color="primary">
            <PrimaryButton disabled={!canAccept} style={{flex: 1}} onClick={onUniteClick}>
                Принять
            </PrimaryButton>
            <Tooltip title="Отклонить" aria-label="decline">
            <PrimaryButton disabled={!canAccept} classes={classes} startIcon={<CancelIcon/>}
                             onClick={onDeclineClick}>
            </PrimaryButton>
            </Tooltip>
        </ButtonGroup>
    }

    return <PrimaryButton onClick={onClick}>
        {user.team.members.length > 0 ? 'Присоединиться' : 'Объединиться'}
    </PrimaryButton>
}