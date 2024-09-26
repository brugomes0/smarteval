import { getCookie, setCookie } from "./cookie"
import { getUrl } from "../stores/apiStore"

// Function to change access token with refresh token
export async function requestNewTokens() {
    let apiUrl = getUrl()
    let accessToken = getCookie('se_at') ?? ''
    let refreshToken = getCookie('se_rt') ?? ''

    refreshToken = encodeURIComponent(refreshToken)
    let response = await fetch(`${apiUrl}Accounts?refreshToken=${refreshToken}`, {
        method: 'POST',
        headers: { 
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })

    if (response.status === 200) {
        let responseJson = await response.json()
        setCookie('se_at', responseJson.data.token)
        setCookie('se_rt', responseJson.data.refreshToken)
    }
}

// Function to make every request
export async function requestToApi(method: string, endpoint: string, body?: any) {
    let apiUrl = getUrl()
    let accessToken = getCookie('se_at') ?? ''

    let response = await fetch(`${apiUrl}` + endpoint, {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: body && JSON.stringify(body)
    })

    let responseJson = await response.json()
    if (responseJson.error === 'Token has expired') {
        let refreshToken = getCookie('se_rt') ?? ''
        refreshToken = encodeURIComponent(refreshToken)

        await requestNewTokens()

        accessToken = getCookie('se_at') ?? ''
        refreshToken = getCookie('se_rt') ?? ''

        let response = await fetch(`${apiUrl}` + endpoint, {
            method: method,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body)
        })

        let responseJson = await response.json()
        return responseJson
    }

    return responseJson
}

// Function to make request for access/refresh tokens with auth token
export async function requestTokens(authToken: string) {
    let apiUrl = getUrl()
    let response = await fetch(`${apiUrl}Accounts?token=${authToken}`)
    let responseJson = await response.json()
    return responseJson
}