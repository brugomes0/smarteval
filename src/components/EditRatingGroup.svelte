<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { ChevronLeftIcon, ChevronRightIcon, CircleFadingPlusIcon, FilePenIcon, Trash2Icon } from "lucide-svelte"
    import { getFullLanguageText } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { Steps } from "svelte-steps"
    import { validateRatingGroup } from "../helpers/validationRatingGroup"

    export let ratingGroupId: string

    let current: number = 0
    let editableRatingOption: EditRatingOptionData
    let editRatingGroup: EditRatingGroupData = { title: '', description: '', ratingOptions: [] }
    let error: string = ""
    let languages: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languagesChoosen: string[] = []
    let languageShow: string = ""
    let loading: boolean = true
    let ratingGroup: RatingGroupData = { ratingGroupId: "", title: "", description: "", createDate: "", createByUser: "", isBeingUsed: false, ratingOptions: [] }
    let steps = [{ text: $LL.Steps.Details() }, { text: $LL.Steps.RatingOptions() }]

    async function getRatingGroup() {
        let response = await requestToApi("GET", `SmartEval/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            ratingGroup = response.data
            languagesChoosen = [...ratingGroup.ratingOptions[0].translations.map(trans => trans.language)]
            editRatingGroup.title = ratingGroup.title
            editRatingGroup.description = ratingGroup.description
            loading = false
        } else { error = response.error }
    }

    async function updateRatingGroup() {
        let response = await requestToApi("PUT", `SmartEval/RatingGroups/${ratingGroupId}`, editRatingGroup)
        if (response.statusCode === 200) {
            toast.success($LL.EditRatingGroups.ToastSuccess())
            navigate("/")
        } else {
            document.getElementById('buttonGoForward')?.removeAttribute('disabled')
            toast.error($LL.EditRatingGroups.ToastError())
        }
    }

    const handleStepBackward = (event: Event) => { if (current != 0) current -= 1 }

    const handleStepForward = (event: Event) => {
        let check = checkStep(current)
        if (!check) return
        if (current != steps.length - 1) {
            current += 1
        } else {
            document.getElementById('buttonGoForward')?.setAttribute("disabled", "disabled")
            updateRatingGroup()
        }
    }

    function addRatingOption() {
        editRatingGroup.ratingOptions = [
            ...editRatingGroup.ratingOptions, 
            { 
                numericValue: ratingGroup.ratingOptions.length,
                needComment: false,
                translations: languagesChoosen.map(temp => ({ language: temp, title: '', description: '' }))
            }
        ]
        editableRatingOption = editRatingGroup.ratingOptions[editRatingGroup.ratingOptions.length - 1]
    }

    function checkStep(step: number) {
        let message = validateRatingGroup(editRatingGroup, step, languagesChoosen)
        if (message != null && message != "") { toast.error(message); return false }

        if (step == 0) {
            languageShow = languagesChoosen[0]
            editRatingGroup.ratingOptions = ratingGroup.ratingOptions.map(option => ({
                ratingOptionId: option.ratingOptionId,
                numericValue: option.numericValue,
                needComment: option.needComment,
                translations: option.translations.map(trans => ({
                    translationId: trans.ratingOptionTranslationId,
                    language: trans.language,
                    title: trans.title,
                    description: trans.description
                }))
            }))
            editRatingGroup.ratingOptions.forEach((_, index) => {
                languagesChoosen.forEach(language => {
                    const exists = editRatingGroup.ratingOptions[index].translations.find(t => t.language === language)
                    if (!exists) editRatingGroup.ratingOptions[index].translations.push({ language, title: '', description: '' })
                })
                editRatingGroup.ratingOptions[index].translations = editRatingGroup.ratingOptions[index].translations.filter(t => languagesChoosen.includes(t.language))
            })
        }

        return true
    }

    function deleteRatingOption(index: number) {
        if (!Array.isArray(editRatingGroup.ratingOptions)) return
        if (index >= 0 && index < editRatingGroup.ratingOptions.length) {
            editRatingGroup.ratingOptions = editRatingGroup.ratingOptions.filter((_, i) => i !== index)
            for (let i = 0; i < editRatingGroup.ratingOptions.length; i++) editRatingGroup.ratingOptions[i].numericValue = i
        }
    }

    function handleStepClick(step: number, nextStep: number): number {
        if (step > nextStep) return nextStep

        for (let i = step; i < nextStep; i++) {
            let check = checkStep(i)
            if (!check) return i
        }

        return nextStep
    }

    function isCheckboxChecked(language: string): boolean { return languagesChoosen.includes(language) }

    function toggleCheckbox(event: Event, language: string) {
        const target = event.target as HTMLInputElement
        if (target.checked) {
            languagesChoosen = [...languagesChoosen, language]
        } else {
            languagesChoosen = languagesChoosen.filter(temp => temp !== language)
        }
    }

    onMount(async () => { getRatingGroup() })
</script>

{#if !loading}
    <div class="flex flex-col gap-y-5">
        <div class="flex flex-col md:flex-row gap-x-5 items-center">
            <div class="block">
                <svelte:component this={FilePenIcon} class="text-blue-500" size="90" />
            </div>
            <div class="flex flex-col gap-y-2">
                <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.EditRatingGroups.Title()}</h1>
                <p class="text-center md:text-left text-sm text-gray-400">{$LL.EditRatingGroups.Description()}</p>
            </div>
        </div>
        <div class="flex flex-col gap-y-5 text-xs text-gray-400">
            <div class="hidden lg:flex justify-center">
                <div class="w-[950px]">
                    <Steps clickable={true} size="2.3em" {steps} bind:current on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)} />
                </div>
            </div>
        </div>

        {#if current == 0}
            <div class="flex flex-col gap-y-5">
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.EditRatingGroups.RatingGroupTitleTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.EditRatingGroups.RatingGroupTitleDesc()}</p>
                    <input bind:value={editRatingGroup.title} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="100" name="titleRatingGroup" />
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.EditRatingGroups.RatingGroupDescTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.EditRatingGroups.RatingGroupDescDesc()}</p>
                    <textarea bind:value={editRatingGroup.description} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="300" name="descRatingGroup" rows="4" />
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.EditRatingGroups.RatingGroupLangTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.EditRatingGroups.RatingGroupLangDesc()}</p>
                    <div class="flex flex-col px-5 py-[10px]">
                        {#each languages as language}
                            <label class="cursor-pointer flex gap-x-[10px] w-min">
                                <input checked={isCheckboxChecked(language)} id="language{language}" type="checkbox" on:change={(event) => toggleCheckbox(event, language)} />
                                {getFullLanguageText(language)}
                            </label>
                        {/each}
                    </div>
                </div>
            </div>
        {:else if current == 1}
            <div class="flex flex-col gap-y-5">
                <div class="flex gap-x-5">
                    <p class="font-semibold text-base text-black">{$LL.EditRatingGroups.ShowInLanguage()}</p>
                    <select bind:value={languageShow} class="border p-[5px] rounded text-sm w-[200px] bg-gray-100 border-gray-300 text-gray-900" id="currentLangShown">
                        {#each languagesChoosen as language}
                            <option value={language}>{getFullLanguageText(language)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.EditRatingGroups.RatingOptionsTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.EditRatingGroups.RatingOptionsDesc()}</p>
                </div>
                <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                    {#each editRatingGroup.ratingOptions as ratingOption, index}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div on:click={() => editableRatingOption = ratingOption} class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableRatingOption == ratingOption ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}">
                            {#each ratingOption.translations as rtoTranslation}
                                {#if rtoTranslation.language == languageShow}
                                    {#if editableRatingOption == ratingOption}
                                        <p class="font-medium text-base">{ratingOption.numericValue}</p>
                                        <div class="flex flex-col flex-grow">
                                            <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                                {$LL.EditRatingGroups.SingleRatingOptionTitle()}
                                                <input bind:value={rtoTranslation.title} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="100" type="text" />
                                            </label>
                                            <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                                {$LL.EditRatingGroups.SingleRatingOptionDesc()}
                                                <textarea bind:value={rtoTranslation.description} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="300" rows="2" />
                                            </label>
                                            <label class="flex font-medium gap-x-2 rounded text-xs w-full text-gray-900">
                                                {$LL.EditRatingGroups.SingleRatingOptionNeedComment()}
                                                <input bind:checked={ratingOption.needComment} type="checkbox" />
                                            </label>
                                        </div>
                                        <button on:click={() => deleteRatingOption(index)} class="hover:text-red-500 text-gray-400" disabled={ratingGroup.isBeingUsed} title={ratingGroup.isBeingUsed ? $LL.EditRatingGroups.IsBeingUsedDelete() : $LL.EditRatingGroups.DeleteRatingOption()}>
                                            <svelte:component this={Trash2Icon} size={20} />
                                        </button>
                                    {:else}
                                        <p class="font-medium text-base">{ratingOption.numericValue}</p>
                                        <div class="flex flex-col flex-grow">
                                            <p class="font-medium text-base text-gray-900">{rtoTranslation.title} {ratingOption.needComment ? '*' : ''}</p>
                                            <p class="text-xs text-gray-400">{rtoTranslation.description}</p>
                                        </div>
                                    {/if}
                                {/if}
                            {/each}
                        </div>
                    {/each}
                    <button on:click={addRatingOption} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400" title={ratingGroup.isBeingUsed ? $LL.EditRatingGroups.IsBeingUsedAdd() : ''}>
                        <svelte:component this={CircleFadingPlusIcon} />
                        {$LL.EditRatingGroups.AddRatingOption()}
                    </button>
                </div>
            </div>
        {/if}

        <div class="flex justify-between">
            <button on:click={handleStepBackward} class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded hover:bg-gray-100" id="buttonGoBack">
                <svelte:component this={ChevronLeftIcon} strokeWidth={4} size={20} />
                {$LL.Steps.Return()}
            </button>
            <button on:click={handleStepForward} class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white" id="buttonGoForward">
                {#if current != steps.length - 1}
                    {$LL.Steps.Forward()}
                {:else}
                    {$LL.Steps.Finalize()}
                {/if}
                <svelte:component this={ChevronRightIcon} strokeWidth={4} size={20} />
            </button>
        </div>
    </div>
{/if}