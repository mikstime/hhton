import {useCallback, useReducer} from 'react'
import {Hackathon} from './hackathon'

export type Id = string

export type UserSkills = {
    description: string,
    tags: UserSkill[]
}

export type UserSkill = {
    name: string,
    id?: Id,
    jobId?: string,
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
    isInvited?: boolean,
    avatar: string,
    skills: UserSkills,
    hackathons: Hackathon[], // история участий
    id: Id,
    team: Team,
    isNullUser?: boolean,
    notFound?: boolean,
    settings: UserSettings
}

export type UserSettings = {
    // social networks
    tg: string,
    gh: string,
    vk: string,
}

export type Prize = {
    name: string,
    id?: Id,
    count: string,
    winners?: Team[]
}

export type Team = {
    members: User[],
    name: string,
    id?: Id,
    prizes?: Prize[]
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
    settings?: UserSettings
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
    isNullUser: true,
    team: {
        name: '',
        members: [],
    },
    settings: {
        vk: '',
        tg: '',
        gh: ''
    }
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