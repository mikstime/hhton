import {User} from './user'
import {useState} from 'react'


export type Hackathon = {
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


export type HackathonOptional = {
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

export type HackathonSettings = {}


export type Prize = {
    name: string,
    count: number,
    winners: User[]
}


export const NULL_HACKATHON = {
    name: '',
    id: '-1',
    logo: '',
    background: '',
    isFinished: false,
    place: '',
    founderId: '-1',
    participantsCount: 0,
    participants: [],
    prizes: [],
    settings: {}
}


export type HackathonActions = {
    change: (newUser: HackathonOptional) => any,
    set: (newUser: Hackathon) => any,
    join: () => any,
    leave: () => any,
}


export const useHackathon = () => {

    const [hackathon, setHackathon] = useState<Hackathon>(NULL_HACKATHON)

    return {
        ...hackathon,
        set: (newEvent: Hackathon) => {
            //@ts-ignore
            setHackathon({...newEvent})
        },
        change: (newEvent: HackathonOptional) => {
            //@ts-ignore
            setHackathon({...newEvent, ...newEvent})
        },
        join: () => {

        },
        leave: () => {

        }
    } as Hackathon & HackathonActions
}
