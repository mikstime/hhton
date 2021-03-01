import {useState} from 'react'

type User = {
    firstName: string,
    lastName: string,
    jobName: string,
    bio: string,
    avatar: string,
    skills: UserSkills,
    hackathons: Hackathon[],
    id: string
}

type UserOptional = {
    firstName?: string,
    lastName?: string,
    jobName?: string,
    bio?: string,
    avatar?: string,
    skills?: UserSkills,
    hackathons?: Hackathon[],
    id?: string
}

type UserSkills = {
    description: string,
    tags: string[]
}

type Hackathon = {
    name: string,
    isFinished: boolean,
    place: string,
    participantsCount: number,
    participants: User[]
    prizes: Prize[]
}

type Prize = {
    name: string,
    count: number,
    winners: User[]
}

type UserActions = {
    change: (newUser: UserOptional) => any,
    set: (newUser: User) => any,
}

export const NULL_USER = {
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
    jobName: '',
    id: '-1',
    skills: {
        tags: [],
        description: ''
    },
    hackathons: [],
}

export const _useAppState: () => {user: User & UserActions} = () => {

    const [user, setUser] = useState<User>(NULL_USER)
    return {
        user: {
            ...user,
            set: (newUser: User) => {
                //@ts-ignore
                setUser({...newUser})
            },
            change: (newUser: UserOptional) => {
                //@ts-ignore
                setUser({...user, ...newUser})
            },
        }
    }
}