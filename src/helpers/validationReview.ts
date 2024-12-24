import LL from "../i18n/i18n-svelte"

export function validateReview(review: CreateReviewData|EditReviewData, step: number) {
    let message: string = ""
    let stepTypeMap: Record<number, string> = { 1: "TopDown", 2: "BottomUp", 3: "SelfEvaluation", 4: "TeamEvaluation", 5: "Interdepartamental" }

    if (step === 0) {
        if (review.title === "") return message = errorMessage("reviewTitle")
    } else if (step >= 1 && step <= 5) {
        const evaluationType = stepTypeMap[step]
        for (let evaluation of review.evaluations) {
            if (evaluation.type === evaluationType) {
                let accValue = 0
                if (evaluation.ratingGroupId === "") return message = errorMessage("noRatingGroup")
                //if (evaluation.totalValue === 0) return message = errorMessage("noEvaluationValue")
                if (evaluation.template.length === 0) return message = errorMessage("noEvaluationTemplate")
                for (let category of evaluation.template) {
                    accValue += category.value
                    if (category.questions.length === 0) return message = errorMessage("noCategoryQuestions")
                    if (category.value === 0) return message = errorMessage("noCategoryValue")
                }
                if (accValue != 100) return message = errorMessage("categoriesTotalValueNot100")
            }
        }
    } else if (step === 6) {
        if (review.evaluations.find(e => e.type === "Interdepartamental") && review.departments.length === 0) return message = errorMessage("noDepartments")
        if (review.evaluations.find(e => e.type !== "Interdepartamental") && review.employees.length === 0) return message = errorMessage("noEmployees")
    } else if (step === 7) {
        if (review.evaluations.length === 0) return message = errorMessage("noEvaluations")
    }

    return message
}

function errorMessage(type: string, language?: string) {
    let errorMessage: string = ""

    let subscription = LL.subscribe(ll => {
        switch(type) {
            case "categoriesTotalValueNot100":
                errorMessage = ll.CreateReviews.ValidationError.CategoriesTotalValueNot100()
                break
            case "noCategoryQuestions":
                errorMessage = ll.CreateReviews.ValidationError.NoCategoryQuestion()
                break
            case "noCategoryValue":
                errorMessage = ll.CreateReviews.ValidationError.NoCategoryValue()
                break
            case "noDepartments":
                errorMessage = ll.CreateReviews.ValidationError.NoDepartments()
                break
            case "noEmployees":
                errorMessage = ll.CreateReviews.ValidationError.NoEmployees()
                break
            case "noEvaluations":
                errorMessage = ll.CreateReviews.ValidationError.NoEvaluations()
                break
            case "noEvaluationTemplate":
                errorMessage = ll.CreateReviews.ValidationError.NoEvaluationTemplate()
                break
            case "noEvaluationValue":
                errorMessage = ll.CreateReviews.ValidationError.NoEvaluationValue()
                break
            case "noRatingGroup":
                errorMessage = ll.CreateReviews.ValidationError.NoSelectionRatingGroup()
                break
            case "reviewTitle":
                errorMessage = ll.CreateReviews.ValidationError.NoTitle()
                break
            default:
                errorMessage = "Error"
                break
        }
    })

    subscription()
    return errorMessage
}