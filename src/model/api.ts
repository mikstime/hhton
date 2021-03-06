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
        inTeam: true,
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: [],
    },
    {
        id: '14',
        firstName: 'Имя',
        lastName: 'Фамилия2',
        inTeam: false,
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: [],
    },
    {
        id: '11',
        firstName: 'Имя',
        lastName: 'Фамилия3',
        inTeam: true,
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: [],
    },
    {
        id: '113',
        firstName: 'Имя',
        lastName: 'Фамилия',
        inTeam: true,
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: [],
    },
    {
        id: '112',
        firstName: 'Имя',
        lastName: 'Фамилия2',
        inTeam: false,
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: [],
    },
    {
        id: '111',
        firstName: 'Имя',
        lastName: 'Фамилия3',
        inTeam: true,
        avatar: 'http://loremflickr.com/1000/1000',
        isInvited: false,
        bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
        jobName: 'Тинькофф',
        skills: {
            tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
            description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
        },
        hackathons: [],
    },
]


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
        if(id.length > 3)
            return null

        const user = TEST_USERS.find(u => u.id === id)

        if(user) {
            return user
        }
        return {
            firstName: 'Имя' + id,
            lastName: 'Фамилия',
            inTeam: true,
            isInvited: false,
            bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
            jobName: 'Тинькофф',
            avatar: 'http://loremflickr.com/1000/1000',
            id: id,
            skills: {
                tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
                description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
            },
            hackathons: [],
        }
    }
}

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
        }
    }
}

export const invitePerson = async (inviterId: string, inviteeId: string) => {
    if (!useMock) {
        console.log(inviteeId, inviterId)
        //@TODO implement
    } else {
        await sleep(300)
        return true
    }
}


export const joinEvent = async (userId: string, eventId: string) => {
    if (!useMock) {
        console.log(userId,eventId)
        //@TODO implement
    } else {
        await sleep(300)
        return true
    }
}

export const leaveEvent = async (userId: string, eventId: string) => {
    if (!useMock) {
        console.log(userId,eventId)
        //@TODO implement
    } else {
        await sleep(300)
        return true
    }
}

export const findUsers = async (userId: string) => {
    if (!useMock) {
        //@TODO implement
        return []
    } else {
        await sleep(300)

        return TEST_USERS.filter(u => u.id.startsWith(userId))
    }
}


export const getJobs = async () => {
    if (!useMock) {
        //@TODO implement
        return []
    } else {
        await sleep(300)
        return ['Frontend', 'Backend', '3D designer', 'Product Manager', 'UX/UI', 'DevOps', 'Другое']
    }
}


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


export const getFeed = async (query: string, since?: string) => {
    if (!useMock) {
        console.log(query, since)
        //@TODO implement
        return [] as string[]
    } else {
        await sleep(300)
        return TEST_USERS.map(u => u.id)
    }
}