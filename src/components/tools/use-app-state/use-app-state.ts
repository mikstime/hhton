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
    place: string,
    participantsCount: number,
}

type UserActions = {
    change: (id: number) => any
}

export const _useAppState: () => {user: User & UserActions} = () => {

    const [id, setId] = useState(1)
    return {
        user: {
            firstName: 'Michael',
            lastName: 'Balitsky',
            bio: 'Born in Moscow',
            jobName: 'jobless',
            id: id.toString(),
            skills: {
                tags: ['Javascript','Javascript','Javascript','Javascript','Javascript','Javascript',],
                description: 'Very confident person'
            },
            change: (id: number) => {
                setId(id)
            },
            hackathons: []
        },
    }
}