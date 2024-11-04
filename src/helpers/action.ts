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

export function getFullReviewStatusText(status: string, noun: string): string {
    let text: string = ""
    let subscription = LL.subscribe(l => {
        switch(status) {
            case "Active":
                if (noun === "plural") { text = l.ReviewStatus.Active(); break; }
                else { text = l.ReviewStatus.SingleActive(); break; }
            case "NotStarted":
                if (noun === "plural") { text = l.ReviewStatus.NotStarted(); break; }
                else { text = l.ReviewStatus.SingleNotStarted(); break; }
            case "Canceled":
                if (noun === "plural") { text = l.ReviewStatus.Canceled(); break; }
                else { text = l.ReviewStatus.SingleCanceled(); break; }
            case "Completed":
                if (noun === "plural") { text = l.ReviewStatus.Completed(); break; }
                else { text = l.ReviewStatus.SingleCompleted(); break; }
            default:
                text = "Error"
                break
        }
    })

    subscription()
    return text
}