<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon, CircleFadingPlusIcon, FilePlus2Icon, XIcon } from "lucide-svelte"
    import { Steps } from "svelte-steps"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    let chooseLang: string = ""
    let current: number = 0
    let languages = [
        { value: "EN", name: $LL.Languages.EN(), checked: false },
        { value: "ES", name: $LL.Languages.ES(), checked: false },
        { value: "FR", name: $LL.Languages.FR(), checked: false },
        { value: "PL", name: $LL.Languages.PL(), checked: false },
        { value: "PT", name: $LL.Languages.PT(), checked: false }
    ]
    let languagesChoosen: string[] = []
    let page: number = 1
    let steps = [{ text: $LL.Steps.Details() }, { text: $LL.Steps.Categories() }, { text: $LL.Steps.RatingOptions() }]
    let template: CreateTemplateData = { totalValue: 0, categories: [], ratingOptions: [], translations: [] }

    const handleStepBackward = (event: Event) => {
        if (current != 0) current -= 1
    }

    const handleStepForward = (event: Event) => {
        let check = checkStep(current)
        if (!check) return
        if (current != steps.length - 1) current += 1
        else {
            //document.getElementById('buttonGoForward')?.setAttribute("disabled", "disabled")
            //saveTemplate()
        }
    }

    function addRatingOption() {
        template.ratingOptions = [
            ...template.ratingOptions, 
            { 
                numericValue: template.ratingOptions.length + 1,
                translations: template.translations.map(temp => ({ language: temp.language, title: '', description: '' }))
            }
        ]
    }

    // function to check if in page 1, user chooses at least one language to start creation of template
    function checkLanguages() {
        if (languagesChoosen.length < 1) { toast.error($LL.CreateTemplates.NoLanguagesError()); return }
        languagesChoosen.forEach((lang: string) => { template.translations = [...template.translations, { language: lang, title: '', description: '' }] })
        chooseLang = template.translations[0].language
        page++
    }

    function checkStep(step: number) {
        // let message = handleValidationsForm(template, step)
        // if (message != null && message != "") { toast.error(message); return false }
        return true
    }

    function deleteRto(index: number) {
        if (!Array.isArray(template.ratingOptions)) return;

        if (index >= 0 && index < template.ratingOptions.length) {
            template.ratingOptions = template.ratingOptions.filter((_, i) => i !== index)
            toast.success("Rating option deleted")
        } else { toast.error("Index out of bounds") }
    }

    function handleStepClick(lastStep: number, currentStep: number): number {
        if (lastStep > currentStep) return currentStep

        for (let i = lastStep; i < currentStep; i++) {
            let check = checkStep(i)
            if (!check) return i
        }
        return currentStep
    }

    $: languagesChoosen = languages.filter(temp => temp.checked).map(temp => temp.value)
    $: console.log(template)
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size={90} /> 
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateTemplates.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.CreateTemplates.Description()}</p>
        </div>
    </div>

    {#if page == 1}
        <div class="flex flex-col gap-y-2">
            <p class="font-medium">{$LL.CreateTemplates.SelectLangs()}</p>
            <div class="flex flex-col gap-y-1">
                {#each languages as language}
                    <button class="flex items-center cursor-pointer mr-auto" on:click={() => { language.checked = !language.checked }}>
                        <input bind:checked={language.checked} id="option_{language.value}" type="checkbox" />
                        <p class="ms-2 text-sm text-gray-900">{language.name}</p>
                    </button>
                {/each}
            </div>
            <button on:click={() => checkLanguages()} class="flex gap-x-2 mx-auto font-semibold px-5 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">
                {$LL.CreateTemplates.Continue()}
            </button>
        </div>
    {:else if page == 2}
        <div class="flex flex-col gap-y-5 text-xs text-gray-400">
            <div class="hidden lg:flex justify-center">
                <div class="w-[950px]">
                    <Steps clickable={true} size="2.3em" {steps} bind:current on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)} />
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-x-5 lg:items-center gap-y-2">
                <p class="text-black text-base font-semibold flex-shrink-0">{$LL.CreateTemplates.SelectedLanguage()}: </p>
                <select bind:value={chooseLang} class="border p-1 text-sm rounded w-[200px] bg-gray-100 border-gray-300 text-gray-900" id="current0_langOption">
                    {#each template.translations as translation}
                        <option value={translation.language}>{languages.find(temp => temp.value == translation.language)?.name}</option>
                    {/each}
                </select>
            </div>

            {#if current == 0}
                <div class="flex flex-col gap-y-5">
                    <div class="flex flex-col">
                        <p class="font-semibold text-base text-black">{$LL.CreateTemplates.TemplateTitleTitle()}</p>
                        <p>{$LL.CreateTemplates.TemplateTitleDesc()}</p>
                        {#each template.translations as translation}
                            {#if translation.language == chooseLang}
                                <input name="titleForm" class="border my-1 p-2 peer rounded w-auto text-black" bind:value={translation.title} />
                            {/if}
                        {/each}
                    </div>
                    <div class="flex flex-col">
                        <p class="font-semibold text-base text-black">{$LL.CreateTemplates.TemplateDescTitle()}</p>
                        <p>{$LL.CreateTemplates.TemplateDescDesc()}</p>
                        {#each template.translations as translation}
                            {#if translation.language == chooseLang}
                                <textarea name="descForm" class="border my-1 p-2 rounded w-auto" rows={8} bind:value={translation.description} />
                            {/if}
                        {/each}
                    </div>
                </div>
            {:else if current == 1}
                <div class="flex flex-col gap-y-5">
                    <div class="flex flex-col">
                        <p class="font-semibold text-base text-black">{$LL.CreateTemplates.CategoriesAndQuestionsTitle()}</p>
                        <p>{$LL.CreateTemplates.CategoriesAndQuestionsDesc()}</p>
                    </div>
                    <div class="border flex flex-col gap-y-[10px] h-[450px] overflow-y-scroll p-[10px] rounded bg-gray-50 border-gray-300"></div>
                </div>
            {:else}
                <div class="flex flex-col gap-y-5">
                    <div class="flex flex-col">
                        <p class="font-semibold text-base text-black">{$LL.CreateTemplates.RatingOptionsTitle()}</p>
                        <p>{$LL.CreateTemplates.RatingOptionsDesc()}</p>
                    </div>
                    <div class="border flex flex-col gap-y-[10px] h-[450px] overflow-y-scroll p-[10px] rounded bg-gray-50 border-gray-300">
                        {#if template.ratingOptions.length > 0}
                            {#each template.ratingOptions as rto, index}
                                <div class="flex flex-col gap-y-[5px] group px-[10px] py-[5px] relative rounded hover:bg-gray-100">
                                    <button on:click={() => deleteRto(index)} class="absolute group-hover:block hidden top-2 right-2 hover:text-red-500 text-gray-400" title={$LL.CreateTemplates.DeleteRatingOption()}>
                                        <svelte:component this={XIcon} />
                                    </button>
                                    {#each rto.translations as trans}
                                        {#if trans.language == chooseLang}
                                            <div class="flex flex-col gap-x-2 items-start text-sm rounded w-full text-gray-900">
                                                <p class="w-[120px]">{$LL.CreateTemplates.NumericValue()}: </p>
                                                <input bind:value={rto.numericValue} class="border px-2 py-1 rounded w-[120px] border-gray-300" placeholder={$LL.CreateTemplates.NumericValue()} type="number" />
                                            </div>
                                            <div class="flex flex-col gap-x-2 items-start text-sm rounded w-full text-gray-900">
                                                <p class="w-[120px]">{$LL.CreateTemplates.RtoTitlePlaceholder()}: </p>
                                                <input bind:value={trans.title} class="border px-2 py-1 rounded text-sm w-full border-gray-300" maxlength={50} type="text" />
                                            </div>
                                            <div class="flex flex-col gap-x-2 items-start text-sm rounded w-full text-gray-900">
                                                <p class="w-[120px]">{$LL.CreateTemplates.RtoDescPlaceholder()}: </p>
                                                <textarea bind:value={trans.description} class="border px-2 py-1 rounded text-sm w-full border-gray-300" maxlength={200} rows={4} />
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/each}
                        {/if}

                        <button on:click={addRatingOption} class="border border-dashed flex flex-shrink-0 gap-x-2 h-10 items-center justify-center rounded hover:bg-gray-100 border-gray-300">
                            <svelte:component this={CircleFadingPlusIcon} size={30} />
                            {$LL.CreateTemplates.AddRatingOption()}
                        </button>
                    </div>
                </div>
            {/if}

            <div class="flex justify-between">
                <button on:click={handleStepBackward} id="buttonGoBack" class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded hover:bg-gray-100">
                    <svelte:component this={ChevronLeftIcon} strokeWidth="4" size={20} />
                    {$LL.Steps.Return()}
                </button>

                <button on:click={handleStepForward} id="buttonGoForward" class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">
                    {#if current != steps.length - 1}
                        {$LL.Steps.Forward()}
                    {:else}
                        {$LL.Steps.Finalize()}
                    {/if}
                    <svelte:component this={ChevronRightIcon} strokeWidth="4" size={20} />
                </button>
            </div>
        </div>
    {/if}
</div>