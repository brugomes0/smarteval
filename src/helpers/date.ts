export function convertUtcToLocalDate(inputDate: string, language: string) {
    const localDate = new Date(inputDate + "z")
    const options = new Intl.DateTimeFormat(language, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })

    return options.format(localDate)
}

export function convertLocalToUtcDate(inputDate: string) {
    let userTime = new Date(inputDate)
    
    return userTime.toISOString()
}

export function isDateAfter(firstDate: string, secondDate?: string) {
    let date1 = new Date(firstDate)
    let date2: Date
    if (secondDate) { 
        date2 = new Date(secondDate)
    } else date2 = new Date()

    return date1 > date2
}