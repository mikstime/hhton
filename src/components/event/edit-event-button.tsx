import React from 'react'
import {EditButton} from '../common/edit-button'
import {useAppState} from '../tools/use-app-state'
import {useEventEditModal} from '../modals/event-edit'

export const EditEventButton: React.FC = () => {

    const {cUser, event} = useAppState()
    const {open} = useEventEditModal()
    if(cUser.id !== event.founderId || cUser.id === '-1') {
        return null
    }

    return <EditButton onClick={open}>

    </EditButton>
}