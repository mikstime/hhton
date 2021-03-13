import React, {useCallback, useEffect, useState} from 'react'
import {PrimaryButton, SecondaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'
import {invitePerson} from '../../model/api'
import {useSnackbar} from 'notistack'
import {Link} from 'react-router-dom'

const useUnite = () => {
    const {event, user, cUser} = useAppState()
    const [actionId, setActionId] = useState<string | null>(null)


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

        invitePerson(event.id, user.id, cUser.id).then((wasInvited?: boolean) => {
            if (wasInvited) {
                user.change({isInvited: true})
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


export const UniteButton: React.FC = () => {

    const {onClick, isFetching} = useUnite()

    const {cUser, user} = useAppState()

    if (user.isNullUser || !user.team) {
        return <PrimaryButton disabled/>
    }

    if (isFetching) {
        return <PrimaryButton disabled>
            Подождите...
        </PrimaryButton>
    }
    if (user.inMyTeam || user.id === cUser.id) {
        return <Link to='/team' style={{textDecoration: 'none'}}>
            <SecondaryButton style={{width: '100%'}}>
                Управление командой
            </SecondaryButton>
        </Link>
    }

    if (user.isInvited) {
        return <PrimaryButton disabled>
            Заявка отправлена
        </PrimaryButton>
    }

    return <PrimaryButton onClick={onClick}>
        {user.team ? 'Присоединиться' : 'Объединиться'}
    </PrimaryButton>
}