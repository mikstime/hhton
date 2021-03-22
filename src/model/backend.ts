import {
    Team,
    User, UserOptional, UserSkill,
} from '../components/tools/use-app-state/user'
import {
    Hackathon
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

type BackendHackathon = {}

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
    skills: {
        toFrontend: (bSkills: BackendSkills) => {
            return bSkills.map(s => ({
                id: s.id.toString(), name: s.name, jobId: s.jobId.toString()
            }))
        }
    }
} as {
    user: {
        toFrontend: (bUser: BackendUser) => User,
        toBackend: (bUser: User) => BackendUser
    },
    event: {
        toFrontend: (bUser: BackendHackathon) => User,
        toBackend: (bUser: Hackathon) => BackendHackathon
    },
    team: {
        toFrontend: (bUser: BackendTeam) => Team,
        toBackend: (bUser: Team) => BackendTeam
    },
    invite: {
        toFrontend: (bUser: BackendInvites) => Invites,
        toBackend: (bUser: Invites) => BackendInvites
    },
    skills: {
        toFrontend: (bSkills: BackendSkills) => UserSkill[],
    }
}

export default Convert