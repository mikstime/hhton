export const sleep = (time: number) => new Promise<void>((resolve) => {
    setTimeout(() => {
        resolve()
    }, time)
})

export const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
        document.execCommand('copy')
    } catch (err) {
        console.error(err)
    }

    document.body.removeChild(textArea)
}

export const copyTextToClipboard = (text: string) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text)
        return
    }
    navigator.clipboard.writeText(text).catch(e => console.error(e))
}

export const styledBorder = 'border: 3px solid rgba(0,0,0,.7);'