<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
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
    let submissions: SubmissionsReviewData
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
        let response = await requestToApi("GET", `SmartEval/Submissions/MadeAboutEmployee?reviewId=${reviewsChoosen!.reviewId}`)
        if (response.statusCode === 200) {
            submissions = response.data
            console.log(submissions)
        }
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
        <span>Page: {page}</span>
    {/if}
</div>