import {useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
type Message = {
    type: string,
    status: string,
    message: string,
}
export const useNotificationHandlers: () => {
    newTeamNotification: (m: Message) => void,
    newMembersNotification: (m: Message) => void,
    newInviteNotification: (m: Message) => void,
    newDenyNotification: (m: Message) => void,
    newTeamLeadNotification: (m: Message) => void,
    newVoteNotification: (m: Message) => void,
    default: (m: Message) => void,
    updates: number,
} = () => {
    const [updates, setUpdates] = useState(0)
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const history = useHistory()
    return {
        newTeamNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    history.push('/team')
                }
            })
        },
        newMembersNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    history.push('/team')
                }
            })
        },
        newInviteNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    history.push('/team')
                }
            })
        },
        newDenyNotification: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                    history.push('/team')
                }
            })
        },
        newTeamLeadNotification: (m: Message) => {
            // TODO Implement
            console.log("Implement")
        },
        newVoteNotification: (m: Message) => {
            // TODO Implement
            console.log("Implement")
        },
        default: (m: Message) => {
            setUpdates(updates + 1)
            const key = enqueueSnackbar(m.message, {
                onClick: () => {
                    closeSnackbar(key);
                }
            })
        },
        updates,
    }
}