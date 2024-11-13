<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { ChevronLeftIcon, ChevronRightIcon, ClipboardCheckIcon, ClipboardIcon, LayoutListIcon, ListIcon, PlusIcon, UserCircleIcon } from "lucide-svelte"
    import { convertUtcToLocalDateShort, isDateAfter } from "../helpers/date"
    import { getEvaluationTypeText } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import ChartComponent from "./helpers/ChartComponent.svelte";

    export let lang: string
    export let user: UserData

    let actionsError: boolean = false
    let actionsList: { actionId: string, userName: string, date: string, actionName: string, item: string }[] = []
    let actionsLoading: boolean = true
    let activeReviewsError: boolean = false
    let activeReviewsList: { reviewId: string, title: string, description: string, endDate: string, evaluationsAvailable: string[] }[] = []
    let activeReviewsLoading: boolean = true
    let countReviewsEachStatus: { activeReviews: 0, notStartedReviews: 0, canceledReviews: 0, completedReviews: 0 }
    let countReviewsEachStatusError: boolean = false
    let countReviewsEachStatusLoading: boolean = true
    let nCategories: number|undefined = undefined
    let nCompletedReviews: number|undefined = undefined
    let nRatingGroups: number|undefined = undefined
    let nReviews: number|undefined = undefined
    let permissionToCreateCategory: boolean = false
    let permissionToCreateRatingGroup: boolean = false
    let permissionToCreateReview: boolean = false
    let permissionToReadCategory: boolean = false
    let permissionToReadRatingGroup: boolean = false

    async function getCountItems() {
        let response = await requestToApi("GET", `SmartEval/HomePage/CountItems`)
        if (response.statusCode === 200) {
            nCategories = response.data.nCategories
            nCompletedReviews = response.data.nCompletedReviews
            nRatingGroups = response.data.nRatingGroups
            nReviews = response.data.nReviews
        }
    }

    async function getCountReviewsEachStatus() {
        let response = await requestToApi("GET", `SmartEval/HomePage/CountReviewsEachStatus`)
        if (response.statusCode === 200) { 
            countReviewsEachStatus = response.data
        } else { countReviewsEachStatusError = true }
        countReviewsEachStatusLoading = false
    }

    async function getLastTenActions() {
        let response = await requestToApi("GET", `SmartEval/HomePage/Actions?page=1&pageSize=10`)
        if (response.statusCode === 200) {
            actionsList = response.data
        } else { actionsError = true }
        actionsLoading = false
    }

    async function getListActiveReviews() {
        let response = await requestToApi("GET", `SmartEval/HomePage/ListActiveReviews`)
        if (response.statusCode === 200) { 
            activeReviewsList = response.data
        } else { activeReviewsError = true }
        activeReviewsLoading = false
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")

        permissionToCreateReview = module?.windowPermissions.find(temp => temp.windowType === "Reviews")?.permissions.find(temp => temp.permissionType === "Create")?.hasPermission ?? false
        permissionToCreateCategory = module?.windowPermissions.find(temp => temp.windowType === "Categories")?.permissions.find(temp => temp.permissionType === "Create")?.hasPermission ?? false
        permissionToCreateRatingGroup =  module?.windowPermissions.find(temp => temp.windowType === "RatingGroups")?.permissions.find(temp => temp.permissionType === "Create")?.hasPermission ?? false
        permissionToReadCategory = module?.windowPermissions.find(temp => temp.windowType === "Categories")?.permissions.find(temp => temp.permissionType === "Read")?.hasPermission ?? false
        permissionToReadRatingGroup = module?.windowPermissions.find(temp => temp.windowType === "RatingGroups")?.permissions.find(temp => temp.permissionType === "Read")?.hasPermission ?? false

        getCountItems()
        getCountReviewsEachStatus()
        getLastTenActions()
        getListActiveReviews()
    })
</script>

