<script lang="ts">
    import BarComponent from "./helpers/BarComponent.svelte"
    import LL from "../i18n/i18n-svelte"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { navigate } from "svelte-routing"
    import { DotIcon } from "lucide-svelte"
    import { getEvaluationTypeText } from "../helpers/action";

    export let user: UserData

    let bottomUpRating: {reviewTitle: string, evaluationType: string, rating: number, percentage: number}
    let topDownRating: {reviewTitle: string, evaluationType: string, rating: number, percentage: number}
    let competencies: any = []
    let loading: boolean = true
    let submissions: SubmissionData[] = []
    let totalSubmissions: number = 0

    async function getAverageRatingLastReview() {
        let response = await requestToApi("GET", `SmartEval/HomePage/AverageLastReview`)
        if (response.statusCode === 200) {
            topDownRating = response.data.find((element: any) => element.evaluationType == "TopDown")
            bottomUpRating = response.data.find((element: any) => element.evaluationType == "BottomUp")
        }
    }

    async function getCompetencies() {
        let response = await requestToApi("GET", `SmartEval/HomePage/LastReviewCompetencies`)
        console.log(response)
        if (response.statusCode === 200) { competencies = response.data }
    }

    async function getSubmissionsListToDo() {
        let response = await requestToApi("GET", `SmartEval/HomePage/ListOfSubmissions?onlyTotal=false`)
        if (response.statusCode === 200) {
            submissions = response.data
            totalSubmissions = response.totalCount
        }
    }

    onMount(async () => {
        await getAverageRatingLastReview()
        await getSubmissionsListToDo()
        await getCompetencies()

        loading = false
    })
</script>

<div class="flex flex-col gap-y-10">
    {#if topDownRating || bottomUpRating}
        <div class="flex flex-col md:flex-row gap-x-20 items-center">
            {#if topDownRating}
                <div class="flex flex-col">
                    <div class="flex flex-col font-medium my-3 text-gray-800">
                        <span class="text-base">{$LL.HomeFrontoffice.AvgRatingTopDown()}</span>
                        <span class="text-xs">{topDownRating.reviewTitle}</span>
                    </div>
                    <BarComponent bind:percentage={topDownRating.percentage} />
                    <span class="font-medium text-xl text-gray-800">{topDownRating.rating.toFixed(2)} ({topDownRating.percentage}%)</span>
                </div>
            {/if}
            {#if bottomUpRating}
                <div class="flex flex-col">
                    <div class="flex flex-col font-medium my-3 text-gray-800">
                        <span class="text-base">{$LL.HomeFrontoffice.AvgRatingBottomUp()}</span>
                        <span class="text-xs">{bottomUpRating.reviewTitle}</span>
                    </div>
                    <BarComponent bind:percentage={bottomUpRating.percentage} />
                    <span class="font-medium text-xl text-gray-800">{bottomUpRating.rating.toFixed(2)} ({bottomUpRating.percentage}%)</span>
                </div>
            {/if}
        </div>
    {/if}
    <div class="flex flex-col lg:flex-row gap-x-20 gap-y-10">
        <div class="flex flex-col flex-shrink-0 w-80">
            <div class="border-b flex border-gray-300">
                <span class="border-b-2 font-medium p-2 text-sm border-blue-500 text-gray-800">{$LL.HomeFrontoffice.Dashboard()}</span>
            </div>
            {#if loading}
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <circle cx="4" cy="12" r="3" fill="currentColor">
                            <animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.5s" dur="1.5s" values="3;.2;3"/>
                        </circle>
                        <circle cx="12" cy="12" r="3" fill="currentColor">
                            <animate attributeName="r" begin="svgSpinners3DotsScale0.end-1.2s" dur="1.5s" values="3;.2;3"/>
                        </circle>
                        <circle cx="20" cy="12" r="3" fill="currentColor">
                            <animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.9s" dur="1.5s" values="3;.2;3"/>
                        </circle>
                    </svg>
                </div>
            {:else}
                <span class="font-medium py-3 text-sm text-blue-500">{$LL.HomeFrontoffice.TaskList()} ({totalSubmissions})</span>
                {#if totalSubmissions > 0}
                    <div class="flex flex-col">
                        {#each submissions as submission}
                            <button on:click={() => navigate(`/submissions/${submission.submissionId}`)} class="cursor-pointer flex gap-x-1 px-2 py-1 rounded text-left hover:bg-gray-100">
                                <svelte:component this={DotIcon} strokeWidth={4} />
                                {submission.evaluatedEmployee == null ? submission.evaluatedDepartment : (submission.evaluatedEmployee == user.userName ? $LL.EvaluationTypes.SelfEvaluation() : submission.evaluatedEmployee)}
                            </button>
                        {/each}
                    </div>
                    <button on:click={() => navigate("/submissions")} class="cursor-pointer hover:underline mt-4 ml-auto text-xs text-blue-500">{$LL.HomeFrontoffice.SeeAllSubmissions()}</button>
                {:else}
                    <span class="text-sm">{$LL.HomeFrontoffice.NoSubmissions()}</span>
                {/if}
            {/if}
        </div>
        <div class="flex flex-grow">
            <div class="flex flex-col gap-y-2">
                <span class="font-medium py-2 text-base">{$LL.Competencies.Title()}</span>
                {#if loading}
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <circle cx="4" cy="12" r="3" fill="currentColor">
                                <animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.5s" dur="1.5s" values="3;.2;3"/>
                            </circle>
                            <circle cx="12" cy="12" r="3" fill="currentColor">
                                <animate attributeName="r" begin="svgSpinners3DotsScale0.end-1.2s" dur="1.5s" values="3;.2;3"/>
                            </circle>
                            <circle cx="20" cy="12" r="3" fill="currentColor">
                                <animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.9s" dur="1.5s" values="3;.2;3"/>
                            </circle>
                        </svg>
                    </div>
                {:else}
                    <div class="border flex flex-col gap-y-5 p-[10px] rounded shadow w-[230px] sm:w-[440px] md:w-[650px] lg:w-[440px] xl:w-[650px] 2xl:w-[860px] border-gray-300">
                        {#each competencies as evaluation}
                            <div class="flex flex-col">
                                <span class="text-xs text-blue-500">{getEvaluationTypeText(evaluation.evaluationType)}</span>
                                <div class="flex gap-x-[10px] py-2 overflow-x-scroll">
                                    {#each evaluation.categories as category}
                                        <div class="flex flex-col shrink-0 w-[200px]">
                                            <div class="flex flex-col my-2">
                                                <span class="font-medium line-clamp-1 text-sm" title={category.categoryTitle}>{category.categoryTitle}</span>
                                                <span class="line-clamp-1 text-xs" title={category.reviewTitle}>{category.reviewTitle}</span>
                                            </div>
                                            <BarComponent bind:percentage={category.percentage} />
                                            <span class="font-medium text-xs text-gray-800">{category.average.toFixed(2)}/{category.maxRating.toFixed(2)} ({category.percentage.toFixed(1)}%)</span>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                        <button on:click={() => navigate("/competencies")} class="cursor-pointer hover:underline -mt-[10px] ml-auto text-xs text-blue-500">{$LL.HomeFrontoffice.SeeAllCompetencies()}</button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>