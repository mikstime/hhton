import {HOST_DOMAIN} from '../config/network'
import {sleep} from '../utils'
import {NULL_USER} from '../components/tools/use-app-state/use-app-state'
import background from '../assets/background.png'
import logo from '../assets/logo.png'
const useMock = true

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
        return {
            firstName: 'Имя',
            lastName: 'Фамилия',
            bio: 'Небольшое био. Содержит основную информацию о человеке. Опционально. Может содержать несколько строк текста.',
            jobName: 'Тинькофф',
            avatar: 'http://loremflickr.com/400/400',
            id: id,
            skills: {
                tags: ['Frontend', 'React', 'Angular', 'CSS', 'Backend', 'Node.js', 'Golang', 'Postgres'],
                description: 'Используйте этот стиль, если хотите выделить информацию в общем списке. Пример использования: подробная информация на странице сообщества'
            },
            hackathons: []
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
            participants: new Array(270).map(r => NULL_USER),
            prizes: [],
            settings: {}
        }
    }
}