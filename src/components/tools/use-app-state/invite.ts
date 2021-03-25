import {User} from './user'
import {useCallback, useReducer} from 'react'


export type Invites = {
    personal: User[],
    team: User[],
    isNull?: boolean,
}


export type InvitesOptional = {
    personal?: User[],
    team?: User[]
    isNull?: boolean,
}

export const NULL_INVITES = {
    personal: [],
    team: [],
    isNull: true,
} as Invites


export type InvitesActions = {
    change: (newInvites: InvitesOptional) => any,
    set: (newInvites: Invites) => any,
}

type InvitesAction =
    | { type: 'change', newInvites: InvitesOptional }
    | { type: 'set', newInvites: Invites }

const invitesReducer = (invites: Invites, action: InvitesAction) => {
    switch (action.type) {
        case 'change':
            return {...invites, ...action.newInvites}
        case 'set':
            return {...action.newInvites}
        default:
            throw new Error()
    }
}

export const useInvites = () => {

    const [invites, dispatch] = useReducer(invitesReducer, NULL_INVITES);

    const change = useCallback((newInvites: Invites) => {
        dispatch({type: 'change', newInvites})
    }, [dispatch])

    const set = useCallback((newInvites: Invites) => {
        dispatch({type: 'set', newInvites})
    }, [dispatch])

    return {
        ...invites,
        set,
        change
    } as Invites & InvitesActions

}
