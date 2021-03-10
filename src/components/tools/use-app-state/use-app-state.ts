import {User, UserActions, useUser} from './user'
import {
    Hackathon,
    HackathonActions,
    useHackathon
} from './hackathon'

export const _useAppState: () => {
    cUser: User & UserActions,
    user: User & UserActions,
    event: Hackathon & HackathonActions
} = () => {

    const user = useUser()
    const cUser = useUser()
    const event = useHackathon()

    return {
        user,
        event,
        cUser: {
            ...cUser
        }
    }
}