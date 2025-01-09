export function getCookie(name: string) {
    debugger;
    try {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)

        if (parts.length === 2) return parts.pop()?.split(';').shift()
    } catch (error) {
        console.error(error)
    }
}

export function setCookie(name: string, value: string) {
    try {
        let cookieValue = getCookie(name)
        if (cookieValue) {
            deleteCookie(name)
        }
        document.cookie = `${name}=${value}`
    } catch (error) {
        console.log(error)
    }
}

export function deleteCookie(name: string) {
    document.cookie = `${name}=; expire=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}