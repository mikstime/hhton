import {
    Team,
    User, UserOptional, UserSkill, Prize
} from '../components/tools/use-app-state/user'
import {
    Hackathon, HackathonOptional
} from '../components/tools/use-app-state/hackathon'
import {Invites} from '../components/tools/use-app-state/invite'

export type BackendUser = {
    id: number | null,
    avatar: string | null,
    firstName: string | null,
    lastName: string | null,
    workPlace: string | null,
    email: string | null,
    description: string | null,
    bio: string | null,
    team: BackendTeam | null,
    skills: BackendSkills | null,
    tg: string | null,
    gh: string | null,
    vk: string | null
}

type BackendUserOptional = {
    id: number | null,
    firstName: string | null,
    lastName: string | null,
    avatar: string | null,
    email: string | null,
    workPlace: string | null,
    description: string | null,
    bio: string | null,
    team: BackendTeam | null,
    skills: BackendSkills | null,
    tg: string | null,
    gh: string | null,
    vk: string | null
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

export type Jobs = {
    name: string,
    id: number
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
                jobName: bUser.workPlace ?? '',
                bio: bUser.bio ?? '',
                avatar: bUser.avatar || 'http://loremflickr.com/1000/1000',
                skills: {
                    description: bUser.description ?? '',
                    tags: bUser.skills?.map(s => ({id: s.id.toString(), jobId: s.jobId.toString(), name: s.name})) ?? []
                },
                hackathons: [] as Hackathon[],
                id: bUser.id?.toString() ?? '-1',
                team: {
                    name: '',
                    members: [] as User[]
                },
                settings: {
                    vk: bUser.vk,
                    gh: bUser.gh,
                    tg: bUser.tg
                }
            }
        },
        toBackend: (fUser: User) => {
            //@TODO better implementation
            return {
                id: Number(fUser.id) ?? null,
                firstName: fUser.firstName ?? null,
                lastName: fUser.lastName ?? null,
                email: '',
                workPlace: fUser.jobName,
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
                avatar: fUser.avatar ?? null,
                lastName: fUser.lastName ?? null,
                email: '',
                workPlace: fUser.jobName ?? null,
                description: fUser.skills?.description ?? null,
                bio: fUser.bio ?? null,
                skills: fUser.skills?.tags?.map(s => ({
                    skillID: Number(s.id),
                    jobID: Number(s.jobId),
                    skillName: s.name
                })) ?? null,
                vk: fUser.settings?.vk ?? null,
                gh: fUser.settings?.gh ?? null,
                tg: fUser.settings?.tg ?? null
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
                isFinished: bHackathon.state === 'finished',
                place: bHackathon.place ?? '',
                participantsCount: bHackathon.participantsCount,
                participants: bHackathon.feed?.users,
                prizes: [] as Prize[], //@TODO prizes
                settings: {
                    start: null, //@TODO start date
                    finish: null, //@TODO finish date
                    teamSize: 0, //@TODO teamSize
                    usersLimit: 0, //@TODO usersLimit
                    site: '', //@TODO site
                },
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
            return bJobs
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
    },
    newSkills: {
        toBackend: (bSkills: BackendSkills) => NewSkills,
    }
    job: {
        toFrontend: (bJobs: BackendJobs) => Jobs,
    }
}

export default Convert