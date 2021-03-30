import React from 'react'

import {PromptModalProvider} from './prompt'
import {SearchModalProvider} from './search'
import {UserEditModalProvider} from './user-edit'
import {EventAboutModalProvider} from './event-about'
import {EventEditModalProvider} from './event-edit'
import {EventWinnersModalProvider} from './event-winners'

export const ModalsProvider: React.FC = ({children}) => {
    return <PromptModalProvider>
        <SearchModalProvider>
            <UserEditModalProvider>
                <EventWinnersModalProvider>
                    <EventAboutModalProvider>
                        <EventEditModalProvider>
                            {children}
                        </EventEditModalProvider>
                    </EventAboutModalProvider>
                </EventWinnersModalProvider>
            </UserEditModalProvider>
        </SearchModalProvider>
    </PromptModalProvider>
}