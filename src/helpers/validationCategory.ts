import LL from "../i18n/i18n-svelte"
import { getFullLanguageText } from "./action"

export function validateCategory(category: CreateCategoryData, step: number) {
    let message: string = ""

    if (step === 0) {
        for (let translation of category.translations) {
            if (translation.title === "") return message = errorMessage("categoryTitle", getFullLanguageText(translation.language))
        }
    } else {
        if (step === 2 && category.questions.length === 0) return message = errorMessage("noQuestions")

        for (let question of category.questions) {
            for (let translation of question.translations) {
                if (step === 1 && question.type === 'Rating' && translation.title === "") return message = errorMessage("questionTitle")
                if (step === 2 && question.type === 'Text' && translation.title === "") return message = errorMessage("questionTitle")
            }
        }
    }
}

function errorMessage(type: string, language?: string) {
    let errorMessage: string = ""

    let subscription = LL.subscribe(ll => {
        switch(type) {
            case "categoryTitle":
                errorMessage = ll.CreateCategory.ValidationError.CategoryTitle({ language })
                break
            case "noQuestions":
                errorMessage = ll.CreateCategory.ValidationError.NoQuestions()
                break
            case "questionTitle":
                errorMessage = ll.CreateCategory.ValidationError.QuestionTitle()
                break
            default:
                errorMessage = "Error"
                break
        }
    })

    subscription()
    return errorMessage
}