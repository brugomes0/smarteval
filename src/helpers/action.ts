// FILE FOR RANDOM FUNCTIONS
import LL from "../i18n/i18n-svelte"

export function getFullLanguageText(langAbbrev: string): string {
    let text: string = ""
    let subscription = LL.subscribe(l => {
        switch(langAbbrev) {
            case "PT":
                text = l.Languages.PT()
                break
            case "EN":
                text = l.Languages.EN()
                break
            case "ES":
                text = l.Languages.ES()
                break
            case "FR":
                text = l.Languages.FR()
                break
            case "PL":
                text = l.Languages.PL()
                break
            default:
                text = "Not supposed to be here"
                break
        }
    })
    
    subscription()
    return text
}

export function getFullReviewStatusText(status: string): string {
    let text: string = ""
    let subscription = LL.subscribe(l => {
        switch(status) {
            case "Active":
                text = l.ReviewStatus.Active()
                break
            case "NotStarted":
                text = l.ReviewStatus.NotStarted()
                break
            case "Canceled":
                text = l.ReviewStatus.Canceled()
                break
            case "Completed":
                text = l.ReviewStatus.Completed()
                break
            default:
                text = "Error"
                break
        }
    })

    subscription()
    return text
}