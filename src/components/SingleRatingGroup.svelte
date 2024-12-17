<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { CalendarDaysIcon, PencilIcon, Trash2Icon, UserIcon, XIcon } from "lucide-svelte"
    import { convertUtcToLocalDate } from "../helpers/date"
    import { getFullLanguageText } from "../helpers/action"
    import { Link, navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { toast } from "svelte-french-toast"
    import ModalComponent from "./helpers/ModalComponent.svelte";

    export let lang: string
    export let ratingGroupId: string
    export let user: UserData

    let availableLanguages: string[] = []
    let buttonDelete: boolean = false
    let buttonEdit: boolean = false
    let error: string = ""
    let loading: boolean = true
    let modalDeleteIsOpen: boolean = false
    let ratingGroup: RatingGroupData = { ratingGroupId: "", title: "", description: "", createDate: "", createByUser: "", isBeingUsed: false, ratingOptions: [] }
    let selectLanguage: string = ""

    async function deleteRatingGroup() {
        let response = await requestToApi("DELETE", `SmartEval/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            toast.success($LL.RatingGroups.ToastDelete())
            navigate("/ratingGroups")
            exitModal()
        } else { toast.error($LL.RatingGroups.ToastDeleteError()) }
    }

    async function getRatingGroup() {
        let response = await requestToApi("GET", `SmartEval/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            ratingGroup = response.data
            ratingGroup.createDate = convertUtcToLocalDate(ratingGroup.createDate, lang)
            availableLanguages = ratingGroup.ratingOptions[0].translations.map(trans => trans.language)
            selectLanguage = availableLanguages[0]
            loading = false
        } else { error = response.error }
    }

    function exitModal() { modalDeleteIsOpen = false }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === "RatingGroups")
        const permissionDelete = windowPermission?.permissions.find(temp => temp.permissionType === "Delete")
        const permissionEdit = windowPermission?.permissions.find(temp => temp.permissionType === "Update")

        if (permissionDelete?.hasPermission) buttonDelete = true
        if (permissionEdit?.hasPermission) buttonEdit = true

        getRatingGroup()
    })
</script>

{#if modalDeleteIsOpen}
    <ModalComponent on:save={() => deleteRatingGroup()}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SingleRatingGroups.ActionsDelete()}</span>
            <button on:click={exitModal} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SingleRatingGroups.ActionsDeleteModal()}</span>
        </div>
    </ModalComponent>
{/if}

{#if !loading}
    <div class="flex flex-col gap-y-5">
        <div class="border flex flex-col rounded overflow-hidden border-gray-300">
            <div class="border-b flex justify-between p-4 bg-gray-100 border-gray-300">
                <span class="font-semibold text-lg">{ratingGroup.title}</span>
                <div class="flex">
                    {#if buttonEdit}
                        <Link class="p-[5px] rounded hover:bg-gray-200" to="/ratingGroups/{ratingGroupId}/edit">
                            <svelte:component this={PencilIcon} size={20} />
                        </Link>
                    {/if}
                    {#if buttonDelete}
                        <button on:click={() => modalDeleteIsOpen = true} class="p-[5px] rounded hover:bg-gray-200">
                            <svelte:component this={Trash2Icon} size={20} />
                        </button>
                    {/if}
                </div>
            </div>
            <div class="flex flex-col gap-y-4 p-4">
                <div class="flex flex-col lg:flex-row gap-x-4 gap-y-4">
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleRatingGroups.CreateBy()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={UserIcon} />
                            <input
                                bind:value={ratingGroup.createByUser}
                                class="border flex flex-grow px-2 py-1 rounded border-gray-300 text-gray-400"
                                disabled
                                id="ratingGroupCreateByUser"
                            />
                        </div>
                    </label>
                    <label class="flex flex-col w-full">
                        <span class="font-medium text-xs">{$LL.SingleRatingGroups.CreateDate()}</span>
                        <div class="flex gap-x-2 items-center pl-2 w-full">
                            <svelte:component this={CalendarDaysIcon} />
                            <input
                                bind:value={ratingGroup.createDate}
                                class="border flex flex-grow px-2 py-1 rounded border-gray-300 text-gray-400"
                                disabled
                                id="ratingGroupCreateDate"
                            />
                        </div>
                    </label>
                </div>
                <label class="flex flex-col">
                    <span class="font-medium text-xs">{$LL.SingleRatingGroups.Description()}</span>
                    <textarea 
                        bind:value={ratingGroup.description}
                        class="border line-clamp-2 px-2 py-1 rounded text-ellipsis border-gray-300 text-gray-400"
                        disabled
                        id="ratingGroupDescription"
                        rows="2"
                    />
                </label>
            </div>
        </div>

        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-medium text-lg">{$LL.SingleRatingGroups.RatingOptions()}</span>
                <span class="text-xs text-gray-400">
                    {$LL.SingleRatingGroups.RatingOptionsDesc()}
                    <br>
                    {$LL.SingleRatingGroups.NeedComment()}
                </span>
            </div>
            <div class="flex flex-col lg:flex-row gap-y-2 gap-x-5 items-start">
                <div class="flex flex-col flex-grow gap-y-4 px-5">
                    {#each ratingGroup.ratingOptions as ratingOption}
                        {#each ratingOption.translations as trans}
                            {#if trans.language === selectLanguage}
                                <li class="flex flex-col font-medium text-base">
                                    {ratingOption.numericValue}. {trans.title}{ratingOption.needComment ? ' *' : ''}
                                    <span class="font-normal text-xs text-gray-400">{trans.description}</span>
                                </li>
                            {/if}
                        {/each}
                    {/each}
                </div>
                <div class="order-first lg:order-last w-60">
                    <select bind:value={selectLanguage} class="border p-[5px] rounded text-sm w-full bg-gray-100 border-gray-300">
                        {#each availableLanguages as language}
                            <option value={language}>{getFullLanguageText(language)}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
    </div>
{/if}