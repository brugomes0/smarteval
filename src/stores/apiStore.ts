import { writable } from "svelte/store"

export const API_URL = writable("")

export function getUrl() {
    let x = ""
    API_URL.subscribe(temp => x = temp)
    return x
}