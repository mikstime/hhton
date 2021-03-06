import React from 'react'
import {SecondaryButton} from '../common/buttons'
import {useAppState} from '../tools/use-app-state'


export const ParticipateButton: React.FC = () => {
    const {event} = useAppState()

    return <SecondaryButton disabled={event.isFinished}>
        Участвовать
    </SecondaryButton>
}