<div class="flex flex-col gap-[10px] md:gap-[25px] xl:gap-[50px]">
    <div class="w-full box-border grid grid-cols-1 xl:grid-cols-2 gap-[10px] md:gap-[25px] xl:gap-[50px]">
        <div class="w-full box-border grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-[25px] xl:gap-[50px]">
            <div id="numbers" style="--backgroundColor: #F1C40F; --textColor: black">
                <p class="absolute left-[20px] top-[10px] font-semibold text-lg">{nReviews != undefined ? nReviews : '-'}</p>
                <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.Reviews()}</p>
                <svelte:component class="absolute right-[20px] top-[10px]" this={ClipboardIcon} />
            </div>
            <div id="numbers" style="--backgroundColor: #EA4ABC; --textColor: black">
                <p class="absolute left-[20px] top-[10px] font-semibold text-lg">{nCompletedReviews != undefined ? nCompletedReviews : '-'}</p>
                <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.CompletedReviews()}</p>
                <svelte:component class="absolute right-[20px] top-[10px]" this={ClipboardCheckIcon} />
            </div>
        </div>
        <div class="w-full box-border grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-[25px] xl:gap-[50px]">
            <div id="numbers" style="--backgroundColor: #4ADE80; --textColor: black">
                <p class="absolute left-[20px] top-[10px] font-semibold text-lg">{nCategories != undefined ? nCategories : '-'}</p>
                <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.Categories()}</p>
                <svelte:component class="absolute right-[20px] top-[10px]" this={LayoutListIcon} />
            </div>
            <div id="numbers" style="--backgroundColor: #60A5FA; --textColor: black">
                <p class="absolute left-[20px] top-[10px] font-semibold text-lg">{nRatingGroups != undefined ? nRatingGroups : '-'}</p>
                <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.RatingGroups()}</p>
                <svelte:component class="absolute right-[20px] top-[10px]" this={ListIcon} />
            </div>
        </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-[10px] md:gap-[25px] xl:gap-[50px]">
        <div class="flex flex-col gap-[10px] md:gap-[25px] xl:gap-[50px] lg:w-1/2">
            <!-- ACTIVE REVIEWS -->
            <div class="border flex flex-col gap-y-2 p-4 rounded bg-gray-50 border-gray-300">
                <span class="font-medium text-xl text-gray-800">{$LL.HomeBackoffice.ActiveReviews()}</span>
                <div class="flex flex-col gap-y-1">
                    <div class="border-b flex justify-between border-gray-300">
                        <span class="text-xs text-gray-400">{$LL.HomeBackoffice.Review()}</span>
                        <span class="text-xs text-gray-400">{$LL.HomeBackoffice.EndDate()}</span>
                    </div>
                    {#if activeReviewsLoading}
                        <span>{$LL.HomeBackoffice.Loading()}</span>
                    {:else}
                        {#if activeReviewsError}
                            <span>{$LL.HomeBackoffice.ErrorActiveReviewsList()}</span>
                        {:else}
                            {#if activeReviewsList.length === 0}
                                <span>{$LL.HomeBackoffice.NoActiveReviews()}</span>
                            {/if}
                            {#each activeReviewsList as review}
                                <button on:click={() => navigate(`/reviews/${review.reviewId}`)} class="flex justify-between p-1 rounded hover:bg-gray-100">
                                    <div class="flex flex-col gap-y-2">
                                        <li class="line-clamp-1 px-2 text-ellipsis text-left text-gray-800" title={review.title}>{review.title}</li>
                                        <div class="flex flex-wrap gap-x-1 gap-y-1 items-center">
                                            {#each review.evaluationsAvailable as evaluation}
                                                <span class="border font-light p-1 rounded-full text-xs border-gray-300 text-gray-800">{getEvaluationTypeText(evaluation)}</span>
                                            {/each}
                                        </div>
                                    </div>
                                    <span class="text-sm text-end w-20 text-gray-800">{isDateAfter(review.endDate) ? convertUtcToLocalDateShort(review.endDate, lang) : "Expirou"}</span>
                                </button>
                            {/each}
                        {/if}
                    {/if}
                    {#if activeReviewsList.length > 5}
                        <hr>
                        <div class="flex justify-between mt-2">
                            <button class="border flex items-center pr-2 rounded text-xs border-gray-300 hover:bg-gray-100">
                                <svelte:component this={ChevronLeftIcon} size={20} />
                                {$LL.HomeBackoffice.Back()}
                            </button>
                            <button class="border flex items-center pl-2 rounded text-xs border-gray-300 hover:bg-gray-100">
                                {$LL.HomeBackoffice.Next()}
                                <svelte:component this={ChevronRightIcon} size={20} />
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-[10px] md:gap-[25px] xl:gap-[50px] lg:w-1/2">
            <!-- REVIEWS STATUS CHART -->
            <div class="border flex flex-col gap-y-2 p-4 rounded bg-gray-50 border-gray-300">
                {#if countReviewsEachStatusLoading}
                    <span>{$LL.HomeBackoffice.Loading()}</span>
                {:else}
                    {#if countReviewsEachStatusError}
                        <span>{$LL.HomeBackoffice.ErrorCountReviewsEachStatus()}</span>
                    {:else}
                        <ChartComponent
                            data={{ 
                                labels: [$LL.ReviewStatus.Active(), $LL.ReviewStatus.NotStarted(), $LL.ReviewStatus.Canceled(), $LL.ReviewStatus.Completed()], 
                                datasets: [{
                                    label: $LL.ReviewStatus.NumberReviews(),
                                    data: [countReviewsEachStatus.activeReviews, countReviewsEachStatus.notStartedReviews, countReviewsEachStatus.canceledReviews, countReviewsEachStatus.completedReviews]
                                }]
                            }}
                            idCanvas="ReviewStatusChart"
                            innerBarText={{}}
                            options={{
                                scales: {
                                    y: { ticks: { stepSize: 1 }}
                                }
                            }}
                            style=""
                            typeChart="bar"
                        />
                    {/if}
                {/if}
            </div>
            <!-- SHORTCUTS SECTION -->
            <div class="flex flex-col gap-y-1 px-4">
                <span class="font-medium mb-2 text-xl text-gray-800">{$LL.HomeBackoffice.ShortCuts()}</span>
                {#if permissionToCreateReview && permissionToReadCategory && permissionToReadRatingGroup}
                    <div class="flex gap-x-2 ml-5">
                        <span>{$LL.HomeBackoffice.CreateReview()}</span>
                        <div class="border-b border-dashed flex-grow border-gray-300"></div>
                        <button on:click={() => navigate("/reviews/createReview")} class="flex font-medium gap-x-2 items-center px-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={PlusIcon} size={20} />
                            {$LL.HomeBackoffice.Create()}
                        </button>
                    </div>
                {/if}
                {#if permissionToCreateCategory}
                    <div class="flex gap-x-2 ml-5">
                        <span>{$LL.HomeBackoffice.CreateCategory()}</span>
                        <div class="border-b border-dashed flex-grow border-gray-300"></div>
                        <button on:click={() => navigate("/categories/createCategory")} class="flex font-medium gap-x-2 items-center px-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={PlusIcon} size={20} />
                            {$LL.HomeBackoffice.Create()}
                        </button>
                    </div>
                {/if}
                {#if permissionToCreateRatingGroup}
                    <div class="flex gap-x-2 ml-5">
                        <span>{$LL.HomeBackoffice.CreateRatingGroup()}</span>
                        <div class="border-b border-dashed flex-grow border-gray-300"></div>
                        <button on:click={() => navigate("/ratingGroups/createRatingGroup")} class="flex font-medium gap-x-2 items-center px-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={PlusIcon} size={20} />
                            {$LL.HomeBackoffice.Create()}
                        </button>
                    </div>
                {/if}
            </div>
            <!-- <div class="border flex flex-col gap-y-2 p-4 rounded bg-gray-50 border-gray-300">
                <span class="font-medium text-xl text-gray-800">{$LL.HomeBackoffice.LastActions()}</span>
                {#if actionsLoading}
                    <span>{$LL.HomeBackoffice.Loading()}</span>
                {:else}
                    {#if actionsError}
                        <span>{$LL.HomeBackoffice.ErrorActions()}</span>
                    {:else}
                        <div class="flex flex-col gap-y-1">
                            {#if actionsList.length === 0}
                                <span>{$LL.HomeBackoffice.NoActions()}</span>
                            {/if}
                            {#each actionsList as action, index}
                                <div class="flex gap-x-2 items-center px-2">
                                    <svelte:component this={UserCircleIcon} />
                                    <div class="flex flex-col flex-grow">
                                        <span>{action.userName}</span>
                                        <span class="text-xs text-gray-400">{action.actionName} {action.item}</span>
                                    </div>
                                    <div class="text-sm text-end w-20 text-gray-800">{convertUtcToLocalDateShort(action.date, lang)}</div>
                                </div>
                                {#if actionsList.length !== index + 1}<hr>{/if}
                            {/each}
                        </div>
                    {/if}
                {/if}
            </div> -->
        </div>
    </div>
</div>

<style>
    #numbers {
        background-color: var(--backgroundColor);
        border: 1px solid #000;
        border-radius: 10px;
        color: var(--textColor);
        display: inline-block;
        height: 75px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        position: relative;
    }
</style>