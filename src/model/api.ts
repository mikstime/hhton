import {HOST_DOMAIN, PREFIX} from '../config/network'
import {sleep} from '../utils'
import background from '../assets/background.png'
import logo from '../assets/logo.png'
import {NULL_USER} from '../components/tools/use-app-state'
import {
    User,
    UserOptional,
    UserSkill
} from '../components/tools/use-app-state/user'
import Convert, {BackendHackathon, BackendUser, Jobs} from './backend'
import {HackathonOptional} from '../components/tools/use-app-state/hackathon'

const useMock = false
const mockImplemented = false


const TEST_USERS: User[] = [
    // {
    //     id: '1',
    //     firstName: 'Имя',
    //     lastName: 'Фамилия',
    //     avatar: 'http://loremflickr.com/1000/1000',
    //     isInvited: false,
    //     bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    //     jobName: 'Тинькофф',
    //     skills: {
    //         tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
    //             name: 'React',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Angular', jobId: '1', id: '1'}, {
    //             name: 'CSS',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Backend', jobId: '1', id: '1'}, {
    //             name: 'Node.js',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Golang', jobId: '1', id: '1'}, {
    //             name: 'Postgres',
    //             jobId: '1',
    //             id: '1'
    //         }],
    //         description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    //     },
    //     hackathons: [],
    //     team: {
    //         name: 'test team',
    //         members: []
    //     }
    // },
    // {
    //     id: '14',
    //     firstName: 'Имя',
    //     lastName: 'Фамилия2',
    //     avatar: 'http://loremflickr.com/1000/1000',
    //     isInvited: false,
    //     bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    //     jobName: 'Тинькофф',
    //     skills: {
    //         tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
    //             name: 'React',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Angular', jobId: '1', id: '1'}, {
    //             name: 'CSS',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Backend', jobId: '1', id: '1'}, {
    //             name: 'Node.js',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Golang', jobId: '1', id: '1'}, {
    //             name: 'Postgres',
    //             jobId: '1',
    //             id: '1'
    //         }],
    //         description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    //     },
    //     hackathons: [],
    //     team: {
    //         name: 'test team',
    //         members: []
    //     }
    // },
    // {
    //     id: '11',
    //     firstName: 'Имя',
    //     lastName: 'Фамилия3',
    //     avatar: 'http://loremflickr.com/1000/1000',
    //     isInvited: false,
    //     bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    //     jobName: 'Тинькофф',
    //     skills: {
    //         tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
    //             name: 'React',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Angular', jobId: '1', id: '1'}, {
    //             name: 'CSS',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Backend', jobId: '1', id: '1'}, {
    //             name: 'Node.js',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Golang', jobId: '1', id: '1'}, {
    //             name: 'Postgres',
    //             jobId: '1',
    //             id: '1'
    //         }],
    //         description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    //     },
    //     hackathons: [],
    //     team: {
    //         name: 'test team',
    //         members: []
    //     }
    // },
    // {
    //     id: '113',
    //     firstName: 'Имя',
    //     lastName: 'Фамилия',
    //     avatar: 'http://loremflickr.com/1000/1000',
    //     isInvited: false,
    //     bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    //     jobName: 'Тинькофф',
    //     skills: {
    //         tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
    //             name: 'React',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Angular', jobId: '1', id: '1'}, {
    //             name: 'CSS',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Backend', jobId: '1', id: '1'}, {
    //             name: 'Node.js',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Golang', jobId: '1', id: '1'}, {
    //             name: 'Postgres',
    //             jobId: '1',
    //             id: '1'
    //         }],
    //         description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    //     },
    //     hackathons: [],
    //     team: {
    //         name: 'test team',
    //         members: []
    //     }
    // },
    // {
    //     id: '112',
    //     firstName: 'Имя',
    //     lastName: 'Фамилия2',
    //     avatar: 'http://loremflickr.com/1000/1000',
    //     isInvited: false,
    //     bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    //     jobName: 'Тинькофф',
    //     skills: {
    //         tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
    //             name: 'React',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Angular', jobId: '1', id: '1'}, {
    //             name: 'CSS',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Backend', jobId: '1', id: '1'}, {
    //             name: 'Node.js',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Golang', jobId: '1', id: '1'}, {
    //             name: 'Postgres',
    //             jobId: '1',
    //             id: '1'
    //         }],
    //         description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    //     },
    //     hackathons: [],
    //     team: {
    //         name: 'test team',
    //         members: []
    //     }
    // },
    // {
    //     id: '111',
    //     firstName: 'Имя',
    //     lastName: 'Фамилия3',
    //     avatar: 'http://loremflickr.com/1000/1000',
    //     isInvited: false,
    //     bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
    //     jobName: 'Тинькофф',
    //     skills: {
    //         tags: [{name: 'Frontend', jobId: '1', id: '1'}, {
    //             name: 'React',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Angular', jobId: '1', id: '1'}, {
    //             name: 'CSS',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Backend', jobId: '1', id: '1'}, {
    //             name: 'Node.js',
    //             jobId: '1',
    //             id: '1'
    //         }, {name: 'Golang', jobId: '1', id: '1'}, {
    //             name: 'Postgres',
    //             jobId: '1',
    //             id: '1'
    //         }],
    //         description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
    //     },
    //     hackathons: [],
    //     team: {
    //         name: 'test team',
    //         members: []
    //     }
    // }
]

