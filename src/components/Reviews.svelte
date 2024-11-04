<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { AlertCircleIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-svelte"
    import { Link } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { getFullReviewStatusText } from "../helpers/action"

    export let user: UserData

    let buttonCreate: boolean = false
    let buttonDelete: boolean = false
    let error: string = ""
    let firstElement: number = 0
    let lastElement: number = 0
    let loading: boolean = true
    let nameInput: string = ""
    let page: number = 1
    let pageSize: number = 5
    let reviews: ReviewInfoData[] = []
    let statusChoosen: string = "Active"
    let statusList: string[] = ["Active", "NotStarted", "Canceled", "Completed"]
    let timeoutId: any
    let total: number = 0

    async function deleteReview(reviewId: string) {
        reviews = [], loading = true
        let response = await requestToApi("DELETE", `SmartEval/Reviews/${reviewId}`)
        if (response.statusCode === 200) {
            toast.success($LL.Reviews.ToastDelete())
        } else { toast.error($LL.Reviews.ToastDeleteError()) }
        page = 1
        debounce(getReviews, 500)
    }

    async function getReviews() {
        let response = await requestToApi("GET", `SmartEval/Reviews?page=${page}&pageSize=${pageSize}&status=${statusChoosen}&name=${nameInput}`)
        if (response.statusCode === 200) {
            reviews = response.data
            total = response.totalCount
        } else { error = response.error }
        loading = false
    }

    function changePage(change: string) {
        reviews = [], loading = true
        if (change === 'increment' && page < Math.ceil(total / pageSize)) {
            page++
        } else if (change === 'decrement' && page > 1) {
            page--
        }
        debounce(getReviews, 500)
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function handleInputChanges() {
        reviews = [], loading = true, total = 0
        debounce(getReviews, 1000)
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === "Reviews")
        const permissionCreate = windowPermission?.permissions.find(temp => temp.permissionType === "Create")
        const permissionDelete = windowPermission?.permissions.find(temp => temp.permissionType === "Delete")

        if (permissionCreate?.hasPermission) buttonCreate = true
        if (permissionDelete?.hasPermission) buttonDelete = true

        getReviews()
    })

    $: {
        firstElement = Math.min((page - 1) * pageSize + 1, total)
        lastElement = Math.min(page * pageSize, total)
    }
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col lg:flex-row gap-x-20 gap-y-5 items-start justify-between">
        <div class="flex flex-col">
            <p class="font-semibold text-center lg:text-left text-lg text-black">{$LL.Reviews.Title()}</p>
            <p class="text-sm text-gray-400">{$LL.Reviews.Description()}</p>
        </div>
        {#if buttonCreate}
            <div class="flex">
                <Link class="flex font-semibold gap-x-[5px] items-center justify-center px-[10px] py-[5px] rounded text-sm w-max bg-blue-500 hover:bg-blue-600 text-white" to="/reviews/createReview">
                    <svelte:component this={PlusIcon} />
                    <span class="text-center">{$LL.Reviews.CreateButton()}</span>
                </Link>
            </div>
        {/if}
    </div>

    <div class="flex relative">
        <input
            bind:value={nameInput}
            on:input={() => { page = 1; handleInputChanges() }}
            class="border pl-12 pr-5 py-3 rounded-lg text-sm w-full border-gray-200 bg-gray-100"
            placeholder={$LL.Reviews.InputText()}
            type="text"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svelte:component this={SearchIcon} />
        </div>
    </div>

    <div class="flex flex-col">
        <div class="border flex flex-col lg:flex-row overflow-hidden rounded border-gray-300">
            {#each statusList as status, i}
                <button class="flex-1 py-[5px] text-sm {status === statusChoosen ? 'font-semibold bg-gray-100' : 'hover:bg-gray-100'} {i !== 0 ? 'lg:border-l border-gray-300': ''}" on:click={() => { if (statusChoosen != status) { statusChoosen = status; handleInputChanges() }}}>
                    {getFullReviewStatusText(status, "plural")}
                </button>
            {/each} 
        </div>
        {#if loading}
            <div class="flex items-center justify-center p-2">
                <p>{$LL.Reviews.Loading()}</p>
            </div>
        {:else}
            {#if error}
                <div class="border-2 font-semibold p-2 rounded text-sm bg-red-600 border-red-800 text-white">
                    <p>{$LL.Reviews.Error()}</p>
                </div>
            {:else}
                <!-- TODO: list of reviews -->
                {#if reviews.length > 0}
                    {#each reviews as review}
                        <div class="flex gap-x-5 items-center justify-between md:h-[80px] p-[10px] border-b border-gray-300">
                            <div class="flex gap-x-4 flex-grow">
                                <div class="flex flex-col gap-x-1 pt-1">
                                    <p class="text-sm md:text-base">{review.title}</p>
                                    <p class="hidden md:flex text-xs text-gray-400 overflow-hidden max-h-8">{review.description}</p>
                                </div>
                            </div>
                            <div class="flex gap-x-2">
                                <Link class="text-xs md:text-sm font-semibold px-2 py-1 rounded-lg cursor-pointer whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white" to="/reviews/{review.reviewId}">{$LL.Reviews.Preview()}</Link>
                                {#if buttonDelete}
                                    <button on:click={() => deleteReview(review.reviewId)}>
                                        <svelte:component this={Trash2Icon} class="w-5 h-5 lg:w-6 lg:h-6 hover:text-gray-500" />
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="flex justify-center items-center">
                        <div class="flex flex-col items-center lg:w-[400px] text-gray-400 p-5 gap-y-2">
                            <svelte:component this={AlertCircleIcon} size={50} strokeWidth={1.5} />
                            <p class="text-xs md:text-sm text-center">{nameInput != "" ? $LL.Reviews.NoReviewsFilter() : $LL.Reviews.NoReviews() }</p>
                        </div>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>

    {#if !loading && total != 0}
        <div class="flex justify-between px-[5px] text-sm">
            <p>{$LL.Reviews.ShowingItemsLabel({ firstElement, pageSize: lastElement, total })}</p>
            <div class="flex gap-x-[10px]">
                {#if total > 5}
                    <button on:click={() => { if (page != 1) changePage("decrement") }} class="mx-auto border border-gray-200 hover:bg-gray-100 shadow rounded">
                        <svelte:component this={ChevronLeftIcon} />
                    </button>
                    <button on:click={() => { if (lastElement != total) changePage("increment") }} class="mx-auto border border-gray-200 hover:bg-gray-100 shadow rounded">
                        <svelte:component this={ChevronRightIcon} />
                    </button>
                {/if}
            </div>
        </div>
    {/if}
</div>