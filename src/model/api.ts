import {HOST_DOMAIN, PREFIX} from '../config/network'
import {sleep} from '../utils'
import background from '../assets/background.png'
import logo from '../assets/logo.png'
import {NULL_USER} from '../components/tools/use-app-state'
import {
    Id, Prize,
    Team,
    User,
    UserOptional,
    UserSkill
} from '../components/tools/use-app-state/user'
import Convert, {BackendHackathon, BackendUser, Jobs} from './backend'
import {HackathonOptional} from '../components/tools/use-app-state/hackathon'

const useMock = false
const mockImplemented = false


const TEST_USERS: User[] = []

export const fetchUser = async (id: Id) => {
    if (!mockImplemented) {
        const user = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${id}`, {
            credentials: 'include'
        })

        if (user.ok) {
            const json = await user.json()
            if (json) {
                return Convert.user.toFrontend(json)
            }
            return null
        } else {
            return null
        }
    } else {
        await sleep(300)
        if (id.length > 3)
            return null

        const user = TEST_USERS.find(u => u.id === id)

        if (user) {
            return user
        }

        return {
            firstName: 'Имя' + id,
            lastName: 'Фамилия',
            isInvited: false,
            bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
            jobName: 'Тинькофф',
            avatar: 'http://loremflickr.com/1000/1000',
            id: id,
            settings: {
                vk: '',
                tg: '',
                gh: ''
            },
            skills: {
                tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
                    name: 'React',
                    jobId: '1',
                    id: '1'
                }, {name: 'Angular', jobId: '1', id: '1'}, {
                    name: 'CSS',
                    jobId: '1',
                    id: '1'
                }, {name: 'Backend', jobId: '1', id: '1'}, {
                    name: 'Node.js',
                    jobId: '1',
                    id: '1'
                }, {name: 'Golang', jobId: '1', id: '1'}, {
                    name: 'Postgres',
                    jobId: '1',
                    id: '1'
                }],
                description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
            },
            hackathons: [],
            team: {
                name: 'test team',
                members: []
            }
        }
    }
}

/**
 * Проверить, отправил ли один пользователь приглашение другому
 * @param eventId
 * @param inviterId
 * @param inviteeId
 */
export const isInvited = async (eventId: string, inviterId: string, inviteeId: string) => {
    if (!mockImplemented) {
        const invited = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invited/user/${inviteeId}`, {
            credentials: 'include'
        })

        if (invited.ok) {
            const json = await invited.json()

            return json.isInvited
        } else {
            return false
        }
    } else {
        await sleep(300)
        return false
    }
}

/**
 * Получить информацию о мероприятии
 * @param id
 */
export const fetchEvent = async (id: Id) => {
    if (!mockImplemented) {
        const eventRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${id}`, {
            credentials: 'include'
        })

        if (eventRequest.ok) {
            const json = await eventRequest.json()

            return Convert.event.toFrontend(json as BackendHackathon)
        } else {
            return null
        }
    } else {
        await sleep(300)
        return {
            id: '1',
            founderId: '1',
            name: 'Хакатон',
            logo: logo,
            description: 'Замечательный хакатон',
            start: null,
            finish: null,
            background: background,
            isFinished: false,
            place: 'Москва, Лубянка 13',
            participantsCount: 270,
            participants: new Array(270).map(() => NULL_USER),
            prizes: [],
            settings: {},
            isParticipating: false
        }
    }
}

/**
 * Проверить, участвует ли пользователь в мероприятии.
 * Вернуть true, если участвует
 * @param userId
 * @param eventId
 */
export const isParticipating = async (eventId: string, userId: string) => {
    if (!mockImplemented) {
        const event = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${userId}/events`, {
            credentials: 'include'
        })

        if (event.ok) {
            const json = await event.json()
            for (let u of json) {
                if (u.id.toString() === eventId) {
                    return true
                }
            }

            return false
        } else {
            return null
        }
    } else {
        await sleep(300)
        return true
    }
}

/**
 * Пригласить пользователя в команду. Возвращает true в случае успеха
 * @param eventId
 * @param inviterId
 * @param inviteeId
 * @param mode
 */
