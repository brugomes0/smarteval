<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { CalendarCheck2Icon, CalendarClockIcon, CalendarDaysIcon, CalendarPlusIcon, CalendarX2Icon, HourglassIcon, PencilIcon, Trash2Icon, UserIcon } from "lucide-svelte"
    import { convertUtcToLocalDate, isDateAfter } from "../helpers/date"
    import { getFullLanguageText, getFullReviewStatusText } from "../helpers/action"
    import { Link, navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"

    export let lang: string
    export let reviewId: string
    export let user: UserData

    let buttonDelete: boolean = false
    let buttonEdit: boolean = false
    let buttonPatch: boolean = false
    let evaluationActive: string = ""
    let isReviewUpToDate: boolean = false
    let languageSelected: string = ""
    let loading: boolean = true
    let loadingEval: boolean = true
    let review: ReviewData = { reviewId: "", title: "", description: "", createByUser: "", createDate: "", startDate: "", endDate: "", status: "", evaluationsAvailable: [], evaluations: [] }
    let reviewPatch: { startDate: string | undefined, endDate: string | undefined, status: string } = { status: "", startDate: undefined, endDate: undefined }
    let reviewStatus: string = ""
    let timeoutId: any

    async function changeReviewStatus(newStatus: string) {
        reviewPatch.status = newStatus
        let response = await requestToApi("PATCH", `SmartEval/Reviews/${reviewId}/ChangeStatus`, reviewPatch)
        if (response.statusCode == 200) {
            toast.success("Review changed status successfully.")
            navigate("/reviews")
        } else {
            toast.error("Cannot change status of review")
        }
    }

    async function getEvaluation() {
        if (!Array.isArray(review.evaluations)) review.evaluations = []

        if (review.evaluations.length > 0) {
            const evaluationExist = review.evaluations.find((temp: any) => temp.type === evaluationActive)
            if (evaluationExist) { languageSelected = evaluationExist.availableInLanguages[0]; loadingEval = false; return; }
        }

        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewId}/Evaluation?evaluationType=${evaluationActive}`)
        if (response.statusCode === 200) review.evaluations = [...review.evaluations, response.data]

        languageSelected = response.data.availableInLanguages[0]
        loadingEval = false
    }

    async function getReview() {
        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewId}`)
        if (response.statusCode === 200) {
            review = response.data
            evaluationActive = review.evaluationsAvailable[0]
            isReviewUpToDate = isDateAfter(review.endDate)
            reviewStatus = getFullReviewStatusText(review.status, "singular")
            if (review.createDate) review.createDate = convertUtcToLocalDate(review.createDate, lang)
            if (review.startDate) review.startDate = convertUtcToLocalDate(review.startDate, lang)
            if (review.endDate) review.endDate = convertUtcToLocalDate(review.endDate, lang)
        }
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function getTranslation(translations: {language: string, title: string, description: string}[], languageSelected: string) { return translations.find(t => t.language === languageSelected)}

    function handleEvalChange(evaluation: string) {
        if (evaluationActive == evaluation) return;
        loadingEval = true
        evaluationActive = evaluation
        debounce(getEvaluation, 500)
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === "Reviews")
        const permissionToDelete = windowPermission?.permissions.find(temp => temp.permissionType === "Delete")
        const permissionToEdit = windowPermission?.permissions.find(temp => temp.permissionType === "Update")
        const permissionToPatch = windowPermission?.permissions.find(temp => temp.permissionType === "Patch")

        if (permissionToDelete?.hasPermission) buttonDelete = true
        if (permissionToEdit?.hasPermission) buttonEdit = true
        if (permissionToPatch?.hasPermission) buttonPatch = true

        await getReview()
        await getEvaluation()
        loading = false
    })
</script>

