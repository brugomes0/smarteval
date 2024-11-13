import LL from "../i18n/i18n-svelte"

export function validateSubmission(submission: CreateSubmissionData, evaluationType: string) {
    let message: string = ""

    if (evaluationType != "Interdepartamental" && submission.evaluatedEmployeeId == null) return message = errorMessage("evaluatedEmployee")
    else if (submission.evaluatorEmployeeId == null) return message = errorMessage("evaluatorEmployee")
    else if (evaluationType == "Interdepartamental" && submission.evaluatedDepartmentId == null) return message = errorMessage("evaluatedDepartment")
    else if (evaluationType == "Interdepartamental" && submission.evaluatorDepartmentId == null) return message = errorMessage("evaluatorDepartment")

    return message
}

function errorMessage(type: string) {
    let errorMessage: string = ""

    let subscription = LL.subscribe(ll => {
        switch(type) {
            case "evaluatedDepartment":
                errorMessage = ll.Submissions.ValidationEvaluatedDepartmentError()
                break
            case "evaluatorDepartment":
                errorMessage = ll.Submissions.ValidationEvaluatorDepartmentError()
                break
            case "evaluatedEmployee":
                errorMessage = ll.Submissions.ValidationEvaluatedEmployeeError()
                break
            case "evaluatorEmployee":
                errorMessage = ll.Submissions.ValidationEvaluatorEmployeeError()
                break
            default:
                errorMessage = "error"
                break
        }
    })

    subscription()
    return errorMessage
}