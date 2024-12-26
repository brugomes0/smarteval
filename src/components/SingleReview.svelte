<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import ModalComponent from "./helpers/ModalComponent.svelte"
    import toast from "svelte-french-toast"
    import SubmissionsComponent from "./helpers/SubmissionsComponent.svelte"
    import SveltyPicker from "svelty-picker"
    import { CalendarCheck2Icon, CalendarClockIcon, CalendarDaysIcon, CalendarPlusIcon, CalendarX2Icon, HourglassIcon, PencilIcon, Trash2Icon, UserIcon, XIcon } from "lucide-svelte"
    import { convertLocalToUtcDate, convertUtcToLocalDate, isDateAfter } from "../helpers/date"
    import { getEvaluationTypeText, getFullLanguageText, getFullReviewStatusText } from "../helpers/action"
    import { Link, navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import ProgressBarComponent from "./helpers/ProgressBarComponent.svelte";

    export let lang: string
    export let reviewId: string
    export let user: UserData

    // action buttons to open modal
    let buttonActivateIsOpen: boolean = false
    let buttonExtendIsOpen: boolean = false
    let buttonCancelIsOpen: boolean = false
    let buttonCompleteIsOpen: boolean = false
    let buttonEditIsOpen: boolean = false
    let buttonDeleteIsOpen: boolean = false

    // permissions for submissions
    let allowAddSubmission: boolean = false
    let allowDeleteSubmission: boolean = false
    let allowReadSubmission: boolean = false

    let buttonDelete: boolean = false
    let buttonEdit: boolean = false
    let buttonPatch: boolean = false
    let evalProgressBar: { completedSubmissions: number, totalSubmissions: number } = { completedSubmissions: 0, totalSubmissions: 0 }
    let evaluationActive: string = ""
    let isReviewUpToDate: boolean = false
    let languageSelected: string = ""
    let loading: boolean = true
    let loadingEval: boolean = true
    let reloadProgressBar: boolean = false
    let review: ReviewData = { reviewId: "", title: "", description: "", createByUser: "", createDate: "", startDate: "", endDate: "", status: "", evaluationsAvailable: [], evaluations: [] }
    let reviewPatch: { startDate: string | undefined, endDate: string | undefined, status: string } = { status: "", startDate: undefined, endDate: undefined }
    let reviewStatus: string = ""
    let timeoutId: any

    async function changeReviewStatus(newStatus: string) {
        reviewPatch.status = newStatus
        if (reviewPatch.endDate) reviewPatch.endDate = convertLocalToUtcDate(reviewPatch.endDate)
        let response = await requestToApi("PATCH", `SmartEval/Reviews/${reviewId}/ChangeStatus`, reviewPatch)
        if (response.statusCode == 200) {
            toast.success($LL.SingleReview.ToastChangeStatus())
            navigate("/reviews")
        } else {
            toast.error($LL.SingleReview.ToastChangeStatusError())
        }
    }

    async function deleteReview() {
        let response = await requestToApi("DELETE", `SmartEval/Reviews/${reviewId}`)
        if (response.statusCode === 200) {
            toast.success($LL.Reviews.ToastDelete())
            navigate("/reviews")
        } else {
            toast.error($LL.Reviews.ToastDeleteError())
        }
    }

    async function getEvalProgressBar(id: string) {
        let response = await requestToApi("GET", `SmartEval/Submissions/EvalProgressBar?evaluationId=${id}`)
        if (response.statusCode === 200) { evalProgressBar = response.data }
    }

    async function getEvaluation() {
        if (!Array.isArray(review.evaluations)) review.evaluations = []

        if (review.evaluations.length > 0) {
            const evaluationExist = review.evaluations.find((temp: any) => temp.type === evaluationActive)
            if (evaluationExist) {
                languageSelected = evaluationExist.availableInLanguages[0]
                if (review.status == "Active") await getEvalProgressBar(evaluationExist.evaluationId)
                loadingEval = false
                return
            }
        }

        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewId}/Evaluation?evaluationType=${evaluationActive}`)
        if (response.statusCode === 200) {
            review.evaluations = [...review.evaluations, response.data]
            if (review.status == "Active") await getEvalProgressBar(response.data.evaluationId)
        }

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

    function exitModal(action: string) {
        switch(action) {
            case "Activate":
                buttonActivateIsOpen = false
                reviewPatch.endDate = undefined
                break
            case "Extend":
                buttonExtendIsOpen = false
                reviewPatch.endDate = undefined
                break
            case "Cancel":
                buttonCancelIsOpen = false
                break
            case "Complete":
                buttonCompleteIsOpen = false
                break
            case "Edit":
                buttonEditIsOpen = false
                break
            case "Delete":
                buttonDeleteIsOpen = false
                break
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
        
        const submissionsPermissions = module?.windowPermissions.find(temp => temp.windowType === "Submissions")
        const subPermissionToRead = submissionsPermissions?.permissions.find(temp => temp.permissionType === "Read")
        const subPermissionToAdd = submissionsPermissions?.permissions.find(temp => temp.permissionType === "Create")
        const subPermissionToDelete = submissionsPermissions?.permissions.find(temp => temp.permissionType === "Delete")

        if (subPermissionToRead?.hasPermission) allowReadSubmission = true
        if (subPermissionToAdd?.hasPermission) allowAddSubmission = true
        if (subPermissionToDelete?.hasPermission) allowDeleteSubmission = true 

        await getReview()
        await getEvaluation()
        loading = false
    })

    $: if (reloadProgressBar) {
        const evaluationInUsed = review.evaluations.find(temp => temp.type === evaluationActive)
        if (evaluationInUsed && review.status == "Active") { getEvalProgressBar(evaluationInUsed?.evaluationId) }
        reloadProgressBar = false
    }
</script>

<!-- MODAL FOR ACTIVATE REVIEW -->
{#if buttonActivateIsOpen}
    <ModalComponent on:save={() => changeReviewStatus("Active")}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleReview.ActionsActivate()}</span>
            <button on:click={() => exitModal("Activate")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleReview.ActionsActivateModal()}</span>
            <div class="flex flex-col">
                <span class="font-medium text-xs">{$LL.SingleReview.DateEnd()}</span>
                <div class="flex gap-x-2 items-center">
                    <svelte:component this={CalendarDaysIcon} size={20} />
                    <SveltyPicker bind:value={reviewPatch.endDate} format="yyyy-mm-dd hh:ii" inputClasses="border p-1 rounded bg-gray-100 border-gray-300" />
                </div>
            </div>
        </div>
    </ModalComponent>
{/if}

<!-- MODAL FOR EXTEND REVIEW END DATE -->
{#if buttonExtendIsOpen}
    <ModalComponent on:save={() => changeReviewStatus("Active")}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleReview.ActionsExtend()}</span>
            <button on:click={() => exitModal("Extend")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleReview.ActionsExtendModal()}</span>
            <div class="flex flex-col">
                <span class="font-medium text-xs">{$LL.SingleReview.DateEnd()}</span>
                <div class="flex gap-x-2 items-center">
                    <svelte:component this={CalendarDaysIcon} size={20} />
                    <SveltyPicker bind:value={reviewPatch.endDate} format="yyyy-mm-dd hh:ii" inputClasses="border p-1 rounded bg-gray-100 border-gray-300" />
                </div>
            </div>
        </div>
    </ModalComponent>
{/if}

<!-- MODAL FOR CANCEL REVIEW -->
{#if buttonCancelIsOpen}
    <ModalComponent on:save={() => changeReviewStatus("Canceled")}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleReview.ActionsCancel()}</span>
            <button on:click={() => exitModal("Cancel")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleReview.ActionsCancelModal()}</span>
        </div>
    </ModalComponent>
{/if}

<!-- MODAL FOR COMPLETE REVIEW -->
{#if buttonCompleteIsOpen}
    <ModalComponent on:save={() => changeReviewStatus("Completed")}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleReview.ActionsComplete()}</span>
            <button on:click={() => exitModal("Complete")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleReview.ActionsCompleteModal()}</span>
        </div>
    </ModalComponent>
{/if}

<!-- MODAL TO EDIT REVIEW -->
{#if buttonEditIsOpen}
    <ModalComponent on:save={() => navigate(`/reviews/${reviewId}/edit`)}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleReview.ActionsEdit()}</span>
            <button on:click={() => exitModal("Edit")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleReview.ActionsEditModal()}</span>
        </div>
    </ModalComponent>
{/if}

<!-- MODAL TO DELETE REVIEW -->
{#if buttonDeleteIsOpen}
    <ModalComponent on:save={() => deleteReview()}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleReview.ActionsDelete()}</span>
            <button on:click={() => exitModal("Delete")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleReview.ActionsDeleteModal()}</span>
        </div>
    </ModalComponent>
{/if}

<!-- PAGE ELEMENTS -->
{#if !loading}
    <div class="flex flex-col gap-y-2">
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
            <div class="border-b flex overflow-x-auto whitespace-nowrap border-gray-300">
                {#each review.evaluationsAvailable as evaluation}
                    <button on:click={() => handleEvalChange(evaluation)} class="font-medium p-2 {evaluationActive === evaluation ? 'border-b-2 border-blue-500 text-gray-800' : 'text-gray-400'}">{getEvaluationTypeText(evaluation)}</button>
                {/each}
            </div>

            <div class="flex flex-col gap-y-4 p-2">
                {#if loadingEval}
                    <p>{$LL.SingleReview.Loading()}</p>
                {:else}
                    {#if review.evaluations.length > 0 && review.evaluations.find(temp => temp.type === evaluationActive)}
                        {#each review.evaluations as evaluation}
                            {#if evaluation.type === evaluationActive}
                                {#if review.status === "Active"}
                                    <div class="flex flex-col gap-y-1">
                                        <li class="font-medium text-base">{$LL.SingleReview.Progress()}</li>
                                        <ProgressBarComponent bind:actual={evalProgressBar.completedSubmissions} bind:total={evalProgressBar.totalSubmissions} />
                                    </div>
                                {/if}
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
                                <div class="flex flex-col gap-y-1">
                                    <li class="font-medium text-base">{$LL.SingleReview.FormEvaluation()}</li>
                                    {#each evaluation.template as category}
                                        <div class="flex flex-col gap-y-2 mx-5">
                                            <div class="flex flex-col">
                                                <span class="font-medium text-sm text-gray-800">{category.position}. {getTranslation(category.translations, languageSelected)?.title} ({category.value}%)</span>
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
                                                                        <span class="text-xs text-gray-800">{getTranslation(ratingOption.translations, lang)?.title}</span>
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
                                </div>
                                {#if allowReadSubmission && review.status !== "NotStarted"}
                                    <div class="flex flex-col gap-y-1">
                                        <li class="font-medium text-base">{$LL.SingleReview.Submissions()}</li>
                                        <SubmissionsComponent bind:reviewStatus={review.status} bind:evaluationId={evaluation.evaluationId} bind:evaluationType={evaluation.type} bind:lang bind:reloadProgressBar bind:allowAddSubmission bind:allowDeleteSubmission />
                                    </div>
                                {/if}
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
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.SingleReview.ActionsActivateDesc()}</span>
                        </div>
                        <button on:click={() => buttonActivateIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarClockIcon} size={20} />
                            <span>{$LL.SingleReview.ActionsActivateButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status === "Active" && !isReviewUpToDate && buttonPatch}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsExtend()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.SingleReview.ActionsExtendDesc()}</span>
                        </div>
                        <button on:click={() => buttonExtendIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarPlusIcon} size={20} />
                            <span>{$LL.SingleReview.ActionsExtendButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status === "Active" && buttonPatch}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsCancel()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.SingleReview.ActionsCancelDesc()}</span>
                        </div>
                        <button on:click={() => buttonCancelIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarX2Icon} size={20} />
                            <span>{$LL.SingleReview.ActionsCancelButton()}</span>
                        </button>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsComplete()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.SingleReview.ActionsCompleteDesc()}</span>
                        </div>
                        <button on:click={() => buttonCompleteIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={CalendarCheck2Icon} size={20} />
                            <span>{$LL.SingleReview.ActionsCompleteButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status === "NotStarted" && buttonEdit}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsEdit()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.SingleReview.ActionsEditDesc()}</span>
                        </div>
                        <button on:click={() => buttonEditIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={PencilIcon} size={20} />
                            <span>{$LL.SingleReview.ActionsEditButton()}</span>
                        </button>
                    </div>
                {/if}
                {#if review.status !== "Active" && buttonDelete}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.SingleReview.ActionsDelete()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.SingleReview.ActionsDeleteDesc()}</span>
                        </div>
                        <button on:click={() => buttonDeleteIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={Trash2Icon} size={20} />
                            <span>{$LL.SingleReview.ActionsDeleteButton()}</span>
                        </button>
                    </div>
                {/if}

                {#if !(review.status === "NotStarted" && buttonPatch) && !(review.status === "Active" && !isReviewUpToDate && buttonPatch) &&
                    !(review.status === "Active" && buttonPatch) && !(review.status === "NotStarted" && buttonEdit) && !(review.status !== "Active" && buttonDelete)
                }
                    <div class="flex text-gray-800">
                        <span class="text-sm">{$LL.SingleReview.NoActionsAvailable()}</span>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}