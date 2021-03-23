import {
    Team,
    User, UserOptional, UserSkill
} from '../components/tools/use-app-state/user'
import {
    Hackathon, HackathonOptional, Prize
} from '../components/tools/use-app-state/hackathon'
import {Invites} from '../components/tools/use-app-state/invite'

export type BackendUser = {
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

type BackendUserOptional = {
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
    members: BackendUser[],
    name: string,
    id: number,
}

type BackendSkills = {
    id: number,
    name: string,
    jobId: number,
}[]

type NewSkills = {
    skillID: number,
    skillName: string,
    jobID: number,
}[]

type BackendJobs = {
    id: number,
    name: string,
}[]

export type Jobs = string[]

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
        toBackend: (fUser: User) => {
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
    users: {
        toFrontend: (bUsers: BackendUser[]) => {
            return bUsers.map(u => (Convert.user.toFrontend(u)))
        }
    },
    userOptional: {
        toBackend: (fUser: UserOptional) => {
            return {
                id: Number(fUser.id) ?? null,
                firstName: fUser.firstName ?? null,
                lastName: fUser.lastName ?? null,
                jobName: fUser.jobName ?? null,
                email: '',
                workPlace: '',
                description: fUser.skills?.description ?? null,
                bio: fUser.bio ?? null,
                skills: fUser.skills?.tags?.map(s => ({skillID: Number(s.id), jobID: Number(s.jobId), skillName: s.name})) ?? null
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
                description: bHackathon.description ?? '',
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
    },
    eventOptional: {
        toBackend: (fEvent: HackathonOptional) => {
            return {

            }
        }
    },
    team: {
        toFrontend: (bUser: BackendTeam) => {
            return {
                members: bUser.members.map(u => (Convert.user.toFrontend(u))),
                name: bUser.name,
            }
        }
    },
    skills: {
        toFrontend: (bSkills: BackendSkills) => {
            return bSkills.map(s => ({
                id: s.id.toString(), name: s.name, jobId: s.jobId.toString()
            }))
        }
    },
    newSkills: {
        toBackend: (bSkills: BackendSkills) => {
            return bSkills.map(s => ({
                skillID: s.id, skillName: s.name, jobID: s.jobId
            }))
        },
    },
    job: {
        toFrontend: (bJobs: BackendJobs) => {
            return bJobs.map(j => (
                j.name
            ))
        },
    }
} as {
    user: {
        toFrontend: (bUser: BackendUser) => User,
        toBackend: (bUser: User) => BackendUser
    },
    users: {
        toFrontend: (bUser: BackendUser[]) => User[]
    }
    userOptional: {
        toBackend: (bUser: UserOptional) => BackendUserOptional
    },
    event: {
        toFrontend: (bUser: BackendHackathon) => Hackathon,
        toBackend: (bUser: Hackathon) => BackendHackathon
    },
    eventOptional: {
        toBackend: (fEvent: HackathonOptional) => BackendHackathon
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
    newSkills: {
        toBackend: (bSkills: BackendSkills) => NewSkills,
    }
    job: {
        toFrontend: (bJobs: BackendJobs) => Jobs,
    }
}

export default Convert