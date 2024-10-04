<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { AlertCircleIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-svelte"
    import { Link } from "svelte-routing"
    import { onMount } from "svelte";
    import { requestToApi } from "../helpers/api"

    export let lang: string
    export let user: UserData

    let buttonCreate: boolean = false
    let buttonDelete: boolean = false
    let error: string = ""
    let firstElement: number = 0
    let input: string = ""
    let lastElement: number = 0
    let loading: boolean = true
    let loadingPage: boolean = true
    let page: number = 1
    let pageSize: number = 5
    let templates: TemplateData[] = []
    let timeoutId: any
    let total: number = 0

    async function deleteTemplate(templateId: string) {
        loading = true, templates = []
        let response = await requestToApi("DELETE", `SmartEval/Templates?templateId=${templateId}`)
        if (response.statusCode == 200) {
            toast.success($LL.Templates.ToastDelete())
        } else { toast.error($LL.Templates.ToastErrorDelete()) }
        page = 1
        debounce(getTemplates, 500)
    }

    async function getTemplates() {
        let response = await requestToApi("GET", `SmartEval/Templates?page=${page}&pageSize=${pageSize}&language=${lang}&name=${input}`)
        if (response.statusCode == 200) {
            templates = response.data
            total = response.totalCount
        } else {
            error = response.error
        }
        loading = false
    }

    function changePage(change: string) {
        loading = true, templates = []
        if (change === 'increment' && page < Math.ceil(total / pageSize)) {
            page++
        } else if (change === 'decrement' && page > 1) { 
            page--
        }
        debounce(getTemplates, 500)
    }

    function debounce(func: any, delay: any) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function handleInputChanges() {
        loading = true, templates = [], total = 0
        debounce(getTemplates, 1000)
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === 'SmartEval')
        const window = module?.windowPermissions.find(temp => temp.windowType === 'Forms')
        const permissionCreate = window?.permissions.find(temp => temp.permissionType === 'Create')
        const permissionDelete = window?.permissions.find(temp => temp.permissionType === 'Delete')

        if (permissionCreate?.hasPermission) buttonCreate = true
        if (permissionDelete?.hasPermission) buttonDelete = true

        getTemplates()
        loadingPage = false
    })

    $: {
        firstElement = Math.min((page - 1) * pageSize + 1, total)
        lastElement = Math.min(page * pageSize, total)
    }
</script>

{#if loadingPage}
    <div class="flex items-center justify-center min-h-screen">
        <p>{$LL.Permissions.Loading()}...</p>
    </div>
{:else}
    <div class="flex flex-col gap-y-5">
        <div class="flex flex-col md:flex-row gap-y-5 justify-between">
            <h1 class="font-semibold text-2xl mx-auto md:mx-0">{ $LL.Templates.Templates() }</h1>
            <div class="flex gap-x-2">
                {#if buttonCreate}
                    <Link class="flex mx-auto md:mx-0 cursor-pointer font-semibold gap-x-1 items-center py-2 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600" to="/templates/createTemplate">
                        <svelte:component this={PlusIcon} />
                        {$LL.Templates.CreateTemplate()}
                    </Link>
                {/if}
            </div>
        </div>

        <div class="flex relative">
            <input 
                bind:value={input} 
                on:input={() => { page = 1; handleInputChanges() }}
                class="w-full pl-12 pr-5 py-3 rounded-lg text-sm border border-gray-200 bg-gray-100"
                placeholder="{$LL.Templates.InputText()}"
                type="text"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svelte:component this={SearchIcon} />
            </div>
        </div>

        <div class="flex flex-col">
            {#if loading}
                <div class="flex justify-center items-center">
                    <p>{$LL.Permissions.Loading()}...</p>
                </div>
            {:else}
                {#if error}
                    <div class="border-2 font-semibold p-2 rounded text-sm bg-red-600 border-red-800 text-white">
                        <p>{$LL.Templates.Error()}</p>
                    </div>
                {:else}
                    {#if templates.length > 0}
                        {#each templates as template}
                            <div class="flex gap-x-5 items-center justify-between md:h-[80px] p-[10px] border-b border-gray-300">
                                <div class="flex gap-x-4 flex-grow">
                                    <div class="flex flex-col gap-x-1 pt-1">
                                        <p class="text-sm md:text-base">{template.title}</p>
                                        <p class="hidden md:flex text-xs text-gray-400 overflow-hidden max-h-8">{template.description}</p>
                                    </div>
                                </div>

                                <div class="hidden md:flex gap-x-2">
                                    <Link class="text-xs md:text-sm font-semibold px-2 py-1 rounded-lg cursor-pointer whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white" to="/templates/{template.templateId}">{$LL.Templates.Preview()}</Link>
                                    {#if buttonDelete}
                                        <button on:click={() => deleteTemplate(template.templateId)}>
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
                                <p class="text-xs md:text-sm text-center">{input != "" ? $LL.Templates.NoTemplatesFilter() : $LL.Templates.NoTemplates() }</p>
                            </div>
                        </div>
                    {/if}
                {/if}
            {/if}
        </div>

        {#if !loading && total != 0}
            <div class="flex justify-between text-sm px-[5px]">
                <p>{$LL.Templates.ShowingItemsLabel({ firstElement: firstElement, pageSize: lastElement, total: total })}</p>
                <div class="flex gap-x-[10px]">
                    {#if total > 5}
                        <button on:click={() => { if (page != 1) changePage("decrement") }} 
                            class="mx-auto border border-gray-200 hover:bg-gray-100 shadow rounded"
                        >
                            <svelte:component this={ChevronLeftIcon} />
                        </button>
                        <button on:click={() => { if (lastElement != total) changePage("increment") }} 
                            class="mx-auto border border-gray-200 hover:bg-gray-100 shadow rounded"
                        >
                            <svelte:component this={ChevronRightIcon} />
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
{/if}