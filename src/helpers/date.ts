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

export function convertUtcToLocalDateShort(inputDate: string, language: string) {
    const localDate = new Date(inputDate + "z")
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }

    const formattedDateParts = new Intl.DateTimeFormat(language, options).formatToParts(localDate)
    const day = formattedDateParts.find(part => part.type === 'day')?.value || ''
    const month = formattedDateParts.find(part => part.type === 'month')?.value || ''
    const year = formattedDateParts.find(part => part.type === 'year')?.value || ''
    const hour = formattedDateParts.find(part => part.type === 'hour')?.value || ''
    const minute = formattedDateParts.find(part => part.type === 'minute')?.value || ''

    return `${day}-${month}-${year} ${hour}:${minute}h`
}