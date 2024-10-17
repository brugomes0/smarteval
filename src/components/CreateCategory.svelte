<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { ChevronLeftIcon, ChevronRightIcon, CircleFadingPlusIcon, FilePlus2Icon, Trash2Icon } from "lucide-svelte"
    import { navigate } from "svelte-routing"
    import { requestToApi } from "../helpers/api"
    import { Steps } from "svelte-steps"
    import { validateCategory } from "../helpers/validationCategory"
    import { getFullLanguageText } from "../helpers/action"

    let category: CreateCategoryData
    let current: number = 0
    let editableQuestion: CreateQuestionData
    let languages: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languagesChoosen: string[] = []
    let languageShow: string = ""
    let page: number = 0
    let steps = [{ text: $LL.Steps.Details() }, { text: $LL.Steps.RatingQuestions() }, { text: $LL.Steps.TextQuestions() }]

    async function saveCategory() {
        let response = await requestToApi("POST", `SmartEval/Categories`, category)
        if (response.statusCode === 201) {
            toast.success($LL.CreateCategory.ToastSuccess())
            navigate("/")
        } else {
            document.getElementById('buttonGoForward')?.removeAttribute('disabled')
            toast.error($LL.CreateCategory.ToastError())
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
            saveCategory()
        }
    }

    function addRatingQuestion() {
        let insertIndex = category.questions.length

        for (let i = 0; i < category.questions.length; i++) {
            if (category.questions[i].type === "Text") {
                insertIndex = i
                break
            }
        }

        category.questions = [
            ...category.questions.slice(0, insertIndex),
            { type: "Rating", translations: languagesChoosen.map(language => ({ language, title: '', description: '' })) },
            ...category.questions.slice(insertIndex)
        ]

        editableQuestion = category.questions[insertIndex]
    }

    function addTextQuestion() {
        category.questions = [
            ...category.questions,
            { type: "Text", translations: languagesChoosen.map(language => ({ language, title: '', description: '' })) }
        ]
    }

    function checkStep(step: number) {
        let message = validateCategory(category, step)
        if (message != null && message != "") { toast.error(message); return false }

        return true
    }

    function deleteQuestion(index: number) {
        if (!Array.isArray(category.questions)) return
        if (index >= 0 && index < category.questions.length) { category.questions = category.questions.filter((_, i) => i !== index) }
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

    function validateLanguages() {
        if (languagesChoosen.length === 0) {
            toast.error($LL.CreateCategory.ValidationError.NoLanguages())
        } else {
            category = {
                questions: [],
                translations: languagesChoosen.map(temp => ({ language: temp, title: '', description: '' }))
            }
            languageShow = category.translations[0].language
            page++
        }
    }

    $: console.log(category)
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateCategory.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.CreateCategory.Description()}</p>
        </div>
    </div>

    {#if page == 0}
        <div class="flex flex-col">
            <p class="font-semibold text-base text-black">{$LL.CreateCategory.LanguageTitle()}</p>
            <p class="text-xs text-gray-400">{$LL.CreateCategory.LanguageDesc()}</p>
            <div class="flex flex-col mt-2 px-5">
                {#each languages as lang}
                    <label class="cursor-pointer flex gap-x-[10px] text-sm w-min">
                        <input checked={isCheckboxChecked(lang)} id="languageOption_{lang}" type="checkbox" on:change={(event) => toggleCheckbox(event, lang)} />
                        {getFullLanguageText(lang)}
                    </label>
                {/each}
            </div>
        </div>
        <button on:click={validateLanguages} class="font-semibold mx-auto lg:ml-0 lg:mr-auto py-[5px] rounded w-[200px] bg-blue-500 hover:bg-blue-600 text-white">{$LL.CreateCategory.Continue()}</button>
    {:else if page == 1}
        <div class="flex flex-col gap-y-5 text-xs text-gray-400">
            <div class="hidden lg:flex justify-center">
                <div class="w-[950px]">
                    <Steps clickable={true} size="2.3em" {steps} bind:current on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)} />
                </div>
            </div>

            {#if current == 0}
                <div class="flex gap-x-2">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.ShowInLanguage()}</p>
                    <select bind:value={languageShow} class="border p-[5px] rounded border-gray-300 bg-gray-100 text-gray-900">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getFullLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.CategoryTitleTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.CreateCategory.CategoryTitleDesc()}</p>
                    {#each category.translations as translation}
                        {#if translation.language === languageShow}
                            <input bind:value={translation.title} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="75" name="titleCategory" />
                        {/if}
                    {/each}
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.CategoryDescTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.CreateCategory.CategoryDescDesc()}</p>
                    {#each category.translations as translation}
                        {#if translation.language === languageShow}
                            <textarea bind:value={translation.description} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="250" name="descCategory" rows="4" />
                        {/if}
                    {/each}
                </div>
            {:else if current == 1}
                <div class="flex gap-x-2">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.ShowInLanguage()}</p>
                    <select bind:value={languageShow} class="border p-[5px] rounded border-gray-300 bg-gray-100 text-gray-900">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getFullLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.RatingQuestionsTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.CreateCategory.RatingQuestionsDesc()}</p>
                </div>
                <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                    {#each category.questions as question, index}
                        {#if question.type === "Rating"}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div on:click={() => editableQuestion = question} class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableQuestion == question ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}">
                                {#each question.translations as rtoTranslation}
                                    {#if rtoTranslation.language == languageShow}
                                        {#if editableQuestion == question}
                                            <div class="flex flex-col flex-grow">
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                                    {$LL.CreateCategory.QuestionTitle()}
                                                    <input bind:value={rtoTranslation.title} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="75" type="text" />
                                                </label>
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                                    {$LL.CreateCategory.QuestionDesc()}
                                                    <textarea bind:value={rtoTranslation.description} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="250" rows="2" />
                                                </label>
                                            </div>
                                            <button on:click={() => deleteQuestion(index)} class="hover:text-red-500 text-gray-400" title={$LL.CreateCategory.DeleteQuestion()}>
                                                <svelte:component this={Trash2Icon} size={20} />
                                            </button>
                                        {:else}
                                            <div class="flex flex-col flex-grow">
                                                <p class="font-medium text-base text-gray-900">{rtoTranslation.title ? rtoTranslation.title : $LL.CreateCategory.NoTitle()}</p>
                                                <p class="text-xs text-gray-400">{rtoTranslation.description}</p>
                                            </div>
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    {/each}
                    <button on:click={addRatingQuestion} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400">
                        <svelte:component this={CircleFadingPlusIcon} />
                        {$LL.CreateCategory.AddQuestion()}
                    </button>
                </div>
            {:else if current == 2}
                <div class="flex gap-x-2">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.ShowInLanguage()}</p>
                    <select bind:value={languageShow} class="border p-[5px] rounded border-gray-300 bg-gray-100 text-gray-900">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getFullLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.CreateCategory.TextQuestionsTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.CreateCategory.TextQuestionsDesc()}</p>
                </div>
                <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                    {#each category.questions as question, index}
                        {#if question.type === "Text"}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div on:click={() => editableQuestion = question} class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableQuestion == question ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}">
                                {#each question.translations as rtoTranslation}
                                    {#if rtoTranslation.language == languageShow}
                                        {#if editableQuestion == question}
                                            <div class="flex flex-col flex-grow">
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                                    {$LL.CreateCategory.QuestionTitle()}
                                                    <input bind:value={rtoTranslation.title} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="75" type="text" />
                                                </label>
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-gray-900">
                                                    {$LL.CreateCategory.QuestionDesc()}
                                                    <textarea bind:value={rtoTranslation.description} class="border font-normal px-2 py-1 rounded text-sm border-gray-300" maxlength="250" rows="2" />
                                                </label>
                                            </div>
                                            <button on:click={() => deleteQuestion(index)} class="hover:text-red-500 text-gray-400" title={$LL.CreateCategory.DeleteQuestion()}>
                                                <svelte:component this={Trash2Icon} size={20} />
                                            </button>
                                        {:else}
                                            <div class="flex flex-col flex-grow">
                                                <p class="font-medium text-base text-gray-900">{rtoTranslation.title}</p>
                                                <p class="text-xs text-gray-400">{rtoTranslation.description}</p>
                                            </div>
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    {/each}
                    <button on:click={addTextQuestion} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400">
                        <svelte:component this={CircleFadingPlusIcon} />
                        {$LL.CreateCategory.AddQuestion()}
                    </button>
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
</div>