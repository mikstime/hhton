import {EventEmitter} from 'events';
import {waitFor} from 'wait-for-event';
import {updateUserAvatar} from "../../model/api";

let userAvatar: File;
const userAvatarChanged = new EventEmitter();
const userAvatarSelector = document.createElement('input');
userAvatarSelector.setAttribute('type', 'file');
userAvatarSelector.addEventListener("change", async function handleFile() {
    const fileList = this.files

    if (fileList != null && fileList.length != 0) {
        userAvatar = fileList[0]
        userAvatarChanged.emit('chosen')
    }
}, false)

/**
 * @returns {string|boolean} – возвращает ссылку на изображение в случае успеха, и false при неудаче.
 */
export const editUserAvatar = async () => {
    //@TODO загрузить картинку (png, svg, gif)
    //@TODO отправить на сервер
    //@TODO вернуть, картинку, полученную с сервера
    // TODO Нет id юзера
    // return false
    const userID = '1'


    userAvatarSelector.click();
    await waitFor('chosen', userAvatarChanged)

    return await updateUserAvatar(userAvatar, userID)
}

/**
 * @returns {string|boolean} – возвращает ссылку на изображение в случае успеха, и false при неудаче.
 */
export const editEventBackground = () => {
    //@TODO загрузить картинку (png, svg, gif)
    //@TODO отправить на сервер
    //@TODO вернуть, картинку, полученную с сервера
    // return false
    return `http://loremflickr.com/1000/1000?t=${new Date()}`
}

/**
 * @returns {string|boolean} – возвращает ссылку на изображение в случае успеха, и false при неудаче.
 */
export const editEventLogo = () => {
    //@TODO загрузить картинку (png, svg, gif)
    //@TODO отправить на сервер
    //@TODO вернуть, картинку, полученную с сервера
    // return false
    return `http://loremflickr.com/1000/1000?t=${new Date()}`
}