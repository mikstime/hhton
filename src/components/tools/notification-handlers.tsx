import React, {useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import {useAppState} from './use-app-state'

export type Message = {
    type: string,
    status: NC,
    message: string,
}
export type NC = 'NewTeamNotification'
    | 'NewMembersNotification'
    | 'NewInviteNotification'
    | 'NewDenyNotification'
    | 'NewTeamLeadNotification'
    | 'NewVoteNotification'

const keys = [
    'NewTeamNotification',
    'NewMembersNotification',
    'NewInviteNotification',
    // 'NewDenyNotification',
    'NewTeamLeadNotification',
    'NewVoteNotification'
]

const useGenerateHandles = (action: () => void, keys: string[], nav: { [key: string]: (m: Message) => void }) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    return keys.reduce((a, k) => {
        a[k] = (m: Message) => {
            action()
            if(m.message) {
                const to = nav[k](m)
                enqueueSnackbar(JSON.stringify({
                    message: m.message,
                    to,
                }))
            } else {
                nav[k](m)
            }
        }

        return a
    }, {} as { [key in string]: (m: Message) => void })
}

export const _useNotificationHandlers: () => {
    [key in NC]: (m: Message) => void
} & {
    navigation: { [key in (NC | 'default')]: (m: Message) => string|void }
    default: (m: Message) => void,
    updates: number,
    update: () => void
} = () => {
    const [updates, setUpdates] = useState(0)
    const {enqueueSnackbar} = useSnackbar()
    const {settings, cEvent} = useAppState()

    const navigation = {
        NewTeamNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/team#team'
        },
        NewMembersNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/team#team'
        },
        NewInviteNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/team#incoming'
        },
        NewDenyNotification: (m: Message) => {
        },
        NewTeamLeadNotification: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/team'
        },
        NewVoteNotification: () => {},
        default: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/event/' + m.type
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
        NewDenyNotification: (m: Message) => {
            setUpdates(updates + 1)
        },
        default: (m: Message) => {
            setUpdates(updates + 1)
            if (m.message) {
                enqueueSnackbar(JSON.stringify(m.message))
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