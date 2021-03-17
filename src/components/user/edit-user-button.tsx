import React from 'react'
import {EditButton} from '../common/edit-button'
import {useAppState} from '../tools/use-app-state'

export const EditUserButton: React.FC = () => {

    const {cUser, user} = useAppState()

    if(user.id !== cUser.id) {
        return null
    }

    return <EditButton>

    </EditButton>
}