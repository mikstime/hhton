import {useState} from 'react'
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
    notFound?: boolean,
    bio: string,
    inTeam: boolean,
    isInvited: boolean,
    avatar: string,
    skills: UserSkills,
    hackathons: Hackathon[],
    id: string,
    isNullUser?: boolean,
}


export type UserOptional = {
    firstName?: string,
    lastName?: string,
    jobName?: string,
    notFound?: boolean,
    bio?: string,
    inTeam?: boolean,
    isInvited?: boolean,
    avatar?: string,
    skills?: UserSkills,
    hackathons?: Hackathon[],
    id?: string
    isNullUser?: boolean
}


export const NULL_USER = {
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    inTeam: false,
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
} as User

export const useUser = () => {

    const [user, setUser] = useState<User>(NULL_USER)

    return {
        ...user,
        set: (newUser: User) => {
            //@ts-ignore
            setUser({...newUser})
        },
        change: (newUser: UserOptional) => {
            //@ts-ignore
            setUser({...user, ...newUser})
        }
    } as User & UserActions
}