{#if !loading}
    <div class="flex flex-col gap-y-2">
        <!-- DETAILS TABLE -->
        <div class="border flex flex-col rounded border-gray-300">
            <div class="border-b flex justify-between p-4 rounded-t bg-gray-100 border-gray-300">
                <span class="font-semibold text-lg">{review.title}</span>
            </div>
            <div class="flex flex-col gap-y-4 p-4">
                <label>
                    <span class="font-medium text-xs">{$LL.SingleReview.Description()}</span>
                    <div class="flex gap-x-2 items-center pl-2 w-full">
                        <textarea
                            bind:value={review.description}
                            class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400"
                            disabled
                            id="reviewDescription"
                            rows={2}
                        />
                    </div>
                </label>
                <div class="flex flex-col md:flex-row gap-x-4 gap-y-4">
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleReview.Status()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={HourglassIcon} />
                            <input
                                bind:value={reviewStatus}
                                class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400"
                                disabled
                                id="reviewStatus"
                            />
                        </div>
                    </label>
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleReview.CreateBy()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={UserIcon} />
                            <input
                                bind:value={review.createByUser}
                                class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400"
                                disabled
                                id="reviewCreateByUser"
                            />
                        </div>
                    </label>
                </div>
                <div class="flex flex-col lg:flex-row gap-x-4 gap-y-4">
                    {#if review.createDate}
                        <label class="flex flex-col w-full">
                            <span class="font-medium text-xs">{$LL.SingleReview.DateCreate()}</span>
                            <div class="flex gap-x-2 items-center pl-2 w-full">
                                <svelte:component this={CalendarDaysIcon} />
                                <input
                                    bind:value={review.createDate}
                                    class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400"
                                    disabled
                                    id="reviewCreateDate"
                                />
                            </div>
                        </label>
                    {/if}
                    {#if review.startDate}
                        <label class="flex flex-col w-full">
                            <span class="font-medium text-xs">{$LL.SingleReview.DateStart()}</span>
                            <div class="flex gap-x-2 items-center pl-2 w-full">
                                <svelte:component this={CalendarDaysIcon} />
                                <input
                                    bind:value={review.startDate} 
                                    class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400"
                                    disabled
                                    id="reviewStartDate"
                                />
                            </div>
                        </label>
                    {/if}
                    {#if review.endDate}
                        <label class="flex flex-col w-full">
                            <span class="font-medium text-xs">{$LL.SingleReview.DateEnd()}</span>
                            <div class="flex gap-x-2 items-center pl-2 w-full">
                                <svelte:component this={CalendarDaysIcon} />
                                <input
                                    bind:value={review.endDate}
                                    class="border flex flex-grow px-2 py-1 rounded text-sm lg:text-base border-gray-300 text-gray-400"
                                    disabled
                                    id="reviewEndDate"
                                />
                            </div>
                        </label>
                    {/if}
                </div>
            </div>
        </div>

        <!-- EVALUATIONS OF REVIEW -->
        <div class="flex flex-col gap-y-2">
            <div class="border-b flex border-gray-300">
                {#each review.evaluationsAvailable as evaluation}
                    <button on:click={() => handleEvalChange(evaluation)} class="font-medium p-2 {evaluationActive === evaluation ? 'border-b-2 border-blue-500 text-gray-800' : 'text-gray-400'}">{evaluation}</button>
                {/each}
            </div>

            <div class="flex flex-col gap-y-4 mx-5 my-2">
                {#if loadingEval}
                    <p>{$LL.SingleReview.Loading()}</p>
                {:else}
                    {#if review.evaluations.length > 0 && review.evaluations.find(temp => temp.type === evaluationActive)}
                        {#each review.evaluations as evaluation}
                            {#if evaluation.type === evaluationActive}
                                {#if evaluation.availableInLanguages.length > 1}
                                    <div class="flex gap-x-2 items-center">
                                        <p class="font-semibold text-base text-black">{$LL.SingleReview.ShowInLanguage()}</p>
                                        <select bind:value={languageSelected} class="border p-1 rounded text-xs bg-gray-100 border-gray-300">
                                            {#each evaluation.availableInLanguages as lang}
                                                <option value={lang}>{getFullLanguageText(lang)}</option>
                                            {/each}
                                        </select>
                                    </div>
                                {/if}
                                {#each evaluation.template as category}
                                    <div class="flex flex-col gap-y-2">
                                        <div class="flex flex-col">
                                            <span class="font-medium text-gray-800">{category.position}. {getTranslation(category.translations, languageSelected)?.title} ({category.value}%)</span>
                                            <span class="font-normal text-xs text-gray-400">{getTranslation(category.translations, languageSelected)?.description}</span>
                                        </div>
                                        <div class="flex flex-col gap-y-2 mx-5">
                                            {#each category.questions as question}
                                                <div class="flex flex-col">
                                                    <span class="font-normal text-sm text-gray-800">{question.position}. {getTranslation(question.translations, languageSelected)?.title}{question.isRequired ? '*': ''} ({question.value}%)</span>
                                                    <span class="font-normal text-xs text-gray-400">{getTranslation(question.translations, languageSelected)?.description ? getTranslation(question.translations, languageSelected)?.description : $LL.SingleReview.NoDescription()}</span>
                                                    <div class="flex flex-col md:flex-row md:flex-wrap gap-x-2 gap-y-1 m-1">
                                                        {#if question.type === "Rating"}
                                                            {#each evaluation.ratingOptions as ratingOption}
                                                                <label class="flex gap-x-1 items-center">
                                                                    <input class="w-3 h-3" disabled type="radio" />
                                                                    <span class="text-xs text-gray-800">{getTranslation(ratingOption.translations, languageSelected)?.title}</span>
                                                                </label>
                                                            {/each}
                                                        {:else if question.type === "Text"}
                                                            <textarea class="border p-1 resize-none rounded text-xs w-full bg-gray-100 border-gray-300" disabled rows={2} />
                                                        {:else}
                                                            <p>{$LL.SingleReview.ErrorQuestionType()}</p>
                                                        {/if}
                                                    </div>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                        {/each}
                    {:else}
                        <p>{$LL.SingleReview.ErrorGetEvaluation()}</p>
                    {/if}
                {/if}
            </div>
        </div>

        <!-- ACTIONS SECTION -->
        <div class="flex flex-col">
            <div class="border-b flex flex-col border-gray-300">
                <span class="font-medium p-2 text-base text-gray-800">{$LL.SingleReview.ActionsLabel()}</span>
            </div>
            <div class="flex flex-col gap-y-4 m-4">
                {#if review.status === "NotStarted" && buttonPatch}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsActivate()}</span>
                            <span class="text-xs text-gray-400">{$LL.SingleReview.ActionsActivateDesc()}</span>
                        </div>
                        <button class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarClockIcon} size={20} />
                            <span>{$LL.SingleReview.ActionsActivateButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status === "Active" && !isReviewUpToDate && buttonPatch}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsExtend()}</span>
                            <span class="text-xs text-gray-400">{$LL.SingleReview.ActionsExtendDesc()}</span>
                        </div>
                        <button class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarPlusIcon} size={20} />
                            <span>{$LL.SingleReview.ActionsExtendButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status === "Active" && buttonPatch}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsCancel()}</span>
                            <span class="text-xs text-gray-400">{$LL.SingleReview.ActionsCancelDesc()}</span>
                        </div>
                        <button on:click={() => changeReviewStatus("Canceled")} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarX2Icon} size={20} />
                            <span>{$LL.SingleReview.ActionsCancelButton()}</span>
                        </button>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsComplete()}</span>
                            <span class="text-xs text-gray-400">{$LL.SingleReview.ActionsCompleteDesc()}</span>
                        </div>
                        <button on:click={() => changeReviewStatus("Completed")} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarCheck2Icon} size={20} />
                            <span>{$LL.SingleReview.ActionsCompleteButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status === "NotStarted" && buttonEdit}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsEdit()}</span>
                            <span class="text-xs text-gray-400">{$LL.SingleReview.ActionsEditDesc()}</span>
                        </div>
                        <button class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={PencilIcon} size={20} />
                            <span>{$LL.SingleReview.ActionsEditButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status !== "Active" && buttonDelete}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsDelete()}</span>
                            <span class="text-xs text-gray-400">{$LL.SingleReview.ActionsDeleteDesc()}</span>
                        </div>
                        <button class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={Trash2Icon} size={20} />
                            <span>{$LL.SingleReview.ActionsDeleteButton()}</span>
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}