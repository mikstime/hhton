import React, {useCallback, useEffect, useState} from 'react'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'
import {useSearchModal} from '../modals/search'
import {useSnackbar} from 'notistack'
import {
    finishEvent,
    getEventSecret,
    joinEvent,
    leaveEvent
} from '../../model/api'
import {ButtonGroup, makeStyles} from '@material-ui/core'
import {ReactComponent as CancelIcon} from '../../assets/cancel.svg'
import {usePromptModal} from '../modals/prompt'
import {useEventEditModal} from '../modals/event-edit'
import {HOST_DOMAIN, PREFIX} from '../../config/network'
import {useNotificationHandlers} from '../tools/notification-handlers'
import {useLocation} from 'react-router-dom'
import {useJoinModal} from '../modals/join-modal'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const useParticipate = () => {
    const {event, cEvent, cUser} = useAppState()
    const nc = useNotificationHandlers()
    const jModal = useJoinModal()
    const [actionId, setActionId] = useState<string | null>(null)

    //@ts-ignore
    let query = useQuery()
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
        if (event.isPrivate) {
            const participate = (secret: string) => {
                joinEvent(cUser.id, event.id, secret).then((didJoin?: boolean) => {
                    if (didJoin) {
                        event.change({isParticipating: true})
                        cEvent.change({isParticipating: true})
                        enqueueSnackbar(`Вы участвуете в мероприятии ${event.name}`, {
                            variant: 'success'
                        })
                        sModal.actions.open()
                        setActionId(null)
                        nc.update()
                    } else {
                        jModal.open()
                        setActionId(null)
                    }
                })
            }
            const secret = query.get('secret') || ''
            if(!secret) {
                getEventSecret(event.id).then(secret => {
                    participate(secret)
                })
            } else {
                participate(secret)
            }

        } else {
            joinEvent(cUser.id, event.id).then((didJoin?: boolean) => {
                if (didJoin) {
                    event.change({isParticipating: true})
                    cEvent.change({isParticipating: true})
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
                nc.update()
            })
        }
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
                    cEvent.change({isParticipating: false})
                    pModal.close()
                    enqueueSnackbar(`Вы более не участвуете в мероприятии ${event.name}`)

                } else {
                    enqueueSnackbar(`Не удалось покинуть мероприятие`, {
                        variant: 'error'
                    })
                    pModal.close()
                }
                nc.update()
            }
        })

    }, [enqueueSnackbar, pModal, cUser.id, event, nc.update])

    const onSetWinnersClick = useCallback((e) => {
        eModal.open(e)
    }, [])

    const onFinishClick = useCallback(async () => {
        pModal.open({
            message: 'Завершить мероприятие?',
            accept: 'Завершить',
            decline: 'Отмена',
            onSubmit: async () => {
                const didFinish = await finishEvent(event.id)
                if (didFinish) {
                    event.change({isFinished: true})
                    enqueueSnackbar('Мероприятие завершено', {variant: 'success'})
                } else {
                    enqueueSnackbar('Не удалось завершить меропритяие', {
                        variant: 'error'
                    })
                }
                pModal.close()
            }
        })
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
    const {event, cUser, settings} = useAppState()
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

    if (event.founderId === cUser.id && !event.isFinished && settings.isHostMode) {
        return <PrimaryButton onClick={onFinishClick}>
            Завершить мероприятие
        </PrimaryButton>
    }

    if (event.founderId !== cUser.id && !event.isFinished && settings.isHostMode) {
        return <PrimaryButton onClick={() => {
            settings.setIsHostMode(false)
        }}>
            Режим участника
        </PrimaryButton>
    }

    if (event.founderId === cUser.id && event.isFinished && settings.isHostMode) {
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
            Войти через ВКонтакте
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