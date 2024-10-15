<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { ChevronLeftIcon, ChevronRightIcon, CircleFadingPlusIcon, FilePlus2Icon, Trash2Icon } from "lucide-svelte"
    import { getFullLanguageText } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { requestToApi } from "../helpers/api"
    import { Steps } from "svelte-steps"
    import { validateRatingGroup } from "../helpers/validationRatingGroup"

    let current: number = 0
    let editableRatingOption: CreateRatingOptionData
    let languages: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languagesChoosen: string[] = []
    let languageShow: string = ""
    let ratingGroup: CreateRatingGroupData = { title: "", description: "", ratingOptions: [] }
    let steps = [{ text: $LL.CreateRatingGroups.Details() }, { text: $LL.CreateRatingGroups.RatingOptions() }]

    async function saveRatingGroup() {
        let response = await requestToApi("POST", `SmartEval/RatingGroups`, ratingGroup)
        if (response.statusCode === 201) {
            toast.success($LL.CreateRatingGroups.ToastSuccess())
            navigate("/")
        } else {
            document.getElementById('buttonGoForward')?.removeAttribute('disabled')
            toast.error($LL.CreateRatingGroups.ToastError())
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
            saveRatingGroup()
        }
    }

    function addRatingOption() {
        ratingGroup.ratingOptions = [
            ...ratingGroup.ratingOptions,
            {
                numericValue: ratingGroup.ratingOptions.length,
                needComment: false,
                translations: languagesChoosen.map(temp => ({ language: temp, title: '', description: '' }))
            }
        ]
        editableRatingOption = ratingGroup.ratingOptions[ratingGroup.ratingOptions.length - 1]
    }

    function checkStep(step: number) {
        let message = validateRatingGroup(ratingGroup, step, languagesChoosen)
        if (message != null && message != "") { toast.error(message); return false }
        if (step === 0) { languageShow = languagesChoosen[0] }
        return true
    }

    function deleteRatingOption(index: number) {
        if (!Array.isArray(ratingGroup.ratingOptions)) return
        if (index >= 0 && index < ratingGroup.ratingOptions.length) {
            ratingGroup.ratingOptions = ratingGroup.ratingOptions.filter((_, i) => i !== index)
            for(let i = 0; i < ratingGroup.ratingOptions.length; i++) {
                ratingGroup.ratingOptions[i].numericValue = i
            }
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
        ratingGroup.ratingOptions = []
    }
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateRatingGroups.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.CreateRatingGroups.Description()}</p>
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
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingGroupTitleTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingGroupTitleDesc()}</p>
                <input bind:value={ratingGroup.title} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="75" name="titleRatingGroup" />
            </div>
            <div class="flex flex-col">
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingGroupDescTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingGroupDescDesc()}</p>
                <textarea bind:value={ratingGroup.description} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="250" name="descRatingGroup" rows="4" />
            </div>
            <div class="flex flex-col">
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingGroupLangTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingGroupLangDesc()}</p>
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
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.ShowInLanguage()}</p>
                <select bind:value={languageShow} class="border p-[5px] rounded text-sm w-[200px] bg-gray-100 border-gray-300 text-gray-900" id="currentLangShown">
                    {#each languagesChoosen as language}
                        <option value={language}>{getFullLanguageText(language)}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col">
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingOptionsTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingOptionsDesc()}</p>
            </div>
            <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                {#each ratingGroup.ratingOptions as ratingOption, index}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div on:click={() => editableRatingOption = ratingOption} class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableRatingOption == ratingOption ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}">
                        {#each ratingOption.translations as rtoTranslation}
                            {#if rtoTranslation.language == languageShow}
                                {#if editableRatingOption == ratingOption}
                                    <p class="font-medium text-base">{ratingOption.numericValue}</p>
                                    <div class="flex flex-col flex-grow">
                                        <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                            {$LL.CreateRatingGroups.SingleRatingOptionTitle()}
                                            <input bind:value={rtoTranslation.title} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="75" type="text" />
                                        </label>
                                        <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                            {$LL.CreateRatingGroups.SingleRatingOptionDesc()}
                                            <textarea bind:value={rtoTranslation.description} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="250" rows="2" />
                                        </label>
                                        <label class="flex font-medium gap-x-2 rounded text-xs w-full text-gray-900">
                                            {$LL.CreateRatingGroups.SingleRatingOptionNeedComment()}
                                            <input bind:checked={ratingOption.needComment} type="checkbox" />
                                        </label>
                                    </div>
                                    <button on:click={() => deleteRatingOption(index)} class="hover:text-red-500 text-gray-400" title={$LL.CreateRatingGroups.DeleteRatingOption()}>
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
                <button on:click={addRatingOption} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400">
                    <svelte:component this={CircleFadingPlusIcon} />
                    {$LL.CreateRatingGroups.AddRatingOption()}
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