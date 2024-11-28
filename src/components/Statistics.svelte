<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { getEvaluationTypeText } from "../helpers/action"
    import { onDestroy, onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    export let lang: string

    let choosedTab: number = 1
    let departments: { departmentId: number, departmentName: string }[] = []
    let departmentsChoosed: { departmentId: number, departmentName: string }
    let departmentsPage: number = 1
    let departmentsSize: number = 10
    let departmentsTable: any
    let departmentsTableLoaded: boolean = false
    let departmentsTotal: number = 0
    let employees: InfoEmployeeData[] = []
    let employeesChoosed: InfoEmployeeData
    let employeesPage: number = 1
    let employeesSize: number = 10
    let employeesTable: any
    let employeesTableLoaded: boolean = false
    let employeesTotal: number = 0
    let error: string = ""
    let firstElement: number = 0
    let lastElement: number = 0
    let loaded: boolean = false
    let page: number = 1
    let reviews: ReviewInfoData[] = []
    let reviewsChoosen: ReviewInfoData|null = null
    let reviewsPage: number = 1
    let reviewsSize: number = 5
    let reviewsTotal: number = 0
    let tableOfAveragesData: any = []
    let timeoutId: any

    // get reviews completed
    async function getCompletedReviews() {
        let response = await requestToApi("GET", `SmartEval/Reviews?page=${reviewsPage}&pageSize=${reviewsSize}&status=Completed`)
        if (response.statusCode === 200) {
            reviews = response.data
            reviewsTotal = response.totalCount
            firstElement = Math.min((reviewsPage - 1) * reviewsSize + 1, reviewsTotal)
            lastElement = Math.min(reviewsPage * reviewsSize, reviewsTotal)
        } else { error = response.error }
        loaded = true
    }

    // get table of average for all employees
    async function getAverageReview() {
        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewsChoosen?.reviewId}/Averages?language=${lang}`)
        if (response.statusCode === 200) { tableOfAveragesData = response.data }
    }

    async function getDepartments() {
        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewsChoosen?.reviewId}/Departments?page=${departmentsPage}&pageSize=${departmentsSize}`)
        if (response.statusCode === 200) {
            departments = response.data
            departmentsTotal = response.totalCount
            departmentsChoosed = departments[0]
            getTableDepartment()
        }

        if (departmentsTotal > departments.length) {
            while (departmentsTotal > departments.length) {
                departmentsPage++
                let response = await requestToApi("GET", `SmartEval/Reviews/${reviewsChoosen?.reviewId}/Departments?page=${departmentsPage}&pageSize=${departmentsSize}`)
                if (response.statusCode === 200) { departments.push(...response.data) }
            }
        }
    }

    async function getEmployees() {
        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewsChoosen?.reviewId}/Employees?page=${employeesPage}&pageSize=${employeesSize}`)
        if (response.statusCode === 200) {
            employees = response.data
            employeesTotal = response.totalCount
            employeesChoosed = employees[0]
            getTableEmployee()
        }

        if (employeesTotal > employees.length) {
            while (employeesTotal > employees.length) {
                employeesPage++
                let response = await requestToApi("GET", `SmartEval/Reviews/${reviewsChoosen?.reviewId}/Employees?page=${employeesPage}&pageSize=${employeesSize}`)
                if (response.statusCode === 200) { employees.push(...response.data) }
            }
        }
    }

    async function getTableDepartment() {
        departmentsTableLoaded = false
        let response = await requestToApi("GET", `SmartEval/Performance/Departments?reviewId=${reviewsChoosen?.reviewId}&departmentId=${departmentsChoosed.departmentId}&language=${lang}`)
        console.log(response)
        if (response.statusCode === 200) { departmentsTable = response.data }
        departmentsTableLoaded = true
    }

    async function getTableEmployee() {
        employeesTableLoaded = false
        let response = await requestToApi("GET", `SmartEval/Performance/Employees?reviewId=${reviewsChoosen?.reviewId}&employeeId=${employeesChoosed.employeeId}&language=${lang}`)
        if (response.statusCode === 200) { employeesTable = response.data }
        employeesTableLoaded = true
    }

    // INITIALIZE SECOND PAGE
    async function nextPage() {
        if (reviewsChoosen == null) { toast.error($LL.Statistics.ToastSelectReviewError()); return }
        
        await getAverageReview()
        if (reviewsChoosen.evaluationsAvailable && reviewsChoosen.evaluationsAvailable.find(e => e == "Interdepartamental")) { await getDepartments() }
        if (reviewsChoosen.evaluationsAvailable && reviewsChoosen.evaluationsAvailable.find(e => e != "Interdepartamental")) { await getEmployees() }
        page++
    }

    // SELECTOR OF REVIEWS
    function changeReviewPage(change: string) {
        if (change === 'increment' && reviewsPage < Math.ceil(reviewsTotal / reviewsSize)) {
            loaded = false, reviews = []
            reviewsPage++
            debounce(getCompletedReviews, 500)
        } else if (change === 'decrement' && reviewsPage > 1) {
            loaded = false, reviews = []
            reviewsPage--
            debounce(getCompletedReviews, 500)
        }
    }

    // DELAY FUNCTION
    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    onMount(async () => { getCompletedReviews() })

    $: console.log(reviews)
</script>

<div class="flex flex-col gap-y-5">
    {#if page == 1}
        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-semibold text-center lg:text-left text-lg text-black">{$LL.Statistics.Title()}</span>
                <span class="hidden md:inline text-sm text-gray-400">{$LL.Statistics.Description()}</span>
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
                        <span class="text-sm">{$LL.Statistics.ShowingItemsLabel({ firstElement, lastElement, total: reviewsTotal })}</span>
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
                <button on:click={nextPage} class="font-semibold mx-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white">{$LL.Statistics.Next()}</button>
            {:else if loaded}
                <span>{$LL.Statistics.NoReviews()}</span>
            {/if}
        </div>
    {:else if page == 2}
        <div class="flex flex-col gap-y-5">
            <span class="font-semibold text-xl text-black">{reviewsChoosen?.title}</span>
            <div class="border-b flex border-gray-300">
                <button on:click={() => { if (choosedTab != 1) choosedTab = 1 }} class="font-medium px-4 py-2 text-sm {choosedTab == 1 ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.Statistics.Average()}</button>
                {#if reviewsChoosen?.evaluationsAvailable && reviewsChoosen?.evaluationsAvailable.find(e => e != "Interdepartamental")}
                    <button on:click={() => { if (choosedTab != 2) choosedTab = 2 }} class="font-medium px-4 py-2 text-sm {choosedTab == 2 ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.Statistics.AverageByEmployee()}</button>
                {/if}
                {#if reviewsChoosen?.evaluationsAvailable && reviewsChoosen?.evaluationsAvailable.find(e => e == "Interdepartamental")}
                    <button on:click={() => { if (choosedTab != 3) choosedTab = 3 }} class="font-medium px-4 py-2 text-sm {choosedTab == 3 ? 'border-b-2 border-blue-500 text-gray-800' : 'hover:bg-gray-100 text-gray-400'}">{$LL.Statistics.Interdepartamental()}</button>
                {/if}
            </div>
            {#if choosedTab == 1}
                <div class="flex flex-col px-4 py-2">
                    <div class="flex font-medium items-center bg-blue-400 text-white">
                        <span class="flex flex-grow"></span>
                        {#each tableOfAveragesData.total as item}
                            <span class="w-20 text-center text-sm">{getEvaluationTypeText(item.type)}</span>
                            <span class="w-10 text-center text-sm">%</span>
                        {/each}
                    </div>
                    {#each tableOfAveragesData.categories as category, index}
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
                                        <span class="flex-shrink-0 text-center text-xs w-10">{item.percentageQuestion != 0 ? `${item.percentageQuestion}%` : `-`}</span>
                                    {/each}
                                </div>
                            {/each}
                        {/if}
                    {/each}
                    <div class="border-b-2 border-t-2 flex items-center py-2 border-blue-400">
                        <span class="flex flex-grow font-medium pl-2 text-lg">{$LL.Statistics.Total()}</span>
                        {#each tableOfAveragesData.total as item}
                            <span class="flex-shrink-0 font-medium text-center text-base w-20"></span>
                            <span class="flex-shrink-0 font-medium text-center text-base w-10">{item.value}</span>
                        {/each}
                    </div>
                    <span class="font-medium mt-4 mb-1 text-sm text-gray-800">{$LL.Statistics.Scale()}</span>
                    <div class="flex flex-col px-4">
                        {#each tableOfAveragesData.ratingGroups as ratingGroup}
                            <div class="flex flex-wrap gap-x-1">
                                <span class="font-medium text-xs text-gray-800">{getEvaluationTypeText(ratingGroup.type)}:</span>
                                {#each ratingGroup.ratingOptions as ratingOption}
                                    <div class="flex">
                                        <span class="font-medium text-xs text-gray-400">{ratingOption.numericValue}</span>
                                        <span class="text-xs text-gray-400">- {ratingOption.title};</span>
                                    </div>
                                {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            {:else if choosedTab == 2}
                <div class="flex flex-col px-4">
                    <span class="font-medium text-base text-gray-800">{$LL.Statistics.ChooseEmployee()}</span>
                    <span class="text-xs text-gray-400">{$LL.Statistics.ChooseEmployeeDesc()}</span>
                    <select bind:value={employeesChoosed} on:change={getTableEmployee} class="border focus:outline-none my-2 p-2 rounded text-sm border-gray-300 bg-gray-100">
                        {#each employees as employee}
                            <option value={employee}>{employee.employeeName}</option>
                        {/each}
                    </select>

                    {#if employeesTableLoaded}
                        <div class="flex flex-col px-4 py-2">
                            <div class="flex font-medium items-center bg-blue-400 text-white">
                                <span class="flex flex-grow"></span>
                                {#each employeesTable.categories[0].averages as item}
                                    <span class="w-20 text-center text-sm">{getEvaluationTypeText(item.type)}</span>
                                    <span class="w-10 text-center text-sm">%</span>
                                {/each}
                            </div>
                            {#each employeesTable.categories as category, index}
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
                                                <span class="flex-shrink-0 text-center text-xs w-10">{item.percentageQuestion != 0 ? `${item.percentageQuestion}%` : `-`}</span>
                                            {/each}
                                        </div>
                                    {/each}
                                {/if}
                            {/each}
                            <div class="border-b-2 border-t-2 flex items-center py-2 border-blue-400">
                                <span class="flex flex-grow font-medium pl-2 text-lg">{$LL.Performance.Total()}</span>
                                {#each employeesTable.total as item}
                                    <span class="flex-shrink-0 font-medium text-center text-base w-20"></span>
                                    <span class="flex-shrink-0 font-medium text-center text-base w-10">{item.value}</span>
                                {/each}
                            </div>
                            <span class="font-medium mt-4 mb-1 text-sm text-gray-800">{$LL.Performance.Scale()}</span>
                            <div class="flex flex-col px-4">
                                {#each employeesTable.ratingGroups as ratingGroup}
                                    <div class="flex flex-wrap gap-x-1">
                                        <span class="font-medium text-xs text-gray-800">{getEvaluationTypeText(ratingGroup.type)}:</span>
                                        {#each ratingGroup.ratingOptions as ratingOption}
                                            <div class="flex">
                                                <span class="font-medium text-xs text-gray-400">{ratingOption.numericValue}</span>
                                                <span class="text-xs text-gray-400">- {ratingOption.title};</span>
                                            </div>
                                        {/each}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {:else if choosedTab == 3}
                <div class="flex flex-col px-4">
                    <span class="font-medium text-base text-gray-800">{$LL.Statistics.ChooseDepartment()}</span>
                    <span class="text-xs text-gray-400">{$LL.Statistics.ChooseDepartmentDesc()}</span>
                    <select bind:value={departmentsChoosed} on:change={getTableDepartment} class="border focus:outline-none my-2 p-2 rounded text-sm border-gray-300 bg-gray-100">
                        {#each departments as department}
                            <option value={department}>{department.departmentName}</option>
                        {/each}
                    </select>

                    {#if departmentsTableLoaded}
                        <div class="flex flex-col px-4 py-2">
                            <div class="flex font-medium items-center bg-blue-400 text-white">
                                <span class="flex flex-grow"></span>
                                {#each departmentsTable.total as item}
                                    <span class="w-[120px] text-center text-sm">{getEvaluationTypeText(item.type)}</span>
                                    <span class="w-10 text-center text-sm">%</span>
                                {/each}
                            </div>
                            {#each departmentsTable.categories as category, index}
                                <button on:click={() => category.isOpen = !category.isOpen} class="flex items-center py-1 bg-blue-100 hover:bg-blue-200">
                                    <span class="flex flex-grow font-medium pl-2 text-base">{index + 1}. {category.title}</span>
                                    {#each category.averagesWithPercentages as item}
                                        <span class="flex-shrink-0 font-medium text-center text-sm w-[120px]">{item.value ?? '-'}</span>
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
                                                <span class="flex-shrink-0 text-center text-xs w-[120px]">{item.value != 0 ? `${item.value}` : '-'}</span>
                                                <span class="flex-shrink-0 text-center text-xs w-10">{item.percentageQuestion != 0 ? `${item.percentageQuestion}%` : `-`}</span>
                                            {/each}
                                        </div>
                                    {/each}
                                {/if}
                            {/each}
                            <div class="border-b-2 border-t-2 flex items-center py-2 border-blue-400">
                                <span class="flex flex-grow font-medium pl-2 text-lg">{$LL.Performance.Total()}</span>
                                {#each departmentsTable.total as item}
                                    <span class="flex-shrink-0 font-medium text-center text-base w-20"></span>
                                    <span class="flex-shrink-0 font-medium text-center text-base w-10">{item.value}</span>
                                {/each}
                            </div>
                            <span class="font-medium mt-4 mb-1 text-sm text-gray-800">{$LL.Performance.Scale()}</span>
                            <div class="flex flex-col px-4">
                                {#each departmentsTable.ratingGroups as ratingGroup}
                                    <div class="flex flex-wrap gap-x-1">
                                        <span class="font-medium text-xs text-gray-800">{getEvaluationTypeText(ratingGroup.type)}:</span>
                                        {#each ratingGroup.ratingOptions as ratingOption}
                                            <div class="flex">
                                                <span class="font-medium text-xs text-gray-400">{ratingOption.numericValue}</span>
                                                <span class="text-xs text-gray-400">- {ratingOption.title};</span>
                                            </div>
                                        {/each}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>