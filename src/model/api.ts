import {HOST_DOMAIN, PREFIX} from '../config/network'
import {sleep} from '../utils'
import background from '../assets/background.png'
import logo from '../assets/logo.png'
import {NULL_USER} from '../components/tools/use-app-state'
import {User} from '../components/tools/use-app-state/user'

const useMock = true
const mockImplemented = false


const TEST_USERS: User[] = [
    {
        id: '1',
        firstName: 'Имя',
        lastName: 'Фамилия',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    },
    {
        id: '14',
        firstName: 'Имя',
        lastName: 'Фамилия2',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    },
    {
        id: '11',
        firstName: 'Имя',
        lastName: 'Фамилия3',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    },
    {
        id: '113',
        firstName: 'Имя',
        lastName: 'Фамилия',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    },
    {
        id: '112',
        firstName: 'Имя',
        lastName: 'Фамилия2',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    },
    {
        id: '111',
        firstName: 'Имя',
        lastName: 'Фамилия3',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    }
]

/**
 * Получить информацию о пользователе, включая информацию об участии пользователя в хакатонах
 * @param id
 */
const lackUser = {
    isInvited: false,
    bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    jobName: 'Тинькофф',
    avatar: 'http://loremflickr.com/1000/1000',
    skills: {
        tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
        description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    },
    hackathons: []
}
export const fetchUser = async (id: string) => {
    if (!mockImplemented) {
        const user = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${id}`)

        if (user.ok) {
            const json = await user.json()

            Object.assign(json, lackUser)
            if(json.team) {
                if(!json.team.members) {
                    json.team.members = []
                }
            }
            return json
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
            skills: {
                tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
                description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
            },
            hackathons: []
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
        const invited = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invited/user/${inviteeId}`)

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

const lackEvent = {
    logo: logo,
    background: background,
    isFinished: false,
    participants: new Array(270).map(() => NULL_USER),
    prizes: [],
    settings: {},
    isParticipating: false
}
/**
 * Получить информацию о мероприятии
 * @param id
 */
export const fetchEvent = async (id: string) => {
    if (!mockImplemented) {
        const event = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${id}`)

        if (event.ok) {
            const json = await event.json()

            return {...lackEvent, ...json, id: json.id.toString()}
        } else {
            return null
        }
    } else {
        await sleep(300)
        return {
            name: 'Хакатон',
            logo: logo,
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
        const event = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${userId}/events`)

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
 */
export const findUsers = async (query: string) => {
    if (!useMock) {
        //@TODO implement
        return []
    } else {
        await sleep(300)
        return TEST_USERS.filter(u => u.id.startsWith(query))
    }
}

/**
 * Возвращает массив доступных специализаций
 */
export const getJobs: () => Promise<string[]> = async () => {
    if (!mockImplemented) {
        const job = await fetch(`${HOST_DOMAIN}${PREFIX}/job`)

        if (job.ok) {
            const json = await job.json()
            let result = [] as string[]
            if(json) {
                json.forEach((v: { name: any }) => {
                    result.push(v.name)
                })
            }

            return result
        } else {
            return []
        }
    } else {
        await sleep(300)
        return ['Frontend', 'Backend', '3D designer', 'Product Manager', 'UX/UI', 'DevOps', 'Другое']
    }
}

/**
 * Возвращает массив строк
 * @param job – название работы,
 */
export const getSkills = async (job: string) => {
    if (!mockImplemented) {
        const skill = await fetch(`${HOST_DOMAIN}${PREFIX}/job/${encodeURIComponent(job)}/skills`)

        if (skill.ok) {
            const json = await skill.json()
            let result = [] as string[]
            if(json) {
                json.forEach((v: { name: any }) => {
                    result.push(v.name)
                })
            }

            return result
        } else {
            return []
        }
    } else {
        await sleep(300)
        return ['React', 'Angular', 'TypeScript']
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
        // TODO получать id сразу
        const event = await fetchEvent(eventId)
        if (event === null) {
            return []
        }

        const feed = await fetch(`${HOST_DOMAIN}${PREFIX}/feed/${event.feed.id}`)

        if (feed.ok) {
            const json = await feed.json()
            let result: any[] = []

            json.users.forEach((v: { id: any }) => {
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
 * @param eventId
 * @param userId - id пользователя, чью команду запрашиваем
 */
export const getTeam = async (eventId: string, userId: string) => {
    if (!mockImplemented) {
        const team = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${userId}/team`)

        if (team.ok) {
            const json = await team.json()

            if(json) {
                return {
                    members: json as User[],
                }
            } else {
                return {
                    members: [] as User[],
                }
            }

        } else {
            return {
                members: [] as User[],
            }
        }
    } else {
        await sleep(300)
        return {
            members: TEST_USERS.slice(1, 3)
        }
    }
}

export const signIn = async () => {
    if(!useMock) {
        return null
    } else {
        return await fetchUser('1')
    }
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const teamInvites = async (eventId: string, userId: string) => {
    if (!mockImplemented && userId) {
        const teams = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invitation/teams`)

        if (teams.ok) {
            const json = await teams.json()
            let result = [] as User[]

            if(json) {
                json.forEach((v: { members: any[] }) => {
                    result.push(v.members[0])
                })
            }

            return result
        } else {
            return []
        }
    } else {
        await sleep(300)
        return TEST_USERS.slice(2,4)
    }
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const personalInvites = async (eventId: string, userId: string) => {
    if (!mockImplemented && userId) {
        const users = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invitation/users`)

        if (users.ok) {
            const json = await users.json()


            return json || [] as User[]
        } else {
            return []
        }
    } else {
        await sleep(300)
        return TEST_USERS.slice(1,3)
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
            body: JSON.stringify({
                uid1: inviterId,
                uid2: inviteeId
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
export const declineInvite = async (eventId: string, inviteeId: string, inviterId: string) => {
    if (!mockImplemented) {
        const decline = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${inviterId}/decline`,
            {
                method: 'POST',
            })
        return (decline.ok && decline.status === 200)
    } else {
        await sleep(300)
        return true
    }
}
