export function convertUtcToLocalDate(inputDate: string, language: string) {
    const localDate = new Date(inputDate + "z")
    const options = new Intl.DateTimeFormat(language, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })

    return options.format(localDate)
}

export function convertLocalToUtcDate(inputDate: string) {
    let userTime = new Date(inputDate)
    
    return userTime.toISOString()
}