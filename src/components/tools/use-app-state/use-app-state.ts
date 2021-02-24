import {useState} from 'react'

type User = {
    firstName: string,
    lastName: string,
    jobName: string,
    bio: string,
    skills: UserSkills,
    hackathons: Hackathon[],
    id: string
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
    change: (id: string) => any
}

export const _useAppState: () => {user: User & UserActions} = () => {

    const [id, setId] = useState('1')
    return {
        user: {
            firstName: 'Michael',
            lastName: 'Balitsky',
            bio: 'Born in Moscow',
            jobName: 'jobless',
            id: id,
            skills: {
                tags: ['Javascript','Javascript','Javascript','Javascript','Javascript','Javascript',],
                description: 'Very confident person'
            },
            change: (id: string) => {
                setId(id)
            },
            hackathons: []
        },
    }
}