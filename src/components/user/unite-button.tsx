import React, {useCallback, useEffect, useState} from 'react'
import {PrimaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'
import {invitePerson} from '../../model/api'
import {useSnackbar} from 'notistack'

const useUnite = () => {
    const {user, cUser} = useAppState()
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

        invitePerson(user.id, cUser.id).then((wasInvited?: boolean) => {
            if (wasInvited) {
                user.change({isInvited: true})
            } else {
                enqueueSnackbar('Не удалось предложить объединиться', {
                    variant: 'error',
                    preventDuplicate: true,
                })
            }
            setActionId(null)
        })
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionId])

    return {
        onClick,
        isFetching: actionId === user.id + cUser.id,
    }
}


export const UniteButton: React.FC = () => {

    const {onClick, isFetching} = useUnite()

    const {user} = useAppState()

    if (user.isNullUser) {
        return <PrimaryButton disabled/>
    }

    if (isFetching) {
        return <PrimaryButton disabled>
            Подождите...
        </PrimaryButton>
    }

    if (user.isInvited) {
        return <PrimaryButton disabled>
            Заявка отправлена
        </PrimaryButton>
    }

    return <PrimaryButton onClick={onClick}>
        {user.inTeam ? 'Присоединиться' : 'Объединиться'}
    </PrimaryButton>
}