import React from 'react'
import {EditButton} from '../common/edit-button'
import {useAppState} from '../tools/use-app-state'
import {useUserEditModal} from '../modals/user-edit'

export const EditUserButton: React.FC = () => {

    const {cUser, user} = useAppState()
    const {open} = useUserEditModal()
    if(user.id !== cUser.id) {
        return null
    }

    return <EditButton onClick={open}>

    </EditButton>
}