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