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
    id: string,
    logo: string,
    background: string,
    founderId: string,
    isFinished: boolean,
    place: string,
    participantsCount: number,
    participants: User[]
    prizes: Prize[],
    settings: HackathonSettings,
}

type HackathonOptional = {
    name?: string,
    id?: string,
    logo?: string,
    background?: string,
    founderId?: string,
    isFinished?: boolean,
    place?: string,
    participantsCount?: number,
    participants?: User[]
    prizes?: Prize[],
    settings?: HackathonSettings,
}

type HackathonSettings = {

}

type Prize = {
    name: string,
    count: number,
    winners: User[]
}

type HackathonActions = {
    change: (newUser: HackathonOptional) => any,
    set: (newUser: Hackathon) => any,
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
        tags: [] as string[],
        description: ''
    },
    hackathons: [] as Hackathon[],
}

export const NULL_HACKATHON = {
    name: '',
    id: '-1',
    logo: '',
    background: '',
    isFinished: false,
    place: '',
    founderId : '-1',
    participantsCount: 0,
    participants: [],
    prizes: [],
    settings: {},
}

export const _useAppState: () => {user: User & UserActions, event: Hackathon & HackathonActions} = () => {

    const [user, setUser] = useState<User>(NULL_USER)
    const [event, setEvent] = useState<Hackathon>(NULL_HACKATHON)
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
        },
        event: {
            ...event,
            set: (newEvent: Hackathon) => {
                //@ts-ignore
                setEvent({...newEvent})
            },
            change: (newEvent: HackathonOptional) => {
                //@ts-ignore
                setEvent({...user, ...newEvent})
            },
        },
    }
}