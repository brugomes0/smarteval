<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { getEvaluationTypeText } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
    import toast from "svelte-french-toast"

    export let lang: string

    let employees: InfoEmployeeData[]
    let employeesChoosen: InfoEmployeeData
    let error: string = ""
    let firstElement: number = 0
    let lastElement: number = 0
    let loaded: boolean = false
    let page: number = 1
    let reviews: ReviewInfoData[] = []
    let reviewsChoosen: ReviewInfoData
    let reviewsPage: number = 1
    let reviewsSize: number = 10
    let reviewsTotal: number = 0
    let selectTab: number = 1
    let submissionsOfEvaluations: any = []
    let tableData: any = []
    let timeoutId: any

    async function getReviews() {
        let response = await requestToApi("GET", `SmartEval/Reviews/MadeAboutEmployeesOfSuperior?page=${reviewsPage}&pageSize=${reviewsSize}`)
        if (response.statusCode === 200) {
            reviews = response.data
            reviewsTotal = response.totalCount
            reviewsTotal = response.totalCount
            firstElement = Math.min((reviewsPage - 1) * reviewsSize + 1, reviewsTotal)
            lastElement = Math.min(reviewsPage * reviewsSize, reviewsTotal)
        } else { error = response.error }
        loaded = true
    }

    async function getEmployeesOfSuperiorInReview() {
        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewsChoosen.reviewId}/EmployeesOfSuperior`)
        if (response.statusCode === 200) { 
            employees = response.data
            employeesChoosen = employees[0]
        }
    }

    async function getSubmissionsFromReview() {
        let response = await requestToApi("GET", `SmartEval/Submissions/MadeAboutEmployee?reviewId=${reviewsChoosen.reviewId}&employeeId=${employeesChoosen.employeeId}`)
        if (response.statusCode === 200) { submissionsOfEvaluations = response.data.evaluations }
    }

    async function getTablePerformanceEmployee() {
        let response = await requestToApi("GET", `SmartEval/Performance/Employees?reviewId=${reviewsChoosen.reviewId}&employeeId=${employeesChoosen.employeeId}&language=${lang}`)
        if (response.statusCode === 200) {
            tableData = response.data
            tableData.categories = tableData.categories.map((cat: any) => { cat.isOpen = false; return cat })
        }
        loaded = true
    }

    async function nextPage() {
        if (reviewsChoosen == null) { toast.error($LL.TeamPerformance.ToastSelectReviewError()); return }
        loaded = false
        await getEmployeesOfSuperiorInReview()
        await getTablePerformanceEmployee()
        await getSubmissionsFromReview()
        page++
    }

    function changeReviewPage(change: string) {
        if (change == 'increment' && reviewsPage < Math.ceil(reviewsTotal / reviewsSize)) {
            loaded = false, reviews = []
            reviewsPage++
            debounce(getReviews, 500)
        } else if (change == 'decrement' && reviewsPage > 1) {
            loaded = false, reviews = []
            reviewsPage--
            debounce(getReviews, 500)
        }
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    onMount(async () => { getReviews() })
</script>

<div class="flex flex-col gap-y-5">
    {#if page == 1}
        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-semibold text-center lg:text-left text-xl text-black">{$LL.TeamPerformance.Title()}</span>
                <span class="hidden md:inline text-sm text-gray-400">{$LL.TeamPerformance.Description()}</span>
            </div>
            {#if loaded && reviews.length > 0}
                <div class="flex flex-col">
                    {#each reviews as review, index}
                        <label class="border-b cursor-pointer flex items-start justify-between px-4 py-2 border-gray-300 hover:bg-gray-100 {index == 0 ? 'rounded-t' : ''}">
                            <div class="flex gap-x-4 items-center">
                                <input bind:group={reviewsChoosen} class="cursor-pointer h-4 w-4" type="radio" value={review} />
                                <div class="flex flex-col text-left">
                                    <span>{review.title}</span>
                                    <span class="text-xs text-gray-400">{review.description}</span>
                                </div>
                            </div>
                            <span class="hidden md:inline text-xs">{convertUtcToLocalDateShort(review.endDate, lang)}</span>
                        </label>
                    {/each}
                    <div class="flex items-center justify-between px-5 py-2">
                        <span class="text-sm">{$LL.TeamPerformance.ShowingItemsLabel({ firstElement, pageSize: lastElement, total: reviewsTotal })}</span>
                        {#if reviewsTotal > reviewsSize}
                            <div class="flex gap-x-2">
                                <button on:click={() => changeReviewPage('decrement')} class="border mx-auto rounded shadow border-gray-300 hover:bg-gray-100">
                                    <svelte:component this={ChevronLeftIcon} />
                                </button>
                                <button on:click={() => changeReviewPage('increment')} class="border mx-auto rounded shadow border-gray-300 hover:bg-gray-100">
                                    <svelte:component this={ChevronRightIcon} />
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
                <button on:click={nextPage} class="font-semibold mx-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white">{$LL.TeamPerformance.Next()}</button>
            {:else if loaded}
                <span>{$LL.TeamPerformance.NoReviews()}</span>
            {:else}
                <span>{$LL.App.Loading()}...</span>
            {/if}
        </div>
    {:else if page == 2}
        {#if loaded}
            <span class="font-semibold text-xl text-black">{reviewsChoosen.title}</span>
            <div class="flex flex-col gap-y-1">
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.TeamPerformance.ChooseEmployeeTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.TeamPerformance.ChooseEmployeeDesc()}</p>
                </div>
                <select bind:value={employeesChoosen} on:change={() => { getTablePerformanceEmployee(); getSubmissionsFromReview(); }} class="border focus:outline-none my-2 p-2 rounded text-sm border-gray-300 bg-gray-100">
                    {#each employees as employee}
                        <option value={employee}>{employee.employeeName}</option>
                    {/each}
                </select>
            </div>
            <div class="border-b flex border-gray-300">
                <button on:click={() => selectTab = 1} class="font-medium px-4 py-2 text-sm {selectTab == 1 ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.TeamPerformance.EmployeePerformance()}</button>
                <button on:click={() => selectTab = 2} class="font-medium px-4 py-2 text-sm {selectTab == 2 ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.TeamPerformance.SubmissionDetails()}</button>
            </div>
            {#if selectTab == 1}
                <div class="flex flex-col px-4 py-2">
                    <div class="flex font-medium h-10 items-center bg-blue-400 text-white">
                        <span class="flex flex-grow"></span>
                        {#each tableData.total as item}
                            <span class="w-20 text-center text-sm">{getEvaluationTypeText(item.type)}</span>
                            <span class="w-10 text-center text-sm">%</span>
                        {/each}
                    </div>
                    {#each tableData.categories as category, index}
                        <button on:click={() => category.isOpen = !category.isOpen} class="flex items-center py-1 bg-blue-100 hover:bg-blue-200">
                            <span class="flex flex-grow font-medium pl-2 text-base">{index + 1}. {category.title}</span>
                            {#each category.averagesWithPercentages as item}
                                <span class="flex-shrink-0 font-medium text-center text-sm w-20">{item.value ?? '-'}</span>
                                <span class="flex-shrink-0 font-medium text-center text-sm w-10">{item.percentageCategory}%</span>
                            {/each}
                        </button>
                        {#if category.isOpen}
                            {#each category.questions as question}
                                <div class="flex items-center">
                                    <div class="flex flex-col flex-grow pl-5 py-1">
                                        <span class="text-base text-black">{question.title}</span>
                                        <span class="hidden lg:inline text-xs text-gray-400">{question.description}</span>
                                    </div>
                                    {#each question.answers as item}
                                        <span class="flex-shrink-0 text-center text-xs w-20">{item.value != 0 ? `${item.value}` : '-'}</span>
                                        <span class="flex-shrink-0 text-center text-xs w-10">{item.percentageQuestion != 0 ? `${item.percentageQuestion}%` : '-'}</span>
                                    {/each}
                                </div>
                            {/each}
                        {/if}
                    {/each}
                    <div class="border-b-2 border-t-2 flex items-center py-2 border-blue-400">
                        <span class="flex flex-grow font-medium pl-2 text-lg">{$LL.TeamPerformance.Total()}</span>
                        {#each tableData.total as item}
                            <span class="flex-shrink-0 font-medium text-center text-base w-20"></span>
                            <span class="flex-shrink-0 font-medium text-center text-base w-10">{item.value}</span>
                        {/each}
                    </div>
                </div>
            {:else if selectTab == 2}
                <div class="flex flex-col gap-y-2 px-4">
                    {#each submissionsOfEvaluations as evaluation}
                        <div class="flex flex-col">
                            <span class="flex font-medium text-sm text-gray-800">{getEvaluationTypeText(evaluation.type)}</span>
                            <div class="flex flex-col mx-5 my-1">
                                {#each evaluation.submissions as submission}
                                    <button on:click={() => navigate(`/submissions/${submission.submissionId}`)} class="flex items-center justify-between list-dic px-2 py-1 rounded text-sm hover:bg-gray-100">
                                        <li class="overflow-hidden text-ellipsis whitespace-nowrap">{submission.evaluatorEmployee}</li>
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    {/if}
</div>