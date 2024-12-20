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

export function getEvaluationTypeText(type: string): string {
    let text: string = ""
    let subscription = LL.subscribe(l => {
        switch(type) {
            case "TopDown":
                text = l.EvaluationTypes.TopDown()
                break
            case "BottomUp":
                text = l.EvaluationTypes.BottomUp()
                break
            case "SelfEvaluation":
                text = l.EvaluationTypes.SelfEvaluation()
                break
            case "Interdepartamental":
                text = l.EvaluationTypes.Interdepartmental()
                break
            case "TeamEvaluation":
                text = l.EvaluationTypes.Departmental()
                break
            default:
                text = "Error"
                break
        }
    })
    
    subscription()
    return text
}

// Function to get the right translation
export function getTranslation(translations: any[], showingLang: string) {
    return translations.find(t => t.language === showingLang) || 
           translations.find(t => t.language === "PT") || 
           translations[0]
}

export function translationExistInLang(translations: any[], showingLang: string): boolean {
    return translations.some(t => t.language === showingLang)
}