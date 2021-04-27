import React from 'react'

import {PromptModalProvider} from './prompt'
import {SearchModalProvider} from './search'
import {UserEditModalProvider} from './user-edit'
import {EventEditModalProvider} from './event-edit'
import {EventParticipantsModalProvider} from './event-participants'
import {JoinModalProvider} from './join-modal'

export const ModalsProvider: React.FC = ({children}) => {
    return <PromptModalProvider>
        <SearchModalProvider>
            <JoinModalProvider>
                <UserEditModalProvider>
                    <EventEditModalProvider>
                        <EventParticipantsModalProvider>
                            {children}
                        </EventParticipantsModalProvider>
                    </EventEditModalProvider>
                </UserEditModalProvider>
            </JoinModalProvider>
        </SearchModalProvider>
    </PromptModalProvider>
}