import React from 'react'

import {PromptModalProvider} from './prompt'
import {SearchModalProvider} from './search'
import {UserEditModalProvider} from './user-edit'
import {EventEditModalProvider} from './event-edit'
import {EventParticipantsModalProvider} from './event-participants'

export const ModalsProvider: React.FC = ({children}) => {
    return <PromptModalProvider>
        <SearchModalProvider>
            <UserEditModalProvider>
                <EventEditModalProvider>
                    <EventParticipantsModalProvider>
                        {children}
                    </EventParticipantsModalProvider>
                </EventEditModalProvider>
            </UserEditModalProvider>
        </SearchModalProvider>
    </PromptModalProvider>
}