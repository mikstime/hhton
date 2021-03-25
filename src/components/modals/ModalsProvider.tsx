import React from 'react'

import {PromptModalProvider} from './prompt'
import {SearchModalProvider} from './search'
import {UserEditModalProvider} from './user-edit'
import {EventAboutModalProvider} from './event-about'
import {EventEditModalProvider} from './event-edit'

export const ModalsProvider: React.FC = ({children}) => {
    return <PromptModalProvider>
        <SearchModalProvider>
            <UserEditModalProvider>
                <EventAboutModalProvider>
                    <EventEditModalProvider>
                        {children}
                    </EventEditModalProvider>
                </EventAboutModalProvider>
            </UserEditModalProvider>
        </SearchModalProvider>
    </PromptModalProvider>
}