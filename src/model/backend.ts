import {
    Team,
    User, UserOptional, UserSkills
} from '../components/tools/use-app-state/user'
import {
    Hackathon, Prize
} from '../components/tools/use-app-state/hackathon'
import {Invites} from '../components/tools/use-app-state/invite'

type BackendUser = {
    id: number | null,
    firstName: string | null,
    lastName: string | null,
    jobName: string | null,
    email: string | null,
    workPlace: string | null,
    description: string | null,
    bio: string | null,
    team: BackendTeam | null,
    skills: BackendSkills | null
}

export type BackendHackathon = {
    id: number | null,
    name: string | null,
    description: string | null,
    founder: number | null,
    dateStart: Date | null,
    dateEnd: Date | null,
    state: string | null,
    place: string | null,
    feed: {
        id: number | null,
        users: User[] | null,
        event: number | null,
    } | null
    participantsCount: number | null
}

type BackendInvites = {}

type BackendTeam = {
    members: User[],
    name: string,
    id: number,
}

type BackendSkills = {
    id: number,
    name: string,
    jobId: number,
}[]

/**
 * Convert позволяет преобразовывать сущности Бэкенда в сущности фронтенда
 * и наоборот.
 * //@TODO первостепенно реализовать функциональность user и event
 */
const Convert = {
    user: {
        toFrontend: (bUser: BackendUser) => {
            return {
                firstName: bUser.firstName ?? '',
                lastName: bUser.lastName ?? '',
                jobName: bUser.jobName ?? '',
                bio: bUser.bio ?? '',
                avatar: 'http://loremflickr.com/1000/1000',
                skills: {
                    description: bUser.description ?? '',
                    tags: bUser.skills?.map(s => ({id: s.id.toString(), jobId: s.jobId.toString(), name: s.name})) ?? []
                },
                hackathons: [] as Hackathon[],
                id: bUser.id?.toString() ?? '-1',
                team: {
                    name: '',
                    members: [] as User[]
                }
            }
        },
        toBackend: (fUser: UserOptional) => {
            //@TODO better implementation
            return {
                id: Number(fUser.id) ?? null,
                firstName: fUser.firstName ?? null,
                lastName: fUser.lastName ?? null,
                jobName: fUser.jobName ?? null,
                email: '',
                workPlace: '',
                description: fUser.skills?.description ?? null,
                bio: ''
            }
        }
    },
    event: {
        toFrontend: (bHackathon: BackendHackathon) => {
            const currentDate = new Date()

            return {
                name: bHackathon.name ?? '',
                id: bHackathon.id?.toString() ?? '-1',
                logo: 'http://loremflickr.com/1000/1000',
                background: 'http://loremflickr.com/1000/1000',
                founderId: bHackathon.founder?.toString() ?? '-1',
                isFinished: currentDate > bHackathon.dateEnd! ?? true,
                place: bHackathon.place ?? '',
                participantsCount: bHackathon.participantsCount,
                participants: bHackathon.feed?.users,
                prizes: [] as Prize[],
                settings: {},
            }
        },
        toBackend: (bUser: Hackathon) => {
            return {

            }
        }
    }
} as {
    user: {
        toFrontend: (bUser: BackendUser) => User,
        toBackend: (bUser: User) => BackendUser
    },
    event: {
        toFrontend: (bUser: BackendHackathon) => Hackathon,
        toBackend: (bUser: Hackathon) => BackendHackathon
    },
    team: {
        toFrontend: (bUser: BackendTeam) => Team,
        toBackend: (bUser: Team) => BackendTeam
    },
    invite: {
        toFrontend: (bUser: BackendInvites) => Invites,
        toBackend: (bUser: Invites) => BackendInvites
    }
}

export default Convert