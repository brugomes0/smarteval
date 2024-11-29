<script lang="ts">
    import { convertUtcToLocalDate, isDateAfter } from "../helpers/date"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { AsteriskIcon, CalendarIcon, ClipboardIcon, ClipboardListIcon, FolderIcon, HourglassIcon, SendIcon, UserIcon } from "lucide-svelte"
    import LL from "../i18n/i18n-svelte"
    import { getEvaluationTypeText } from "../helpers/action"
    import toast, { Toaster } from "svelte-french-toast"
    import { navigate } from "svelte-routing"

    export let lang: string
    export let submissionId: string

    let answers: any = []
    let disableAnswers: boolean = false
    let loading: boolean = true
    let submission: SingleSubmissionData

    async function getForm() {
        let response = await requestToApi("GET", `SmartEval/Submissions/${submissionId}/Form`)
        if (response.statusCode === 200) { 
            submission = response.data
            disableAnswers = !isDateAfter(submission.endDate)
            submission.endDate = convertUtcToLocalDate(submission.endDate, lang)
            submission.type = getEvaluationTypeText(submission.type)
        }
    }

    async function saveSubmission() {
        const invalidAnswers = answers.filter((answer: any) => answer.needComment && (answer.ratingValueComment == null || answer.ratingValueComment == ""))
        if (invalidAnswers.length > 0) {
            toast.error($LL.SingleSubmission.ToastNeedCommentError())
            return
        }

        let response = await requestToApi("PATCH", `SmartEval/Submissions/${submissionId}`, answers)
        if (response.statusCode === 200) {
            toast.success($LL.SingleSubmission.ToastSubmission())
            navigate("/submissions")
        } else { toast.error($LL.SingleSubmission.ToastSubmissionError()) }
    }

   
    function answerNeedsComment(questionId: string, ratingOption: RatingOptionData) {
        answers[findQuestionIndex(questionId)].needComment = ratingOption.needComment
    }

    function findQuestionIndex(questionId: string) { return answers.findIndex((answer: any) => answer.questionId === questionId) }

    onMount(async () => {
        await getForm()

        answers = submission.template.flatMap(cat =>
            cat.questions.map(q => {
                const previousAnswer = submission.answers.find(ans => ans.questionId === q.questionId)
                return {
                    questionId: q.questionId,
                    textResponse: previousAnswer ? previousAnswer.textResponse : null,
                    ratingValueResponse: previousAnswer ? previousAnswer.ratingValueResponse : null,
                    ratingValueComment: previousAnswer ? previousAnswer.ratingValueComment : null,
                    needComment: previousAnswer ? submission.ratingOptions.find(temp => temp.numericValue == previousAnswer.ratingValueResponse)?.needComment : false
                }
            })
        )

        loading = false
    })
</script>

