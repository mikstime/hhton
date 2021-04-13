import React, {useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import {useAppState} from './use-app-state'

export type Message = {
    type: string,
    status: string,
    message: string,
}
export type NC = 'newTeamNotification'
    | 'newMembersNotification'
    | 'newInviteNotification'
    | 'newDenyNotification'
    | 'newTeamLeadNotification'
    | 'newVoteNotification'

const keys = [
    'newTeamNotification',
    'newMembersNotification',
    'newInviteNotification',
    'newDenyNotification',
    'newTeamLeadNotification',
    'newVoteNotification'
]

const useGenerateHandles = (action: () => void, keys: string[], nav: { [key: string]: (m: Message) => void }) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    return keys.reduce((a, k) => {
        a[k] = (m: Message) => {
            action()
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key)
                    nav[k](m)
                }
            })
        }

        return a
    }, {} as { [key in string]: (m: Message) => void })
}

export const _useNotificationHandlers: () => {
    [key in NC]: (m: Message) => void
} & {
    navigation: { [key in (NC | 'default')]: (m: Message) => void }
    default: (m: Message) => void,
    updates: number,
    update: () => void
} = () => {
    const [updates, setUpdates] = useState(0)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const history = useHistory()
    const {settings, cEvent} = useAppState()

    const navigation = {
        newTeamNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            history.push('/team#team')
        },
        newMembersNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            history.push('/team#team')
        },
        newInviteNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            history.push('/team#incoming')
        },
        newDenyNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            history.push('/team#team')
        },
        newTeamLeadNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            history.push('/team#team')
        },
        newVoteNotification: () => {
        },
        default: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            history.push('/event/' + m.type)
        }
    }
    const handles = useGenerateHandles(
        () => {
            setUpdates(updates + 1)
        }, keys, navigation
    ) as { [key in NC]: (m: Message) => void }
    return {
        update: () => {
            setUpdates(updates + 1)
        },
        ...handles,
        default: (m: Message) => {
            setUpdates(updates + 1)
            if (m.message) {
                const key = enqueueSnackbar(m.message, {
                    onClick: () => {
                        closeSnackbar(key)
                    }
                })
            }
        },
        updates,
        navigation
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