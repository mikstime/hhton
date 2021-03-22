import React from 'react'

import {PromptModalProvider} from './prompt'
import {SearchModalProvider} from './search'
import {UserEditModalProvider} from './user-edit'

export const ModalsProvider: React.FC = ({children}) => {
    return <PromptModalProvider>
        <SearchModalProvider>
            <UserEditModalProvider>
                {children}
            </UserEditModalProvider>
        </SearchModalProvider>
    </PromptModalProvider>
}