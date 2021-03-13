import {useCallback, useReducer} from 'react'
import {Hackathon} from './hackathon'

export type UserSkills = {
    description: string,
    tags: string[]
}


export type UserActions = {
    change: (newUser: UserOptional) => any,
    set: (newUser: User) => any
}


export type User = {
    firstName: string,
    lastName: string,
    jobName: string,
    bio: string,
    isInvited: boolean,
    avatar: string,
    skills: UserSkills,
    hackathons: Hackathon[], // история участий
    id: string,
    team?: Team,
    isNullUser?: boolean,
    notFound?: boolean,
    inMyTeam?: boolean,
}


export type Team = {
    members: User[],
    invites?: {
        personal: Invite[],
        team: Invite[]
    }
}

export type Invite = {

}

export type UserOptional = {
    firstName?: string,
    lastName?: string,
    jobName?: string,
    notFound?: boolean,
    bio?: string,
    team?: Team,
    isInvited?: boolean,
    avatar?: string,
    skills?: UserSkills,
    hackathons?: Hackathon[],
    id?: string
    isNullUser?: boolean
    inMyTeam?: boolean,
}


export const NULL_USER = {
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    isInvited: true,
    notFound: false,
    jobName: '',
    id: '-1',
    skills: {
        tags: [],
        description: ''
    },
    hackathons: [],
    isNullUser: true
} as User

type UserAction =
    | { type: 'change', newUser: UserOptional }
    | { type: 'set', newUser: User }

const userReducer = (user: User, action: UserAction) => {
    switch (action.type) {
        case 'change':
            return {...user, ...action.newUser}
        case 'set':
            return {...action.newUser}
        default:
            throw new Error()
    }
}

export const useUser = () => {

    const [user, dispatch] = useReducer(userReducer, NULL_USER);

    const change = useCallback((newUser: UserOptional) => {
        dispatch({type: 'change', newUser})
    }, [dispatch])

    const set = useCallback((newUser: User) => {
        dispatch({type: 'set', newUser})
    }, [dispatch])

    return {
        ...user,
        set,
        change
    } as User & UserActions
}