<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import ModalComponent from "./helpers/ModalComponent.svelte"
    import { CalendarIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, UserIcon, XIcon } from "lucide-svelte"
    import { Link, navigate } from "svelte-routing"
    import { convertUtcToLocalDate } from "../helpers/date"
    import { getEvaluationTypeText, getFullReviewStatusText } from "../helpers/action"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"

    export let lang: string

    let loading: boolean = true
    let page: number = 1
    let pageSize: number = 5
    let openModal: boolean = false
    let openModalForId: string = ""
    let reviews: SubmissionsReviewData[] = []
    let timeoutId: any
    let status: string = "Active"

    async function getSubmissions() {
        let response = await requestToApi("GET", `SmartEval/Submissions/MadeByEmployee?page=${page}&pageSize=${pageSize}&status=${status}`)
        if (response.statusCode === 200) { reviews = response.data }
        loading = false
    }

    function changeTab(tab: string) {
        if (status != tab) {
            loading = true
            status = tab
            debounce(getSubmissions, 500)
        }
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function goToSubmission(submission: SubmissionData, review: SubmissionsReviewData) {
        if (submission.isAnswered && review.status == "Active") {
            openModal = true
            openModalForId = submission.submissionId
        } else { navigate(`/submissions/${submission.submissionId}`) }
    }

    onMount(async () => { getSubmissions() })
</script>

{#if openModal}
    <ModalComponent on:save={() => navigate(`/submissions/${openModalForId}`)}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.Submissions.AlterSubmissionTitle()}</span>
            <button on:click={() => { openModal = false; openModalForId = "" }} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.Submissions.AlterSubmissionDesc()}</span>
        </div>
    </ModalComponent>
{/if}

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-xl text-black">{$LL.Submissions.Title()}</span>
        <span class="text-sm text-gray-400">{$LL.Submissions.Description()}</span>
    </div>
    <div class="border-b flex border-gray-300">
        <button on:click={() => changeTab("Active")} class="font-medium px-4 py-2 text-sm {status == 'Active' ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.Submissions.TabActive()}</button>
        <button on:click={() => changeTab("Done")} class="font-medium px-4 py-2 text-sm {status == 'Done' ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.Submissions.TabHistory()}</button>
    </div>
    <div class="flex flex-col gap-y-2 px-4">
        {#if loading}
            <span>{$LL.Submissions.Loading()}</span>
        {:else}
            {#if reviews.length === 0}
                <span>{$LL.Submissions.NoReviews()}</span>
            {/if}
            {#each reviews as review}
                <div class="border flex flex-col gap-y-2 px-5 py-2 rounded border-gray-300">
                    <div class="flex items-start">
                        <div class="flex flex-col flex-grow">
                            <span class="flex font-semibold gap-x-2 items-center text-lg">
                                {review.title}
                                <div class="border font-medium px-1 rounded text-xs bg-blue-100 border-blue-300 text-gray-600">{getFullReviewStatusText(review.status, "singular")}</div>
                            </span>
                            <span class="font-medium text-sm text-gray-400">{review.description}</span> 
                        </div>
                        <div class="flex">
                            <button on:click={() => review.isOpen = !review.isOpen} class="p-1 rounded hover:bg-gray-100">
                                <svelte:component this={review.isOpen ? ChevronDownIcon : ChevronUpIcon} />
                            </button>
                        </div>
                    </div>
                    <div class="flex gap-x-4 items-center">
                        <span class="flex font-medium gap-x-2 items-center text-sm text-gray-400">
                            <svelte:component this={CalendarIcon} size={16} />
                            {convertUtcToLocalDate(review.endDate, lang)}
                        </span>
                        <span class="flex font-medium gap-x-2 items-center text-sm text-gray-400">
                            <svelte:component this={UserIcon} size={16} />
                            {review.username}
                        </span>
                    </div>
                    {#if review.isOpen}
                        <hr>
                        <div class="flex flex-col gap-y-2">
                            {#each review.evaluations as evaluation}
                                <div class="flex flex-col">
                                    <span class="flex font-medium text-sm text-gray-800">{getEvaluationTypeText(evaluation.type)}</span>
                                    <div class="flex flex-col mx-5 my-1">
                                        {#each evaluation.submissions as submission}
                                            <button on:click={() => goToSubmission(submission, review)} class="flex items-center justify-between list-disc px-2 py-1 rounded text-sm hover:bg-gray-100">
                                                <li class="overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {evaluation.type != "Interdepartamental" ? submission.evaluatedEmployee : submission.evaluatedDepartment}
                                                </li>
                                                {#if submission.isAnswered && status == "Active"}<svelte:component class="text-green-500" this={CheckIcon} size={16} />{/if}
                                            </button>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each} 
        {/if}
    </div>
</div>