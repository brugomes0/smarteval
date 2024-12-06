<script lang="ts">
    import { ChevronRightIcon, CircleCheckIcon, CircleXIcon, Trash2Icon, XIcon } from "lucide-svelte"
    import { createEventDispatcher } from "svelte"
    import { dndzone } from "svelte-dnd-action"
    import { flip } from "svelte/animate"
    import { getFullLanguageText } from "../helpers/action"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    export let editableCategory: CreateReviewCategoryData
    export let languageChoosen: string[]
    export let languageShow: string
    export let newCategory: boolean

    let accValue: number = editableCategory.questions.reduce((acc, item) => acc + item.value, 0)
    let flipDurationMs: number = 200
    let requiredQuestionsHavePercentage: boolean = true

    const dispatch = createEventDispatcher()
    const closeModal = () => { dispatch('close') }
    const confirmChanges = () => {
        editableCategory.questions.forEach(question => {
            if (question.isRequired && question.value == 0) requiredQuestionsHavePercentage = false 
        })

        if (editableCategory.value == 0 || editableCategory.value == null || editableCategory.value > 100) { toast.error("Category needs a percentage value"); return }
        if (!requiredQuestionsHavePercentage) { toast.error("Required questions must have a percentage"); return }        
        if (accValue != 100) { toast.error("Total percentage of questions must be 100%"); return }
        dispatch('save')
    }

    const handleQuestionSort = (event: any) => {
        const newArrayQuestions = event.detail.items.map((item: any, index: number) => ({ ...item, position: index + 1 }))
        editableCategory.questions = [...newArrayQuestions]
    }

    function changeQuestionValue(index: number) {
        const question = editableCategory.questions.find((_, i) => i == index)

        if (question?.isRequired) { return false }

        editableCategory.questions[index].value = 0
        accValue = editableCategory.questions.reduce((acc, item) => acc + item.value, 0)
        return true
    }

    function deleteQuestion(id: number) { 
        editableCategory.questions = editableCategory.questions.filter(q => q.id !== id)
        editableCategory.questions = editableCategory.questions.map((question, index) => ({ ...question, position: index + 1 }))
        accValue = editableCategory.questions.reduce((acc, item) => acc + item.value, 0)
    }

    function handleBlurQuestion(index: number) {
        accValue = editableCategory.questions.reduce((acc, item) => acc + item.value, 0)
        if (accValue > 100) {
            let over = accValue - 100
            editableCategory.questions[index].value = editableCategory.questions[index].value - over
            accValue = editableCategory.questions.reduce((acc, item) => acc + item.value, 0)
        }
    }
</script>

<div class="fixed top-0 left-0 bg-black bg-opacity-75 w-screen h-full transition-opacity duration-500 z-40">
    <div class="flex flex-col gap-y-4 px-3 md:px-5 py-10 lg:p-10 mx-auto my-5 w-5/6 md:w-4/5 lg:w-3/5 2xl:w-[1200px] h-[90%] rounded shadow relative overflow-y-auto bg-gray-100">
        <button on:click={closeModal} class="absolute top-1 right-1 text-black hover:text-red-500">
            <svelte:component this={XIcon} />
        </button>
        {#if languageChoosen.length >= 2}
            <select bind:value={languageShow} class="absolute border-2 right-10 rounded text-sm top-[5px] w-40 bg-gray-100 border-gray-300">
                {#each languageChoosen as language}
                    <option value={language}>{getFullLanguageText(language)}</option>
                {/each}
            </select>
        {/if}
        {#each editableCategory.translations as translation}
            {#if translation.language === languageShow}
                <div class="flex flex-col">
                    <h1 class="font-bold text-xl text-black">{translation.title}</h1>
                    <p class="h-8 line-clamp-2 text-xs text-gray-400">{translation.description}</p>
                </div>
            {/if}
        {/each}
        <div class="border-b border-gray-300" />
        <div class="flex flex-col gap-y-1">
            <p class="font-semibold text-base text-black">{$LL.CreateReviews.CategoryPercentage()}</p>
            <input bind:value={editableCategory.value} class="p-2 rounded text-xs" min="0" max="100" type="number" />
        </div>
        <div class="flex flex-col gap-y-2">
            <div class="flex gap-x-4 items-center">
                <p class="font-semibold text-base text-black">{$LL.CreateReviews.Questions()}: </p>
                <div class="flex gap-x-2 items-center text-xs text-gray-400">
                    <div class="flex h-3 rounded-lg w-40 bg-gray-300">
                        <div class="border flex rounded-lg select-none text-transparent {accValue == 0 ? 'border-transparent': 'bg-gray-100 border-gray-300'}" style="width: {accValue}%;">percentage</div>
                    </div>
                    <svelte:component this={accValue == 100 ? CircleCheckIcon : CircleXIcon} class="w-4 h-4 {accValue == 100 ? 'text-green-500' : 'text-red-500'}" />
                    <p>{accValue}/100%</p>
                </div>
            </div>
            {#if editableCategory.questions.length > 0}
                <section use:dndzone={{ items: editableCategory.questions, flipDurationMs, dropTargetStyle: {}, type: "questionsDndZone"}} on:consider={(e) => handleQuestionSort(e)} on:finalize={(e) => handleQuestionSort(e)} class="flex flex-col">
                    {#each editableCategory.questions as question (question.id)}
                        <div class="flex flex-col px-5 py-[10px] hover:bg-gray-200 relative group rounded" animate:flip={{ duration: flipDurationMs }}>
                            {#each question.translations as translation}
                                {#if translation.language === languageShow}
                                    <div class="flex flex-col flex-grow">
                                        <button on:click={() => deleteQuestion(question.id)} class="hidden group-hover:inline absolute top-1 right-1">
                                            <svelte:component this={Trash2Icon} class="w-4 h-4 text-gray-400 hover:text-red-500" />
                                        </button>
                                        <span class="text-sm text-black">{question.position}. {translation.title}</span>
                                        <span class="text-xs text-gray-400">{translation.description}</span>
                                        {#if question.type === "Rating"}
                                            <div class="flex gap-x-5 mt-2 ml-2">
                                                <div class="flex gap-x-1 text-xs">
                                                    <span class="text-gray-400">{$LL.CreateReviews.Mandatory()}: </span>
                                                    <input bind:checked={question.isRequired} on:change={() => changeQuestionValue(question.position - 1)} type="checkbox" />
                                                </div>
                                                <div class="flex gap-x-1 text-xs">
                                                    <span class="text-gray-400">{$LL.CreateReviews.Value()}: </span>
                                                    <input bind:value={question.value} class="border px-2 rounded border-gray-300" on:blur={() => handleBlurQuestion(question.position - 1)} disabled={!question.isRequired} type="number" />
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/each}
                </section>
            {/if}
        </div>
        <div class="border-b border-gray-300" />
        <div class="flex justify-end">
            <button on:click={confirmChanges} class="flex gap-x-2 items-center py-2 px-4 rounded bg-blue-500 text-white">
                <span>{newCategory ? $LL.CreateReviews.Add() : $LL.CreateReviews.Save()}</span>
                <svelte:component this={ChevronRightIcon} />
            </button>
        </div>
    </div>
</div>