import {useState} from 'react'

export const useNotificationHandlers: () => {
    a: number,
    newTeamNotification: () => void,
    newMembersNotification: () => void,
    newInviteNotification: () => void,
    newDenyNotification: () => void,
    default: () => void,
    updates: number,
} = () => {
    const [updates, setUpdates] = useState(0)
    return {
        a: 1,
        newTeamNotification: () => {
            setUpdates(updates + 1)
        },
        newMembersNotification: () => {
            setUpdates(updates + 1)
        },
        newInviteNotification: () => {
            setUpdates(updates + 1)
        },
        newDenyNotification: () => {
            setUpdates(updates + 1)
        },
        default: () => {
            setUpdates(updates + 1)
        },
        updates,
    }
}