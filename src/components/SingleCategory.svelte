<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { CalendarDaysIcon, PencilIcon, Trash2Icon, UserIcon } from "lucide-svelte"
    import { convertUtcToLocalDate } from "../helpers/date"
    import { getFullLanguageText } from "../helpers/action"
    import { Link, navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { toast } from "svelte-french-toast"

    export let lang: string
    export let categoryId: string
    export let user: UserData

    let availableLanguages: string[] = []
    let buttonEdit: boolean = false
    let buttonDelete: boolean = false
    let category: CategoryData = { categoryId: "", createByUser: "", createDate: "", isBeingUsed: false, questions: [], translations: [] }
    let error: string = ""
    let loading: boolean = true
    let selectLanguage: string = ""

    async function deleteCategory() {
        let response = await requestToApi("DELETE", `SmartEval/Categories/${categoryId}`)
        if (response.statusCode === 200) {
            toast.success($LL.Categories.ToastDelete())
            navigate("/categories")
        } else { toast.error($LL.Categories.ToastDeleteError()) }
    }

    async function getCategory() {
        let response = await requestToApi("GET", `SmartEval/Categories/${categoryId}`)
        if (response.statusCode === 200) {
            category = response.data
            category.createDate = convertUtcToLocalDate(category.createDate, lang)
            availableLanguages = category.translations.map(trans => trans.language)
            selectLanguage = availableLanguages[0]
            loading = false
        } else { error = response.error }
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === "Categories")
        const permissionDelete = windowPermission?.permissions.find(temp => temp.permissionType === "Delete")
        const permissionEdit = windowPermission?.permissions.find(temp => temp.permissionType === "Update")

        if (permissionDelete?.hasPermission) buttonDelete = true
        if (permissionEdit?.hasPermission) buttonEdit = true

        getCategory()
    })
</script>

{#if !loading}
    <div class="flex flex-col gap-y-2">
        <div class="flex justify-end">
            <select bind:value={selectLanguage} class="border p-[5px] rounded text-sm w-40 border-gray-300 bg-gray-100 text-gray-900">
                {#each availableLanguages as language}
                    <option value={language}>{getFullLanguageText(language)}</option>
                {/each}
            </select>
        </div>

        <div class="border flex flex-col rounded overflow-hidden border-gray-300">
            <div class="border-b flex justify-between p-4 bg-gray-100 border-gray-300">
                {#each category.translations as translation}
                    {#if translation.language === selectLanguage}
                        <span class="font-semibold text-lg">{translation.title}</span>
                    {/if}
                {/each}
                <div class="flex">
                    {#if buttonEdit}
                        <Link class="p-[5px] rounded hover:bg-gray-200" to="/categories/{categoryId}/edit">
                            <svelte:component this={PencilIcon} size={20} />
                        </Link>
                    {/if}
                    {#if buttonDelete}
                        <button on:click={deleteCategory} class="p-[5px] rounded hover:bg-gray-200">
                            <svelte:component this={Trash2Icon} size={20} />
                        </button>
                    {/if}
                </div>
            </div>
            <div class="flex flex-col gap-y-4 p-4">
                <div class="flex flex-col lg:flex-row gap-x-4 gap-y-4">
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleCategories.CreateBy()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={UserIcon} />
                            <input
                                bind:value={category.createByUser}
                                class="border flex flex-grow px-2 py-1 rounded border-gray-300 text-gray-400"
                                disabled
                                id="ratingGroupCreateByUser"
                            />
                        </div>
                    </label>
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleCategories.CreateDate()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={CalendarDaysIcon} />
                            <input
                                bind:value={category.createDate}
                                class="border flex flex-grow px-2 py-1 rounded border-gray-300 text-gray-400"
                                disabled
                                id="ratingGroupCreateDate"
                            />
                        </div>
                    </label>
                </div>
                <label class="flex flex-col">
                    <span class="font-medium text-xs">{$LL.SingleCategories.Description()}</span>
                    {#each category.translations as translation}
                        {#if translation.language === selectLanguage}
                            <textarea 
                                bind:value={translation.description}
                                class="border line-clamp-2 px-2 py-1 rounded text-ellipsis border-gray-300 text-gray-400"
                                disabled
                                id="ratingGroupDescription"
                                rows="2"
                            />
                        {/if}
                    {/each}
                </label>
            </div>
        </div>

        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-medium text-lg">{$LL.SingleCategories.Questions()}</span>
                <span class="text-xs text-gray-400">{$LL.SingleCategories.QuestionsTitle()}</span>
            </div>
            <div class="flex flex-col flex-grow gap-y-4 px-5">
                {#each category.questions as question, index}
                    {#each question.translations as trans}
                        {#if trans.language === selectLanguage}
                            <li class="flex flex-col font-medium mx-[10px] text-base">
                                {index + 1}. {trans.title}
                                <span class="font-normal text-xs text-gray-400">{trans.description}</span>
                                {#if question.type === 'Rating'}
                                    <div class="flex gap-x-5 m-[10px]">
                                        <label class="flex font-normal gap-x-[5px] items-center text-xs"><input disabled type="radio" />{$LL.SingleCategories.Option()}</label>
                                        <label class="flex font-normal gap-x-[5px] items-center text-xs"><input disabled type="radio" />{$LL.SingleCategories.Option()}</label>
                                        <label class="flex font-normal gap-x-[5px] items-center text-xs"><input disabled type="radio" />{$LL.SingleCategories.Option()}</label>
                                    </div>
                                {:else if question.type === 'Text'}
                                    <textarea class="border font-normal mt-[5px] mx-[10px] p-[5px] rounded text-xs bg-gray-100 border-gray-300" disabled placeholder={$LL.SingleCategories.TextResponse()} rows="2" />
                                {/if}
                            </li>
                        {/if}
                    {/each}
                {/each}
            </div>
        </div>
    </div>
{/if}