export const invitePerson = async (eventId: string, inviterId: string, inviteeId: string, mode: 'silent' | 'default' = 'default') => {
    if (!mockImplemented) {
        const invite = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${inviteeId}/invite`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    silent: mode === 'silent'
                })
            })
        return (invite.ok && invite.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 * Записаться на мероприятие. Возвращает true в случае успеха
 * @param userId
 * @param eventId
 */
export const joinEvent = async (userId: string, eventId: string) => {
    if (!mockImplemented) {
        const join = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/join`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    uid: parseInt(userId),
                    tid: 0
                })
            })

        return (join.ok && join.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 * Покинуть мероприятие. Возвращает true в случае успеха
 * @param userId
 * @param eventId
 */
export const leaveEvent = async (userId: string, eventId: string) => {
    if (!mockImplemented) {
        const leave = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/leave`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    uid: parseInt(userId),
                    tid: 0
                })
            })

        return (leave.ok && leave.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 * Поиск пользователей по строке. Возвращает массив пользователей
 * @param query
 * @param eventId
 */
export const findUsers = async (query: string, eventId: string) => {
    if (!useMock) {
        const usersRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/search?tag=${query}`, {
            credentials: 'include'
        })

        if (usersRequest.ok) {
            const json = await usersRequest.json()

            return Convert.users.toFrontend(json)
        } else {
            return [] as User[]
        }
    } else {
        await sleep(300)
        return [] as User[]
    }
}

/**
 * Возвращает массив доступных специализаций
 */
export const getJobs: () => Promise<Jobs> = async () => {
    if (!mockImplemented) {
        const job = await fetch(`${HOST_DOMAIN}${PREFIX}/job`, {
            credentials: 'include'
        })

        if (job.ok) {
            const json = await job.json()
            let result = [] as { name: string, id: number }[]
            if (json) {
                result.push(...json)
            }

            return result
        } else {
            return []
        }
    } else {
        await sleep(300)
        return []//['Frontend', 'Backend', '3D designer', 'Product Manager', 'UX/UI', 'DevOps', 'Другое']
    }
}

/**
 * Возвращает массив строк
 * @param job – название работы,
 */
export const getSkills = async (job: string) => {
    if (!mockImplemented) {
        const skill = await fetch(`${HOST_DOMAIN}${PREFIX}/job/${encodeURIComponent(job)}/skills`, {
            credentials: 'include'
        })

        if (skill.ok) {
            const json = await skill.json()

            if (json) {
                return Convert.skills.toFrontend(json)
            }

            return [] as UserSkill[]
        } else {
            return []
        }
    } else {
        await sleep(300)
        return [{name: 'React', jobId: '1', id: '1'}, {
            name: 'Angular',
            jobId: '1',
            id: '1'
        }, {name: 'CSS', jobId: '1', id: '1'}]
    }
}

/**
 * Возвращает массив id пользователей
 * @param eventId
 * @param query – строка типа j=Frontend&skills=Angular|TypeScript
 * @param sinceId
 */
export const getFeed = async (eventId: string, query: string, sinceId?: string) => {
    if (!mockImplemented) {
        // получать id сразу
        const event = await fetchEvent(eventId)
        if (event === null) {
            return []
        }

        const feedRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/filter${query}`, {
            credentials: 'include'
        })

        if (feedRequest.ok) {
            const json = await feedRequest.json()
            let result = [] as string[]

            if(!json.users)
                return []
            json.users.forEach((v: { id: Id }) => {
                result.push(v.id)
            })
            return result
        } else {
            return []
        }


    } else {
        await sleep(300)
        console.log(query, sinceId)
        return TEST_USERS.map(u => u.id)
    }
}

/**
 * Возвращает объект типа Team
 * @param teamId
 */
export const getTeamById = async (teamId: string) => {
    if (!mockImplemented) {
        const team = await fetch(`${HOST_DOMAIN}${PREFIX}/team/${teamId}`, {
            credentials: 'include'
        })

        if (team.ok) {
            const json = await team.json()
            if (json) {
                const t = Convert.team.toFrontend(json)
                t.members = await Promise.all(json.members?.map((j: BackendUser) => fetchUser(j.id!.toString())).filter((u: User | null) => u) ?? [])
                return t
            } else {
                return {
                    members: [] as User[],
                    name: ''
                } as Team
            }

        } else {
            return {
                members: [] as User[],
                name: ''
            } as Team
        }
    } else {
        await sleep(300)
        return {
            members: TEST_USERS.slice(1, 3),
            name: ''
        } as Team
    }
}

/**
 * Возвращает объект типа Team
 * @param eventId
 * @param userId - id пользователя, чью команду запрашиваем
 */
export const getTeam = async (eventId: string, userId: string) => {
    if (!mockImplemented) {
        const team = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${userId}/team`, {
            credentials: 'include'
        })

        if (team.ok) {
            const json = await team.json()
            if (json) {
                const t = Convert.team.toFrontend(json)
                //@TODO Пользователи прилетают не полные. Поправить на беке
                t.members = await Promise.all(json.members.map((j: BackendUser) => fetchUser(j.id!.toString())).filter((u: User | null) => u))
                return t
            } else {
                return {
                    members: [] as User[],
                    name: ''
                }
            }

        } else {
            return {
                members: [] as User[],
                name: ''
            }
        }
    } else {
        await sleep(300)
        return {
            members: TEST_USERS.slice(1, 3),
            name: ''
        }
    }
}

