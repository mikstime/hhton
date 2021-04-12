import React, {useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import {useAppState} from './use-app-state'
export type Message = {
    type: string,
    status: string,
    message: string,
}
export const _useNotificationHandlers: () => {
    newTeamNotification: (m: Message) => void,
    newMembersNotification: (m: Message) => void,
    newInviteNotification: (m: Message) => void,
    newDenyNotification: (m: Message) => void,
    newTeamLeadNotification: (m: Message) => void,
    newVoteNotification: (m: Message) => void,
    default: (m: Message) => void,
    updates: number,
    update: () => void,
} = () => {
    const [updates, setUpdates] = useState(0)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const history = useHistory()
    const {settings, cEvent} = useAppState()
    return {
        update: () => {
            setUpdates(updates + 1)
        },
        newTeamNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    settings.setIsHostMode(false)
                    cEvent.change({id: m.type})
                    history.push('/team#team')
                }
            })
        },
        newMembersNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    settings.setIsHostMode(false)
                    cEvent.change({id: m.type})
                    history.push('/team#team')
                }
            })
        },
        newInviteNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    settings.setIsHostMode(false)
                    cEvent.change({id: m.type})
                    history.push('/team#incoming')
                }
            })
        },
        newDenyNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    settings.setIsHostMode(false)
                    cEvent.change({id: m.type})
                    history.push('/team#team')
                }
            })
        },
        newTeamLeadNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    settings.setIsHostMode(false)
                    cEvent.change({id: m.type})
                    history.push('/team#team')
                }
            })
        },
        newVoteNotification: () => {
            setUpdates(updates + 1)
        },
        default: (m: Message) => {
            setUpdates(updates + 1)
            if(m.message) {
                const key = enqueueSnackbar(m.message, {
                    onClick: () => {
                        closeSnackbar(key);
                    }
                })
            }
        },
        updates,
    }
}

export type useNotificationHandlersType = ReturnType<typeof _useNotificationHandlers>
//@ts-ignore
const NotificationHandlersContext = React.createContext()

export const NotificationHandlersProvider: React.FC = ({children}) => {
    const nc = _useNotificationHandlers()
    return <NotificationHandlersContext.Provider value={nc}>
        {children}
        </NotificationHandlersContext.Provider>
}

export const useNotificationHandlers: () => useNotificationHandlersType = () => {
    const context = React.useContext(NotificationHandlersContext)
    if (context === undefined) {
        throw new Error('useNotificationHandlers must be used within a NotificationHandlersProvider')
    }
    return context as useNotificationHandlersType
}