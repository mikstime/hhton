import {HOST_DOMAIN} from '../config/network'
import {sleep} from '../utils'
import background from '../assets/background.png'
import logo from '../assets/logo.png'
import {NULL_USER} from '../components/tools/use-app-state'
import {User} from '../components/tools/use-app-state/user'

const useMock = true


const TEST_USERS: User[] = [
    {
        id: '13',
        firstName: 'Имя',
        lastName: 'Фамилия',
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
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
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
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
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
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
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
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
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
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
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: []
    }
]

/**
 * Получить информацию о пользователе, включая информацию об участии пользователя в хакатонах
 * @param id
 */
export const fetchUser = async (id: string) => {
    if (!useMock) {
        const user = await fetch(`${HOST_DOMAIN}/api/user/${id}`)

        if (user.ok) {
            const json = await user.json()

            return {...json}
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
 * @param inviterId
 * @param inviteeId
 */
export const isInvited = async (inviterId: string, inviteeId: string) => {
    if (!useMock) {
        return true
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
    if (!useMock) {
        const event = await fetch(`${HOST_DOMAIN}/api/event/${id}`)

        if (event.ok) {
            const json = await event.json()

            return {...json}
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
export const isParticipating = async (userId: string, eventId: string) => {
    if (!useMock) {
        return true
    } else {
        await sleep(300)
        return true
    }
}


/**
 * Пригласить пользователя в команду. Возвращает true в случае успеха
 * @param inviterId
 * @param inviteeId
 */
export const invitePerson = async (inviterId: string, inviteeId: string) => {
    if (!useMock) {
        console.log(inviteeId, inviterId)
        //@TODO implement
        return true
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
    if (!useMock) {
        console.log(userId, eventId)
        //@TODO implement
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
    if (!useMock) {
        console.log(userId, eventId)
        //@TODO implement
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
    if (!useMock) {
        //@TODO implement
        return []
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
    if (!useMock) {
        console.log(job)
        //@TODO implement
        return []
    } else {
        await sleep(300)
        return ['React', 'Angular', 'TypeScript']
    }
}

/**
 * Возвращает массив id пользователей
 * @param query – строка типа j=Frontend&skills=Angular|TypeScript
 * @param sinceId
 */
export const getFeed:
    (query: string, sinceId?: string) => Promise<string[]>
    = async (query: string, sinceId?: string) => {
    if (!useMock) {
        console.log(query, sinceId)
        //@TODO implement
        return []
    } else {
        await sleep(300)
        return TEST_USERS.map(u => u.id)
    }
}

/**
 * Возвращает объект типа Team
 * @param userId - id пользователя, чью команду запрашиваем
 */
export const getTeam = async (userId: string) => {
    if (!useMock) {
        //@TODO implement
        return {
            members: [] as User[]
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
        await sleep(300)
        return TEST_USERS[0]
    }
}