export const fetchUser = async (id: string) => {
    if (!mockImplemented) {
        const user = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${id}`)

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

/**
 * Получить информацию о мероприятии
 * @param id
 */
export const fetchEvent = async (id: string) => {
    if (!mockImplemented) {
        const eventRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${id}`)

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
export const getJobs: () => Promise<Jobs> = async () => {
    if (!mockImplemented) {
        const job = await fetch(`${HOST_DOMAIN}${PREFIX}/job`)

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
        const skill = await fetch(`${HOST_DOMAIN}${PREFIX}/job/${encodeURIComponent(job)}/skills`)

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
        // TODO получать id сразу
        //@TODO rewrite with Convert
        // Нечего конвертировать
        const event = await fetchEvent(eventId)
        if (event === null) {
            return []
        }

        let result = [] as string[]

        event.participants.forEach((v: { id: string }) => {
            result.push(v.id)
        })
        return result
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
            if (json) {
                const t = Convert.team.toFrontend(json)
                //@TODO Пользователи прилетают не полные. Поправить на беке
                t.members = await Promise.all(json.members.map((j: BackendUser) => fetchUser(j.id!.toString())).filter((u:User|null) => u))
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

export const signIn = async () => {
    if (!useMock) {
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
        //@TODO rewrite with Convert
        const teams = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invitation/teams`)

        if (teams.ok) {
            const json = await teams.json()
            try {
                const parsedTeams = await Promise.all(
                    json.map((t: { id: number }) => fetch(`${HOST_DOMAIN}${PREFIX}/team/${t.id}`))
                )
                //@ts-ignore
                const teams1 = await Promise.all(parsedTeams.map(p => p.json()))
                if (teams1) {
                    let result = [] as User[]

                    if (teams1) {
                        //@ts-ignore
                        teams1.forEach((v: { members: BackendUser[] }) => {
                            if (v.members) {
                                result.push(Convert.user.toFrontend(v.members[0]))
                            } else {
                                console.log('members is null')
                            }
                        })
                    }

                    return result
                }

                return []
            } catch (e) {
                return []
            }
        } else {
            return []
        }
    } else {
        await sleep(300)
        return TEST_USERS.slice(2, 4)
    }
}

/**
 *
 * @param eventId - id события
 * @param userId - id активного пользователя
 */
export const personalInvites = async (eventId: string, userId: string) => {
    if (!mockImplemented && userId) {
        try {
            const users = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/invitation/users`)

            if (users.ok) {
                const json = await users.json()

                //@TODO не хватает полей у пользователя (косяк бекенда)
                const fullUsers = await Promise.all(json.map((j: BackendUser) => fetchUser(j.id!.toString())))
                if (fullUsers) {
                    return fullUsers as User[]
                }
                return [] as User[]
            } else {
                return []
            }
        } catch (e) {
            return []
        }
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
        console.log(inviteeId, inviterId, Number(inviterId), Number(inviteeId))
        const join = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/team/join`,
            {
                method: 'POST',
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
export const declineInvite = async (eventId: string, inviteeId: string, inviterId: string) => {
    if (!mockImplemented) {
        const decline = await fetch(`${HOST_DOMAIN}${PREFIX}/event/${eventId}/user/${inviterId}/decline`,
            {
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
export const modifyUser = async (user: UserOptional & { id: string }) => {
    if (!useMock) {
        let success = true
        const backUser = Convert.userOptional.toBackend(user)
        const modifyRequest = await fetch(`${HOST_DOMAIN}${PREFIX}/user/${user.id}`,
            {
                method: 'PUT',
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
 * @param event
 * @constructor
 */
export const modifyEvent = async (event: HackathonOptional & { id: string }) => {
    if (!useMock) {
        //@TODO implement (with Convert)
        return false
    } else {
        await sleep(300)
        return true
    }
}

export const setSelectedSkills = (skills: UserSkill[]) => {

}

export const updateImage = async (image: File, path: string) => {
    if (!mockImplemented) {
        let formData = new FormData()

        formData.append('file', image)
        const userAvatarResponse = await fetch(path, {
            method: 'POST',
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

export const updateEventLogo = async (image: File, userID: string) => {
    // return updateImage(image, `${HOST_DOMAIN}${PREFIX}/user/${userID}/image`)
}

export const updateEventBackground = async (image: File, userID: string) => {
    // return updateImage(image, `${HOST_DOMAIN}${PREFIX}/user/${userID}/image`)
}