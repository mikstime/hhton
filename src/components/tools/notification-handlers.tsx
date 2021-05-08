import React, {useState} from 'react'
import {useSnackbar} from 'notistack'
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
    | 'EventWinners'
    |'EventFinished'

const keys = [
    'NewTeamNotification',
    'NewMembersNotification',
    'NewInviteNotification',
    // 'NewDenyNotification',
    'NewTeamLeadNotification',
    'NewVoteNotification',
]

const useGenerateHandles = (action: () => void, keys: string[], nav: { [key: string]: (m: Message) => void }) => {
    const {enqueueSnackbar} = useSnackbar()
    return keys.reduce((a, k) => {
        a[k] = (m: Message) => {
            action()
            if(m.message) {
                const to = nav[k](m)
                enqueueSnackbar(JSON.stringify({
                    message: m.message,
                    to,
                }), {
                    preventDuplicate: true,
                })
            } else {
                nav[k](m)
            }
        }

        return a
    }, {} as { [key in string]: (m: Message) => void })
}

export const _useNotificationHandlers: () => {
    [key in (NC | 'default' | 'EventWinners')]: (m: Message) => void
} & {
    navigation: { [key in (NC | 'default' | 'EventWinners')]: (m: Message) => string|void }
    updates: number,
    eUpdates: number,
    update: () => void
} = () => {
    const [updates, setUpdates] = useState(0)
    const [eUpdates, setEUpdates] = useState(0)
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
        EventWinners: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/event/' + m.type
        },
        EventFinished: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/event/' + m.type
        },

        default: (m: Message) => {
            settings.setIsHostMode(false)
            cEvent.change({id: m.type})
            return '/event/' + m.type
        },
    }

    const handles = useGenerateHandles(
        () => {
            setUpdates(updates + 1)
        }, keys, navigation
    ) as { [key in NC]: (m: Message) => void }

    const eventHandles = useGenerateHandles(
        () => {
            setUpdates(updates + 1)
            setEUpdates(eUpdates + 1)
        }, ['EventWinners', 'EventFinished'], navigation
    ) as { [key in NC]: (m: Message) => void }
    return {
        update: () => {
            setUpdates(updates + 1)
        },
        ...handles,
        ...eventHandles,
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
        eUpdates,
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