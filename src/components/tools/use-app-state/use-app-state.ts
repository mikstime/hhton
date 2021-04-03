import {User, UserActions, useUser} from './user'
import {
    Hackathon,
    HackathonActions,
    useHackathon
} from './hackathon'
import {Invites, InvitesActions, useInvites} from './invite'

export const _useAppState: () => {
    cUser: User & UserActions,
    user: User & UserActions,
    event: Hackathon & HackathonActions,
    cEvent: Hackathon & HackathonActions,
    invites: {
        i: Invites & InvitesActions,
        o: Invites & InvitesActions,
    }
} = () => {
    const user = useUser()
    const cUser = useUser()
    const event = useHackathon()
    const cEvent = useHackathon()
    const invitesI = useInvites()
    const invitesO = useInvites()

    return {
        user,
        event,
        cEvent,
        cUser,
        invites: {
            i: invitesI,
            o: invitesO,
        }
    }
}