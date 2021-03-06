import React from 'react'
import {_useAppState} from './use-app-state'
import {NULL_USER} from './user'
import {NULL_HACKATHON} from './hackathon'

export type UseAppStateType = ReturnType<typeof _useAppState>
//@ts-ignore
const AppStateContext = React.createContext()

export const AppStateProvider: React.FC = ({children}) => {
    const appState = _useAppState()
    return <AppStateContext.Provider value={appState}>
        {children}
    </AppStateContext.Provider>
}

export const useAppState: () => UseAppStateType = () => {
    const context = React.useContext(AppStateContext)
    if (context === undefined) {
        throw new Error('useAppState must be used within a AppStateProvider')
    }
    return context as UseAppStateType
}

export {
    NULL_USER,
    NULL_HACKATHON,
}