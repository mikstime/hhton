import {HOST_DOMAIN} from '../config/network'
import {sleep} from '../utils'
import background from '../assets/background.png'
import logo from '../assets/logo.png'
import {NULL_USER} from '../components/tools/use-app-state'
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
        if(id.length > 3)
            return null

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
            settings: {}
        }
    }
}

export const invitePerson = async (inviterId: string, inviteeId: string) => {
    if (!useMock) {
        //@TODO implement
    } else {
        console.log(inviterId, inviteeId)
        await sleep(300)
        return true
    }
}