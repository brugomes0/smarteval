import LL from "../i18n/i18n-svelte"

export function validateRatingGroup(ratingGroup: CreateRatingGroupData, step: number, languagesChosen?: string[]) {
    let message: string = ""

    if (step === 0) {
        if (ratingGroup.title === "") return message = errorMessage("ratingGroupTitle")
        if (languagesChosen?.length === 0) return message = errorMessage("noLanguages")
    } else if (step === 1) {
        if (ratingGroup.ratingOptions.length < 2) return message = errorMessage("noRatingOptions")

        for (let rto of ratingGroup.ratingOptions) {
            for (let trans of rto.translations) {
                if (trans.title === "") return message = errorMessage("ratingOptionTitle", rto.numericValue, trans.language)
            }
        }
    }
}

function errorMessage(type: string, position?: number, language?: string) {
    let errorMessage: string = ""

    let subscription = LL.subscribe(ll => {
        switch(type) {
            case "noLanguages":
                errorMessage = ll.CreateRatingGroups.ValidationError.NoLanguages()
                break
            case "noRatingOptions":
                errorMessage = ll.CreateRatingGroups.ValidationError.NoRatingOptions()
                break
            case "ratingGroupTitle":
                errorMessage = ll.CreateRatingGroups.ValidationError.RatingGroupTitle()
                break
            case "ratingOptionTitle":
                errorMessage = ll.CreateRatingGroups.ValidationError.RatingOptionTitle({ position, language })
                break
            default:
                errorMessage = "Error"
                break
        }
    })

    subscription()
    return errorMessage
}