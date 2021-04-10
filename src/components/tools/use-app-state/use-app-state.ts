import {User, UserActions, useUser} from './user'
import {
    Hackathon,
    HackathonActions,
    useHackathon
} from './hackathon'
import {Invites, InvitesActions, useInvites} from './invite'
import {Dispatch, SetStateAction, useState} from 'react'

export const _useAppState: () => {
    cUser: User & UserActions,
    user: User & UserActions,
    event: Hackathon & HackathonActions,
    cEvent: Hackathon & HackathonActions,
    invites: {
        i: Invites & InvitesActions,
        o: Invites & InvitesActions,
        h: Invites & InvitesActions,
    },
    settings: {
        isHostMode: boolean,
        setIsHostMode: Dispatch<SetStateAction<boolean>>
    }
} = () => {
    const user = useUser()
    const cUser = useUser()
    const event = useHackathon()
    const cEvent = useHackathon()
    const invitesI = useInvites()
    const invitesO = useInvites()
    const invitesH = useInvites()

    const [isHostMode, setIsHostMode] = useState<boolean>(false)
    return {
        user,
        event,
        cEvent,
        cUser,
        invites: {
            i: invitesI, //incoming
            o: invitesO, //outgoing
            h: invitesH // history
        },
        settings: {
            isHostMode,
            setIsHostMode
        }
    }
}