import {EventEmitter} from 'events';
import {waitFor} from 'wait-for-event';
import {updateEventBackground, updateEventLogo, updateUserAvatar} from "../../model/api";

let pic: File;
const picChanged = new EventEmitter();
const picSelector = document.createElement('input');
picSelector.setAttribute('accept', 'image/jpeg, image/png')
picSelector.setAttribute('type', 'file');
picSelector.addEventListener("change", async function handleFile() {
    const fileList = this.files

    if (fileList != null && fileList.length != 0) {
        pic = fileList[0]
        picChanged.emit('chosen')
    }
}, false)

/**
 * @returns {string|boolean} – возвращает ссылку на изображение в случае успеха, и false при неудаче.
 */
export const editUserAvatar = async (userId: string) => {
    picSelector.click();
    await waitFor('chosen', picChanged)

    return await updateUserAvatar(pic, userId)
}

/**
 * @returns {string|boolean} – возвращает ссылку на изображение в случае успеха, и false при неудаче.
 */
export const editEventBackground = async (eventId: string) => {
    picSelector.click();
    await waitFor('chosen', picChanged)

    return await updateEventBackground(pic, eventId)
}

/**
 * @returns {string|boolean} – возвращает ссылку на изображение в случае успеха, и false при неудаче.
 */
export const editEventLogo = async (eventId: string) => {
    picSelector.click();
    await waitFor('chosen', picChanged)

    return await updateEventLogo(pic, eventId)
}