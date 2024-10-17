<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { AlertCircleIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-svelte"
    import { Link } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"

    export let user: UserData

    let buttonCreate: boolean = false
    let buttonDelete: boolean = false
    let categories: CategoryInfoData[] = []
    let error: string = ""
    let firstElement: number = 0
    let languageShowing: string = ""
    let lastElement: number = 0
    let loading: boolean = true
    let nameInput: string = ""
    let page: number = 1
    let pageSize: number = 5
    let timeoutId: any
    let total: number = 0

    async function deleteCategory(categoryId: string) {
        categories = [], loading = true
        let response = await requestToApi("DELETE", `SmartEval/Categories/${categoryId}`)
        if (response.statusCode === 200) {
            toast.success($LL.Categories.ToastDelete())
        } else { toast.error($LL.Categories.ToastDeleteError()) }
        page = 1
        debounce(getCategories, 500)
    }

    async function getCategories() {
        let response = await requestToApi("GET", `SmartEval/Categories?page=${page}&pageSize=${pageSize}&language=${languageShowing}&name=${nameInput}`)
        if (response.statusCode === 200) {
            categories = response.data
            total = response.totalCount
        } else { error = response.error }
        loading = false
    }

    function changePage(change: string) {
        categories = [], loading = true
        if (change === 'increment' && page < Math.ceil(total / pageSize)) {
            page++
        } else if (change === 'decrement' && page > 1) {
            page --
        }
        debounce(getCategories, 500)
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function handleInputChanges() {
        categories = [], loading = true, total = 0
        debounce(getCategories, 1000)
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === "Categories")
        const permissionCreate = windowPermission?.permissions.find(temp => temp.permissionType === "Create")
        const permissionDelete = windowPermission?.permissions.find(temp => temp.permissionType === "Delete")

        if (permissionCreate?.hasPermission) buttonCreate = true
        if (permissionDelete?.hasPermission) buttonDelete = true

        getCategories()
    })

    $: {
        firstElement = Math.min((page - 1) * pageSize + 1, total)
        lastElement = Math.min(page * pageSize, total)
    }
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col lg:flex-row gap-x-20 gap-y-5 items-start justify-between">
        <div class="flex flex-col">
            <p class="font-semibold text-center lg:text-left text-lg text-black">{$LL.Categories.Title()}</p>
            <p class="text-sm text-gray-400">{$LL.Categories.Description()}</p>
        </div>
        {#if buttonCreate}
            <div class="flex">
                <Link class="flex font-semibold gap-x-[5px] items-center justify-center px-[10px] py-[5px] rounded text-sm w-max bg-blue-500 hover:bg-blue-600 text-white" to="/categories/createCategory">
                    <svelte:component this={PlusIcon} />
                    <span class="text-center">{$LL.Categories.CreateButton()}</span>
                </Link>
            </div>
        {/if}
    </div>

    <div class="flex relative">
        <input
            bind:value={nameInput}
            on:input={() => { page = 1; handleInputChanges() }}
            class="border pl-12 pr-5 py-3 rounded-lg text-sm w-full border-gray-200 bg-gray-100"
            placeholder={$LL.Categories.InputText()}
            type="text"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svelte:component this={SearchIcon} />
        </div>
    </div>

    <div class="flex flex-col">
        {#if loading}
            <div class="flex items-center justify-center">
                <p>{$LL.RatingGroups.Loading()}</p>
            </div>
        {:else}
            {#if error}
                <div class="border-2 font-semibold p-2 rounded text-sm bg-red-600 border-red-800 text-white">
                    <p>{$LL.RatingGroups.Error()}</p>
                </div>
            {:else}
                {#if categories.length > 0}
                    {#each categories as category}
                        <div class="flex gap-x-5 items-center justify-between md:h-[80px] p-[10px] border-b border-gray-300">
                            <div class="flex gap-x-4 flex-grow">
                                <div class="flex flex-col gap-x-1 pt-1">
                                    <p class="text-sm md:text-base">{category.title}</p>
                                    <p class="hidden md:flex text-xs text-gray-400 overflow-hidden max-h-8">{category.description}</p>
                                </div>
                            </div>
                            <div class="flex gap-x-2">
                                <Link class="text-xs md:text-sm font-semibold px-2 py-1 rounded-lg cursor-pointer whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white" to="/categories/{category.categoryId}">{$LL.Categories.Preview()}</Link>
                                {#if buttonDelete}
                                    <button on:click={() => deleteCategory(category.categoryId)}>
                                        <svelte:component this={Trash2Icon} class="w-6 h-6 hover:text-gray-500" />
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="flex justify-center items-center">
                        <div class="flex flex-col items-center w-[400px] text-gray-400 p-5 gap-y-2">
                            <svelte:component this={AlertCircleIcon} size={50} strokeWidth={1.5} />
                            <p class="text-xs md:text-sm text-center">{nameInput != "" ? $LL.Categories.NoCategoriesFilter() : $LL.Categories.NoCategories() }</p>
                        </div>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>

    {#if !loading && total != 0}
        <div class="flex justify-between px-[5px] text-sm">
            <p>{$LL.RatingGroups.ShowingItemsLabel({ firstElement, pageSize: lastElement, total })}</p>
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