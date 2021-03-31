import React, {useCallback, useEffect, useState} from 'react'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'
import {useSearchModal} from '../modals/search'
import {useSnackbar} from 'notistack'
import {finishEvent, joinEvent, leaveEvent} from '../../model/api'
import {ButtonGroup, makeStyles} from '@material-ui/core'
import {ReactComponent as CancelIcon} from '../../assets/cancel.svg'
import {usePromptModal} from '../modals/prompt'
import {useEventEditModal} from '../modals/event-edit'
import {HOST_DOMAIN, PREFIX} from '../../config/network'

const useParticipate = () => {
    const {event, cUser} = useAppState()

    const [actionId, setActionId] = useState<string | null>(null)

    const {enqueueSnackbar} = useSnackbar()

    const sModal = useSearchModal()
    const pModal = usePromptModal()
    const eModal = useEventEditModal()
    const onClick = useCallback(() => {
        if (!event.isParticipating) {
            setActionId(event.id + cUser.id)
        } else {
            sModal.actions.open()
        }
    }, [sModal.actions, event.id, cUser.id, event.isParticipating, setActionId])

    useEffect(() => {
        if (actionId === null) return

        joinEvent(cUser.id, event.id).then((didJoin?: boolean) => {
            if (didJoin) {
                event.change({isParticipating: true})
                enqueueSnackbar(`Вы участвуете в мероприятии ${event.name}`, {
                    variant: 'success'
                })
                sModal.actions.open()
            } else {
                enqueueSnackbar('Не удалось присоединиться к мероприятию', {
                    variant: 'error'
                })
            }
            setActionId(null)
        })
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionId])

    const onLeaveClick = useCallback(async () => {
        pModal.open({
            message: 'Отказаться от участия в мероприятии?',
            accept: 'Отказаться',
            decline: 'Продолжить участие',
            onSubmit: async () => {
                const didLeave = await leaveEvent(cUser.id, event.id)
                if (didLeave) {
                    event.change({isParticipating: false})
                    pModal.close()
                    enqueueSnackbar(`Вы более не участвуете в мероприятии ${event.name}`)

                } else {
                    enqueueSnackbar(`Не удалось покинуть мероприятие`, {
                        variant: 'error'
                    })
                    pModal.close()
                }
            }
        })

    }, [enqueueSnackbar, pModal, cUser.id, event])

    const onSetWinnersClick = useCallback((e) => {
        eModal.open(e)
    }, [])

    const onFinishClick = useCallback(async () => {
        const didFinish = await finishEvent(event.id)
        if (didFinish) {
            event.change({isFinished: true})
            enqueueSnackbar('Мероприятие завершено', {variant: 'success'})
        } else {
            enqueueSnackbar('Не удалось завершить меропритяие', {
                variant: 'error'
            })
        }
    }, [event.id])

    return {
        onClick,
        onLeaveClick,
        isFetching: actionId === event.id + cUser.id,
        onFinishClick,
        onSetWinnersClick
    }
}

const useStyles = makeStyles({
    startIcon: {
        margin: 0
    }
})
export const ParticipateButton: React.FC = () => {
    const {event, cUser} = useAppState()
    const {isFetching, onClick, onLeaveClick, onFinishClick, onSetWinnersClick} = useParticipate()
    const classes = useStyles()

    if (event.isNullEvent) {
        return <SecondaryButton disabled/>
    }
    if (isFetching) {
        return <SecondaryButton disabled>
            Подождите...
        </SecondaryButton>
    }

    if (event.founderId === cUser.id && !event.isFinished) {
        return <PrimaryButton onClick={onFinishClick}>
            Завершить мероприятие
        </PrimaryButton>
    }

    if (event.founderId === cUser.id && event.isFinished) {
        return <PrimaryButton onClick={onSetWinnersClick}>
            Выбрать победителей
        </PrimaryButton>
    }

    if (event.isFinished) {
        return <SecondaryButton disabled>
            Мероприятие завершено
        </SecondaryButton>
    }
    if (cUser.isNotAuthorized) {
        const pageUrl = window.location.pathname.replace('/', '')
        return <a href={`${HOST_DOMAIN}${PREFIX}/redirect?backTo=${pageUrl}`}
                  style={{
                      textDecoration: 'none',
                      width: '100%',
                      flex: '1 1 0%',
                      display: 'flex'
                  }}><SecondaryButton style={{flex: 1}}>
            Участвовать
        </SecondaryButton>
        </a>
    }

    if (event.isParticipating) {
        return <ButtonGroup variant="contained" color="secondary">
            <SecondaryButton style={{flex: 1}} onClick={onClick}>
                Найти команду
            </SecondaryButton>
            <SecondaryButton classes={classes} startIcon={<CancelIcon/>}
                             onClick={onLeaveClick}>
            </SecondaryButton>
        </ButtonGroup>
    }

    return <SecondaryButton onClick={onClick}>
        Участвовать
    </SecondaryButton>
}