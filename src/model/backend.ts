import {
    Team,
    User, UserOptional, UserSkill, Prize
} from '../components/tools/use-app-state/user'
import {
    Hackathon, HackathonOptional
} from '../components/tools/use-app-state/hackathon'

import defaultLogo from '../assets/default_logo.svg'
import defaultAvatar from '../assets/default_avatar.svg'
import defaultBackground from '../assets/default_background.svg'

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
    history: Hackathon[] | null
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
    logo: string | null,
    background: string | null,
    site: string | null,
    description: string | null,
    teamSize: number | null,
    founder: number | null,
    dateStart: string | null,
    dateEnd: string | null,
    state: string | null,
    place: string | null,
    isPrivate: boolean | null,
    isVerified: boolean | null,
    feed: {
        id: number | null,
        users: User[] | null,
        event: number | null,
    } | null
    participantsCount: number | null
    prizeList: {
        id: number | null,
        eventID: number | null,
        name: string | null,
        place: number | null,
        amount: number | null,
        total: number | null,
        winnerTeamIDs: number[] | null
    }[] | null
}

type BackendInvites = {}

type BackendTeam = {
    members: BackendUser[],
    name: string,
    id: number,
    prize: Prize,
    leadid: number
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

type BackendPrizes = {
    prizeID: number,
    eventID: number,
    teamID: number,
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
                avatar: bUser.avatar || defaultAvatar,
                skills: {
                    description: bUser.description ?? '',
                    tags: bUser.skills?.map(s => ({
                        id: s.id.toString(),
                        jobId: s.jobId.toString(),
                        name: s.name
                    })) ?? []
                },
                hackathons: bUser.history ?? [],
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
                avatar: null,
                skills: null,
                tg: null,
                gh: null,
                vk: null,
                history: null,
                firstName: fUser.firstName ?? null,
                lastName: fUser.lastName ?? null,
                email: '',
                workPlace: fUser.jobName,
                description: fUser.skills?.description ?? null,
                bio: '',
                team: null
            }
        }
    },
    users: {
        toFrontend: (bUsers: BackendUser[]) => {
            return bUsers?.map(u => (Convert.user.toFrontend(u))) ?? []
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
                tg: fUser.settings?.tg ?? null,
                team: null
            }
        }
    },
    event: {
        toFrontend: (bHackathon: BackendHackathon) => {
            const orderedPrizes = bHackathon.prizeList?.sort((left, right) => {
                    return (left.place ?? 0) - (right.place ?? 0)
                }
            ).map((p) => ({
                id: p.id?.toString() ?? '',
                name: p.name ?? null,
                total: p.total ?? '0',
                count: p.amount ?? 0 > 0 ? p.amount?.toString() ?? '0' : '0'
            })) ?? [] as Prize[]

            return {
                name: bHackathon.name ?? '',
                id: bHackathon.id?.toString() ?? '-1',
                logo: bHackathon.logo || defaultLogo,
                background: bHackathon.background || defaultBackground,
                description: bHackathon.description ?? '',
                founderId: bHackathon.founder?.toString() ?? '-1',
                isFinished: bHackathon.state === 'finished' || bHackathon.state === 'Closed',
                place: bHackathon.place ?? '',
                participantsCount: bHackathon.participantsCount,
                participants: bHackathon.feed?.users,
                prizes: orderedPrizes,
                settings: {
                    start: bHackathon.dateStart && bHackathon.dateStart !== '0001-01-01T00:00:00Z' ? new Date(bHackathon.dateStart as string) : null,
                    finish: bHackathon.dateStart && bHackathon.dateStart !== '0001-01-01T00:00:00Z' ? new Date(bHackathon.dateEnd as string) : null,
                    teamSize: bHackathon.teamSize,
                    usersLimit: 0, //@TODO usersLimit
                    site: bHackathon.site
                },
                isPrivate: bHackathon.isPrivate,
                isVerified: bHackathon.isVerified,
            }
        },
        toBackend: (bUser: Hackathon) => {
            return null
        }
    },
    eventOptional: {
        toBackend: (fEvent: HackathonOptional, prizes: Prize[]) => {
            return {
                id: Number(fEvent.id) ?? null,
                name: fEvent.name ?? null,
                logo: fEvent.logo ?? null,
                background: fEvent.background ?? null,
                site: fEvent.settings?.site ?? null,
                teamSize: fEvent.settings?.teamSize ?? null,
                description: fEvent.description ?? null,
                founder: Number(fEvent.founderId) ?? null,
                dateStart: fEvent.settings?.start ?? null,
                dateEnd: fEvent.settings?.finish ?? null,
                state: fEvent.isFinished ? 'Closed' : ' Open' ?? null,
                place: fEvent.place ?? null,
                feed: null,
                participantsCount: null,
                prizeList: prizes.map((p, i) => ({
                    id: Number(p.id) ?? null,
                    eventID: Number(fEvent.id) ?? null,
                    name: p.name ?? null,
                    place: i,
                    amount: Number(p.count) ?? null,
                    total: Number(p.total) ?? null,
                    winnerTeamIDs: null
                })),
                isPrivate: fEvent.isPrivate,
                isVerified: fEvent.isVerified,
            }
        }
    },
    prize: {
        // TODO учитывается только 1 приз
        toBackend: (fTeams: Team[], evtID: String) => {
            let result = [] as BackendPrizes
            for (let i = 0; i < fTeams.length; i++) {
                if (fTeams[i].prizes && fTeams[i].prizes!.length !== 0) {
                    const p = fTeams[i].prizes![0];
                    result.push({
                        prizeID: Number(p.id),
                        eventID: Number(evtID),
                        teamID: Number(fTeams[i].id),
                    })
                }
            }

            return result
        }
    },
    team: {
        toFrontend: (bTeam: BackendTeam) => {
            return {
                members: bTeam.members?.map(u => (Convert.user.toFrontend(u))) ?? [],
                name: bTeam.name,
                id: bTeam.id.toString(),
                prizes: [bTeam.prize] as Prize[],
                teamLead: {id: bTeam.leadid.toString()}
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
        }
    },
    job: {
        toFrontend: (bJobs: BackendJobs) => {
            return bJobs
        }
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
        toBackend: (bUser: Hackathon) => BackendHackathon | null
    },
    eventOptional: {
        toBackend: (fEvent: HackathonOptional, prizes: Prize[]) => BackendHackathon
    },
    prize: {
        toBackend: (fTeams: Team[], evtID: String) => BackendPrizes
    },
    team: {
        toFrontend: (bUser: BackendTeam) => Team,
        // toBackend: (bUser: Team) => BackendTeam
    },
    // invite: {
    //     toFrontend: (bUser: BackendInvites) => Invites,
    //     toBackend: (bUser: Invites) => BackendInvites
    // },
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