<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { getEvaluationTypeText } from "../helpers/action"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    export let lang: string

    let error: string = ""
    let firstElement: number = 0
    let lastElement: number = 0
    let loaded: boolean = false
    let page: number = 1
    let reviews: ReviewInfoData[] = []
    let reviewsChoosen: ReviewInfoData|null = null
    let reviewsPage: number = 1
    let reviewsSize: number = 10
    let reviewsTotal: number = 0
    let tableData: any = []
    let timeoutId: any

    async function getReviews() {
        let response = await requestToApi("GET", `SmartEval/Reviews/MadeAboutEmployee?page=${reviewsPage}&pageSize=${reviewsSize}`)
        if (response.statusCode === 200) {
            reviews = response.data
            reviewsTotal = response.totalCount
            firstElement = Math.min((reviewsPage - 1) * reviewsSize + 1, reviewsTotal)
            lastElement = Math.min(reviewsPage * reviewsSize, reviewsTotal)
        } else { error = response.error }
        loaded = true
    }

    async function getSubmissionsOfEmployee() {
        let response = await requestToApi("GET", `SmartEval/Performance?reviewId=${reviewsChoosen?.reviewId}`)
        console.log(response)
        if (response.statusCode === 200) {
            tableData = response.data
            tableData.categories = tableData.categories.map((cat: any) => { cat.isOpen = false; return cat })
        }
        loaded = true
    }

    function changeReviewPage(change: string) {
        if (change == 'increment' && reviewsPage < Math.ceil(reviewsTotal / reviewsSize)) {
            loaded = false, reviews = []
            reviewsPage++
            debounce(getReviews, 500)
        } else if (change === 'decrement' && reviewsPage > 1) {
            loaded = false, reviews = []
            reviewsPage--
            debounce(getReviews, 500)
        }
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function nextPage() {
        if (reviewsChoosen == null) { toast.error($LL.Performance.ToastSelectReviewError()); return }
        loaded = false
        page++
        getSubmissionsOfEmployee()
    }

    onMount(async () => { getReviews() })
</script>

<div class="flex flex-col gap-y-5">
    {#if page == 1}
        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-semibold text-center lg:text-left text-xl text-black">{$LL.Performance.Title()}</span>
                <span class="hidden md:inline text-sm text-gray-400">{$LL.Performance.Description()}</span>
            </div>
            {#if loaded && reviews.length > 0}
                <div class="flex flex-col gap-y-1">
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
                <button on:click={nextPage} class="font-semibold mx-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white">{$LL.Performance.Next()}</button>
            {:else if loaded}
                <span>{$LL.Performance.NoReviews()}</span>
            {/if}
        </div>
    {:else if page == 2}
        {#if loaded}
            <span class="font-semibold text-xl text-black">{reviewsChoosen?.title}</span>
            <div class="flex flex-col gap-y-2">
                <li class="font-semibold text-lg text-black">{$LL.Performance.MyPerformance()}</li>
                <span>tabela da avaliação</span>
                <div class="flex flex-col px-4 py-2">
                    <div class="flex font-medium items-center bg-blue-400 text-white">
                        <span class="flex flex-grow"></span>
                        {#each tableData.categories[0].averages as item}
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
                                        <span class="flex-shrink-0 text-center text-xs w-20">{item.value ?? '-'}</span>
                                        <span class="flex-shrink-0 text-center text-xs w-10">{item.percentageQuestion}%</span>
                                    {/each}
                                </div>
                            {/each}
                        {/if}
                    {/each}
                    <div class="border-b-2 border-t-2 flex items-center py-2 border-blue-400">
                        <span class="flex flex-grow font-medium pl-2 text-lg">{$LL.Performance.Total()}</span>
                        {#each tableData.total as item}
                            <span class="flex-shrink-0 font-medium text-center text-base w-20"></span>
                            <span class="flex-shrink-0 font-medium text-center text-base w-10">{item.value}</span>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-y-2">
                <li class="font-semibold text-lg text-black">Detalhes Por Submissão</li>
                <span>ver cada submissão feita para ele</span>
            </div>
            <div class="flex flex-col gap-y-2">
                <li class="font-semibold text-lg text-black">{$LL.Performance.CompareOtherReview()}</li>
                <span>Comparar sub-avaliação atual com sub-avaliação do mesmo tipo de uma avaliação anterior</span>
            </div>
        {/if}
    {/if}
</div>