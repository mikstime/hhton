import {User} from './user'
import {useCallback, useReducer} from 'react'
import {Prize} from './user'

export type Hackathon = {
    name: string,
    id: string,
    logo: string,
    description: string,
    background: string,
    founderId: string,
    isFinished: boolean,
    place: string,
    participantsCount: number,
    participants: User[]
    prizes: Prize[],
    settings: HackathonSettings,
    isNullEvent?: boolean,
    notFound?: boolean,
    isParticipating?: boolean,
    isPrivate?: boolean,
}


export type HackathonOptional = {
    name?: string,
    id?: string,
    logo?: string,
    description?: string,
    background?: string,
    founderId?: string,
    isFinished?: boolean,
    place?: string,
    participantsCount?: number,
    participants?: User[]
    prizes?: Prize[],
    settings?: HackathonSettings,
    isNullEvent?: boolean,
    notFound?: boolean,
    isParticipating?: boolean,
    isPrivate?: boolean,
}

export type HackathonSettings = {
    start?: Date|null,
    finish?: Date|null,
    usersLimit?: number,
    teamSize?: number,
    site?: string,
}


export const NULL_HACKATHON = {
    name: '',
    id: '-1',
    logo: '',
    start: null,
    finish: null,
    description: '',
    background: '',
    isFinished: false,
    place: '',
    founderId: '-1',
    participantsCount: 0,
    participants: [],
    prizes: [],
    settings: {},
    isNullEvent: true,
}


export type HackathonActions = {
    change: (newEvent: HackathonOptional) => any,
    set: (newEvent: Hackathon) => any,
    // join: (user: User) => any,
    // leave: (user: User) => any,
}

type HackathonAction =
    | { type: 'change', newEvent: HackathonOptional }
    | { type: 'set', newEvent: Hackathon }
    | { type: 'join', user: User }
    | { type: 'leave', user: User }

const eventReducer = (event: Hackathon, action: HackathonAction) => {
    switch (action.type) {
        case 'change':
            return {...event, ...action.newEvent}
        case 'set':
            return {...action.newEvent}
        default:
            throw new Error()
    }
}

export const useHackathon = () => {

    const [event, dispatch] = useReducer(eventReducer, NULL_HACKATHON);

    const change = useCallback((newEvent: HackathonOptional) => {
        dispatch({type: 'change', newEvent})
    }, [dispatch])

    const set = useCallback((newEvent: Hackathon) => {
        dispatch({type: 'set', newEvent})
    }, [dispatch])

    return {
        ...event,
        set,
        change
    } as Hackathon & HackathonActions

}