/**
 *
 * @param eventId - id события
 * @param teamId - id активной команды
 * @param newName
 */
export const modifyTeamName = async (eventId: string, teamId: string, newName: string) => {
    if (!mockImplemented) {
        const name = await fetch(`${HOST_DOMAIN}${PREFIX}/team/${teamId}`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    eventid: Number(eventId),
                    name: newName
                })
            })
        return (name.ok && name.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 *
 * @param eventId - id события
 * @param teamId - id команды
 */
export const teamInvitedDeclined = async (eventId: string, teamId: string) => {
    return teamInvited(eventId, teamId, true)
}

/**
 *
 * @param eventId - id события
 * @param teamId - id команды
 */
export const teamInvitedPending = async (eventId: string, teamId: string) => {
    return teamInvited(eventId, teamId, false)
}

/**
 *
 * @param eventId - id события
 * @param teamId - id активного пользователя
 */
export const teamInvited = async (eventId: string, teamId: string, declined: boolean) => {
    if (!mockImplemented && teamId) {
        return getTeamInvitesFromUrl(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invited/teams?declined=${declined}`)
    } else {
        await sleep(300)
        return [] as User[]
    }
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const teamInvites = async (eventId: string, userId: string) => {
    if (!mockImplemented && userId) {
        return getTeamInvitesFromUrl(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invitation/teams`)
    } else {
        await sleep(300)
        return [] as User[]
    }
}

export const getTeamInvitesFromUrl = async (url: string) => {
    const teams = await fetch(url, {
        credentials: 'include'
    })

    if (teams.ok) {
        const json = await teams.json()
        try {
            const parsedTeams = await Promise.all(
                json.map((tID: number) => getTeamById(tID.toString()))
            )
            const usersAndTeams = parsedTeams.map((t: any) => {
                let teamLead = {} as User
                Object.assign(teamLead, t.members[0])
                teamLead.team = t
                return teamLead
            })
            if (usersAndTeams) {
                return usersAndTeams as User[]
            }

            return [] as User[]
        } catch (e) {
            return [] as User[]
        }
    } else {
        return [] as User[]
    }
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const personalInvitedDeclined = async (eventId: string, userId: string) => {
    return personalInvited(eventId, userId, true)
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const personalInvitedPending = async (eventId: string, userId: string) => {
    return personalInvited(eventId, userId, false)
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const personalInvited = async (eventId: string, userId: string, declined: boolean) => {
    if (!mockImplemented && userId) {
        return getPersonalInvitesFromUrl(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invited/users?declined=${declined}`)
    } else {
        await sleep(300)
        return TEST_USERS.slice(1, 3)
    }
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const personalInvites = async (eventId: string, userId: string) => {
    if (!mockImplemented) {
        return getPersonalInvitesFromUrl(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invitation/users`)
    } else {
        await sleep(300)
        return TEST_USERS.slice(1, 3)
    }
}

export const getPersonalInvitesFromUrl = async (url: string) => {
    try {
        const users = await fetch(url, {
            credentials: 'include'
        })

        if (users.ok) {
            const json = await users.json()
            const usersIDs = json.map((id: number) => id.toString())

            return getFullUsersByID(usersIDs)
        } else {
            return []
        }
    } catch (e) {
        return []
    }
}

export const getFullUsersByID = async (userIDs: string[]) => {
    if (!mockImplemented && userIDs) {
        const fullUsers = await Promise.all(userIDs.map((id: string) => fetchUser(id)))
        if (fullUsers) {
            return fullUsers as User[]
        }
        return [] as User[]
    } else {
        await sleep(300)
        return TEST_USERS.slice(1, 3)
    }
}

/**
 *
 * @param eventId
 * @param inviteeId - current user!!!
 * @param inviterId
 */
export const acceptInvite = async (eventId: string, inviteeId: string, inviterId: string) => {
    if (!mockImplemented) {
        const join = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/team/join`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    uid1: Number(inviterId),
                    uid2: Number(inviteeId)
                })
            })
        return (join.ok && join.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 *
 * @param eventId
 * @param inviteeId - current user!!!
 * @param inviterId
 */
export const unInvite = async (eventId: string, inviteeId: string, inviterId: string) => {
    if (!mockImplemented) {
        const ban = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${inviterId}/uninvite`,
            {
                credentials: 'include',
                method: 'POST'
            })
        return (ban.ok && ban.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 *
 * @param eventId
 * @param inviteeId - current user!!!
 * @param inviterId
 */
export const banInvite = async (eventId: string, inviteeId: string, inviterId: string) => {
    if (!mockImplemented) {
        const ban = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${inviterId}/ban`,
            {
                credentials: 'include',
                method: 'POST'
            })
        return (ban.ok && ban.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 *
 * @param eventId
 * @param inviteeId - current user!!!
 * @param inviterId
 */
export const declineInvite = async (eventId: string, inviteeId: string, inviterId: string) => {
    if (!mockImplemented) {
        const decline = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${inviterId}/decline`,
            {
                credentials: 'include',
                method: 'POST'
            })
        return (decline.ok && decline.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

/**
 * Изменяет данные пользователя, в случае успеха возвращает true.
 * @param user
 * @constructor
 */
export const modifyUser = async (user: UserOptional & { id: Id }) => {
    if (!useMock) {
        let success = true
        const backUser = Convert.userOptional.toBackend(user)
        const modifyRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${user.id}`,
            {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(backUser)
            })

        success = modifyRequest.ok && modifyRequest.status === 200
        if (!success) {
            return false
        }

        if (backUser.skills != null) {
            const modifySkillsRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${user.id}/skills`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(backUser.skills)
                })

            success = modifySkillsRequest.ok && modifySkillsRequest.status === 200
        }

        return success
    } else {
        await sleep(300)
        return true
    }
}

/**
 * Изменяет данные события, в случае успеха возвращает true.
 * @param data
 * @constructor
 */
export const modifyEvent = async (data: {
    diff: HackathonOptional & { id: Id },
    teams: Team[],
    founderId: Id,
    prizes: Prize[],
    addWinners: {},
    deletedWinners: {},
    deletedPrizes: string[],
}) => {
    if (!mockImplemented) {
        data.diff.founderId = data.founderId
        const eventRequests = []
        // Обновляем евент
        eventRequests.push(
            fetch(`${HOST_DOMAIN}${PREFIX}/event/${data.diff.id}`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(Convert.eventOptional.toBackend(data.diff, data.prizes))
            })
        )
        // Удаляем призы
        if (data.deletedPrizes.length > 0) {
            eventRequests.push(
                fetch(`${HOST_DOMAIN}${PREFIX}/event/${data.diff.id}/prize`, {
                    method: 'DELETE',
                    credentials: 'include',
                    body: JSON.stringify(
                        data.deletedPrizes.map((id) => ({
                            id: Number(id)
                        })))
                })
            )
        }
        // Удаляем победителей
        for (let tID of Object.keys(data.deletedWinners)) {
            // @ts-ignore
            if (data.deletedWinners[tID] === undefined) {
                continue
            }
            // @ts-ignore
            for (let pID of data.deletedWinners[tID]) {
                console.log('delete: ', tID, pID)
                eventRequests.push(
                    fetch(`${HOST_DOMAIN}${PREFIX}/event/${data.diff.id}/unwin`, {
                        method: 'POST',
                        credentials: 'include',
                        body: JSON.stringify({
                            prizeID: Number(pID),
                            teamID: Number(tID),
                            eventID: Number(data.diff.id)
                        })
                    })
                )
            }
        }
        // Награждаем победителей
        for (let tID of Object.keys(data.addWinners)) {
            // @ts-ignore
            if (data.addWinners[tID] === undefined) {
                continue
            }
            // @ts-ignore
            for (let pID of data.addWinners[tID]) {
                eventRequests.push(
                    fetch(`${HOST_DOMAIN}${PREFIX}/event/${data.diff.id}/win`, {
                        method: 'POST',
                        credentials: 'include',
                        body: JSON.stringify({
                            prizeID: Number(pID),
                            teamID: Number(tID),
                            eventID: Number(data.diff.id)
                        })
                    })
                )
            }
        }

        const eventResponse = await Promise.all(eventRequests)

        let result = true
        for (let response of eventResponse) {
            if (result = result && (response.ok && response.status === 200)) {
            } else {
                break;
            }
        }
        return result
    } else {
        console.log(data)
        await sleep(300)
        return true
    }
}

/**
 * Создает событие, в случае успеха возвращает id события.
 * @param data
 * @constructor
 */
export const createEvent = async (data: {
    diff: HackathonOptional & { id: Id },
    teams: Team[],
    founderId: Id,
    prizes: Prize[]
}) => {
    if (!mockImplemented) {
        data.diff.founderId = data.founderId
        let payload = Convert.eventOptional.toBackend(data.diff, data.prizes)
        const fetches = [
            await fetch(`${HOST_DOMAIN}${PREFIX}/event`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(payload)
            })
        ]
        const eventRequest = await Promise.all(fetches)

        if (eventRequest[0].ok) {
            const json = await eventRequest[0].json()

            return json.id?.toString() ?? '-1'
        } else {
            return false
        }
    } else {
        await sleep(300)
        return '6'
    }
}

export const updateImage = async (image: File, path: string) => {
    if (!mockImplemented) {
        let formData = new FormData()

        formData.append('file', image)
        const userAvatarResponse = await fetch(path, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        if (userAvatarResponse.ok) {
            const json = await userAvatarResponse.json()
            return json.avatar as string
        } else {
            return ''
        }
    } else {
        await sleep(300)
        return `http://loremflickr.com/1000/1000?t=${new Date()}`
    }
}

export const updateUserAvatar = async (image: File, userID: string) => {
    return updateImage(image, `${HOST_DOMAIN}${PREFIX}/user/${userID}/image`)
}

export const updateEventLogo = async (image: File, eventId: string) => {
    return updateImage(image, `${HOST_DOMAIN}${PREFIX}/event/${eventId}/logo`)
}

export const updateEventBackground = async (image: File, eventId: string) => {
    return updateImage(image, `${HOST_DOMAIN}${PREFIX}/event/${eventId}/background`)
}

/**
 * Проверить текущего пользователя
 * Вовращает userID или -1
 */
export const checkUser = async () => {
    if (!mockImplemented) {
        const authResponse = await fetch(`${HOST_DOMAIN}${PREFIX}/check`, {
            method: 'GET',
            credentials: 'include'
        })

        if (authResponse.ok) {
            const json = await authResponse.json()
            return json.id.toString()
        } else {
            return '-1'
        }
    } else {
        await sleep(300)
        return '1'
    }
}

export const finishEvent = async (eventId: string) => {
    if (!mockImplemented) {
        const finish = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/finish`,
            {
                method: 'POST',
                credentials: 'include'
            })
        return (finish.ok && finish.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

export const getEventTeams = async (eventId: string) => {
    if (!mockImplemented) {
        const finish = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/teams`,
            {
                credentials: 'include'
            })
        if (finish.ok) {
            const j = await finish.json()
            if(j) {
            return await Promise.all(j.map((j: Team) => getTeamById(j.id ?? ''))) as Team[]
            }
        }
        return []
    } else {
        await sleep(300)
        return []
    }
}

export const getWinners = async (eventId: string) => {
    if (!mockImplemented) {
        const finish = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/teams/win`,
            {
                credentials: 'include'
            })
        if (finish.ok) {
            const j = await finish.json()
            if(!j)
                return []
            const ts = await Promise.all(j.map((j: Team) => getTeamById(j.id ?? ''))) as Team[]
            //@ts-ignore
            const r = j?.map((j, i) =>({
                ...ts[i],
                prizes: [{
                id: j.prize.id.toString(),
                name: j.prize.name,
                place: j.prize.place,
                count: j.prize.amount,
                }]
            })) ?? []
            return r as Team[]
        }
        return []
    } else {
        await sleep(300)
        return []
    }
}

export const voteFor = async (userID: string, eventID: string, teamID: string) => {
    if (!mockImplemented) {
        const voted = await fetch(`${HOST_DOMAIN}${PREFIX}/team/${teamID}/vote`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    eventID: Number(eventID),
                    forWhomID: Number(userID),
                    state: 1
                })
            })
        return (voted.ok && voted.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

export const unVoteFor = async (userID: string, eventID: string, teamID: string) => {
    if (!mockImplemented) {
        const voted = await fetch(`${HOST_DOMAIN}${PREFIX}/team/${teamID}/vote`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    eventID: Number(eventID),
                    forWhomID: Number(userID),
                    // TODO проверить
                    state: -1
                })
            })
        return (voted.ok && voted.status === 200)
    } else {
        await sleep(300)
        return true
    }
}

export const getActiveEvents = async (userId: string) => {
    const res = await fetch(
        `${HOST_DOMAIN}${PREFIX}/user/${userId}/events`,
        {credentials: 'include'})

    if(res.ok) {
        const json = await res.json()
        if(json) {
            return json.map(Convert.event.toFrontend)
        } else {
            return []
        }
    } else {
        return []
    }
}