{#if !loading}
    <div class="flex flex-col gap-y-5">
        <div class="border flex flex-col rounded border-gray-300">
            <div class="border-b flex gap-x-2 items-center p-4 rounded-t bg-gray-100 border-gray-300">
                <span class="font-semibold text-lg text-gray-800">{$LL.SingleSubmission.InfoSubmission()}</span>
                <span class="font-semibold hidden md:inline text-lg text-gray-800">-</span>
                <span class="hidden md:inline text-base text-gray-400">#{submission.submissionId}</span>
            </div>
            <div class="flex flex-col gap-y-4 p-4">
                {#if submission.type !== "SelfEvaluation"}
                    <label class="flex flex-col">
                        <span class="font-medium text-xs">{submission.evaluatedEmployee ? $LL.SingleSubmission.EvaluatedEmployee() : $LL.SingleSubmission.EvaluatedDepartment()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={submission.evaluatedEmployee ? UserIcon : FolderIcon} />
                            {#if submission.evaluatedEmployee}
                                <input bind:value={submission.evaluatedEmployee} class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400" disabled />
                            {:else}
                                <input bind:value={submission.evaluatedDepartment} class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400" disabled />
                            {/if}
                        </div>
                    </label>
                {/if}
                <label class="flex flex-col">
                    <span class="font-medium text-xs">{$LL.SingleSubmission.ReviewName()}</span>
                    <div class="flex gap-x-2 items-center pl-2 w-full">
                        <svelte:component this={ClipboardIcon} />
                        <input bind:value={submission.review} class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400" disabled />
                    </div>
                </label>
                <div class="flex flex-col md:flex-row gap-x-4 gap-y-4">
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleSubmission.EvaluationType()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={ClipboardListIcon} />
                            <input bind:value={submission.type} class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400" disabled />
                        </div>
                    </label>
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleSubmission.EndDate()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={CalendarIcon} />
                            <input bind:value={submission.endDate} class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400" disabled />
                        </div>
                    </label>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-y-2">
            <div class="flex flex-col">
                <span class="font-semibold text-lg text-gray-800">{$LL.SingleSubmission.SubmissionForm()}</span>
                <div class="flex items-center justify-end">
                    <svelte:component this={AsteriskIcon} size={14} />
                    <span class="text-xs">{$LL.SingleSubmission.Required()}</span>
                </div>
            </div>
            <div class="flex flex-col gap-y-4">
                {#each submission.template as category}
                    <div class="flex flex-col">
                        <span class="font-medium text-lg text-gray-800">
                            {#if category.translations.find(trans => trans.language == lang)}
                                {category.position} - {category.translations.find(trans => trans.language == lang)?.title}
                            {:else}
                                {category.position} - {category.translations[0].title}
                            {/if}
                        </span>
                        <span class="hidden lg:inline text-xs text-gray-400">
                            {#if category.translations.find(trans => trans.language == lang)}
                                {category.translations.find(trans => trans.language == lang)?.description}
                            {:else}
                                {category.translations[0].description}
                            {/if}
                        </span>
                        <div class="flex flex-col gap-y-2 px-2">
                            {#each category.questions as question}
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-x-1">
                                        <span class="text-base text-gray-800">
                                            {#if question.translations.find(trans => trans.language == lang)}
                                                {question.position} - {question.translations.find(trans => trans.language == lang)?.title}
                                            {:else}
                                                {question.position} - {question.translations[0].title}
                                            {/if}
                                        </span>
                                        {#if question.isRequired}
                                            <svelte:component this={AsteriskIcon} size={14} />
                                        {/if}
                                    </div>
                                    <span class="hidden lg:inline text-xs text-gray-400">
                                        {#if question.translations.find(trans => trans.language == lang)}
                                            {question.translations.find(trans => trans.language == lang)?.description}
                                        {:else}
                                            {question.translations[0].description}
                                        {/if}
                                    </span>
                                    {#if question.type == "Rating"}
                                        <div class="flex flex-wrap gap-x-2 gap-y-2 p-2">
                                            {#each submission.ratingOptions as ratingOption}
                                                <label class="flex gap-x-1 items-center px-2 py-1 rounded {disableAnswers ? '' : 'cursor-pointer hover:bg-gray-100'}">
                                                    <input
                                                        bind:group={answers[findQuestionIndex(question.questionId)].ratingValueResponse}
                                                        on:change={() => answerNeedsComment(question.questionId, ratingOption)}
                                                        disabled={disableAnswers} type="radio" value={ratingOption.numericValue}
                                                    />
                                                    <span class="font-normal text-sm text-gray-800">
                                                        {#if ratingOption.translations.find(trans => trans.language == lang)}
                                                            {ratingOption.translations.find(trans => trans.language == lang)?.title}
                                                        {:else}
                                                            {ratingOption.translations[0].title}
                                                        {/if}
                                                    </span>
                                                </label>
                                            {/each}
                                        </div>
                                    {:else if question.type == "Text"}
                                        <textarea bind:value={answers[findQuestionIndex(question.questionId)].textResponse} class="border p-1 rounded text-sm bg-gray-100 border-gray-300" disabled={disableAnswers} rows="2" />
                                    {/if}

                                    {#if answers[findQuestionIndex(question.questionId)].needComment}
                                        <textarea bind:value={answers[findQuestionIndex(question.questionId)].ratingValueComment} class="border p-1 rounded text-sm bg-gray-100 border-gray-300" disabled={disableAnswers} rows="2" />
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        {#if !disableAnswers}
            <div class="flex items-center justify-center">
                <button on:click={saveSubmission} class="flex gap-x-2 items-center font-semibold p-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                    <span>{$LL.SingleSubmission.Submit()}</span>
                    <svelte:component this={SendIcon} />
                </button>
            </div>
        {/if}
    </div>
{/if}