<script lang="ts">
    import EmployeesComponent from "./helpers/EmployeesComponent.svelte"
    import LL from "../i18n/i18n-svelte"
    import RatingGroupComponent from "./helpers/RatingGroupComponent.svelte"
    import toast from "svelte-french-toast"
    import { dndzone } from "svelte-dnd-action"
    import { flip } from "svelte/animate"
    import { getEvaluationTypeText, getFullLanguageText, getTranslation, translationExistInLang } from "../helpers/action"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { validateReview } from "../helpers/validationReview"
    import { AlertTriangleIcon, ChevronLeftIcon, ChevronRightIcon, CircleCheckIcon, CirclePlusIcon, CircleXIcon, CopyIcon, FilePenIcon, FileQuestion, PencilIcon, Trash2Icon, XIcon } from "lucide-svelte"
    import { Steps } from "svelte-steps"
    import ModalEditCategory from "./ModalEditCategory.svelte";
    import { fly } from "svelte/transition";

    export let reviewId: string

    const evaluationTypes: { [key: number]: string } = {
        1: "TopDown",
        2: "BottomUp",
        3: "SelfEvaluation",
        4: "TeamEvaluation",
        5: "Interdepartamental"
    }

    // Function to handle the sorting of categories
    const handleSort = (event: CustomEvent, evalIndex: number) => {
        editReview.evaluations[evalIndex].template = event.detail.items.map((item: any, index: number) => ({
            ...item,
            position: index + 1
        }))
    }

    // Function to change step backwards by clicking the button
    const handleStepBackward = (event: Event) => { if (current != 0) current -= 1 }

    // Function to change step forward by clicking the button
    const handleStepForward = (event: Event) => {
        let check = checkStep(current)
        if (!check) return
        if (current != steps.length - 1) {
            current += 1
        } else {
            document.getElementById('buttonGoForward')?.setAttribute('disabled', 'disabled')
            //editReview()
        }
    }

    let accValue: number = 0
    let categories: CategoryInfo2Data[] = []
    let categoriesEditModal: boolean = false
    let categoriesPage: number = 1
    let categoriesSize: number = 10
    let categoriesTotal: number = 0
    let current: number = 0
    let editableCategory: CreateReviewCategoryData|EditCategory2Data
    let editReview: EditReviewData
    let error: string = ""
    let flipDurationMs: number = 200
    let languages: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languagesChoosen: string[] = []
    let languagesShow: string = ""
    let loading: boolean = true
    let newCategory: boolean = false
    let page: number = 0
    let ratingGroups: RatingGroupInfo2Data[] = []
    let ratingGroupsPage: number = 1
    let ratingGroupsSize: number = 10
    let ratingGroupsTotal: number = 0
    let review: any
    let steps = [
        { text: $LL.Steps.Details() },
        { text: $LL.EvaluationTypes.TopDown() },
        { text: $LL.EvaluationTypes.BottomUp() },
        { text: $LL.EvaluationTypes.SelfEvaluation() },
        { text: $LL.EvaluationTypes.Departmental() },
        { text: $LL.EvaluationTypes.Interdepartmental() },
        { text: $LL.Steps.Employees() }
    ]

    // Load categories available to the selected languages
    async function getCategories() {
        let response = await requestToApi(
            "GET",
            `SmartEval/Categories/AvailableLanguages?page=${categoriesPage}&pageSize=${categoriesSize}&languages=${languagesChoosen.join(",")}`)
        if (response.statusCode === 200) {
            categories = [...categories, ...response.data]
            categoriesTotal = response.totalCount
            if (categories.length != categoriesTotal) { categoriesPage++; getCategories() }
        } else { error = response.error }
    }

    // Load rating groups available to the selected languages
    async function getRatingGroups() {
        let response = await requestToApi(
            "GET",
            `SmartEval/RatingGroups/AvailableLanguages?page=${ratingGroupsPage}&pageSize=${ratingGroupsSize}&languages=${languagesChoosen.join(",")}`)
        if (response.statusCode === 200) {
            ratingGroups = [...ratingGroups, ...response.data]
            ratingGroupsTotal = response.totalCount
            if (ratingGroups.length != ratingGroupsTotal) { ratingGroupsPage++; getRatingGroups() }
        } else { error = response.error }
    }

    // Load review to edit
    async function loadReview() {
        let response = await requestToApi("GET", `SmartEval/Reviews/${reviewId}/Data`)
        if (response.statusCode === 200) {
            review = response.data
            languagesChoosen = review.languages

            editReview = {
                title: review.title,
                description: review.description,
                reviewId: review.reviewId,
                departments: review.departments,
                employees: review.employees,
                evaluations: review.evaluations.map((evaluation: any) => ({
                    type: evaluation.type,
                    ratingGroupId: evaluation.ratingGroupId,
                    template: evaluation.template.map((category: any, cIndex: number) => ({
                        id: cIndex + 1,
                        categoryId: category.categoryId,
                        position: category.position,
                        questions: category.questions.map((question: any, qIndex: number) => ({
                            id: qIndex + 1,
                            questionId: question.questionId,
                            isRequired: question.isRequired,
                            position: question.position,
                            translations: question.translations.map((translation: any) => ({
                                language: translation.language,
                                title: translation.title,
                                description: translation.description
                            })),
                            type: question.type,
                            value: question.value
                        })),
                        translations: category.translations.map((translation: any) => ({
                            language: translation.language,
                            title: translation.title,
                            description: translation.description
                        })),
                        value: category.value,
                    }))
                }))
            }
        }

        loading = false
    }

    // Function to select category
    async function selectCategory(categoryToAdd: CategoryInfo2Data, step: number) {
        const evaluationType = evaluationTypes[step]
        const evaluation = editReview.evaluations.find(temp => temp.type === evaluationType)
        const canAddCategory = evaluation ? evaluation.template.some((temp: any) => temp.categoryId === categoryToAdd.categoryId) : false

        if (evaluation && !canAddCategory) {
            let response = await requestToApi("GET", `SmartEval/Categories/${categoryToAdd.categoryId}`)
            if (response.statusCode === 200) {
                let category: CategoryData = response.data
                
                const mappedQuestions: CreateReviewQuestionData[] = category.questions.map((question, index) => ({
                    id: index + 1,
                    questionId: question.questionId,
                    type: question.type,
                    position: index + 1,
                    value: 0,
                    isRequired: question.type === "Rating" ? true : false,
                    translations: question.translations.filter(temp => languagesChoosen.includes(temp.language))
                }))

                editableCategory = {
                    id: evaluation.template.length + 1,
                    categoryId: category.categoryId,
                    position: evaluation.template.length + 1,
                    value: 0,
                    questions: mappedQuestions,
                    translations: category.translations.filter(temp => languagesChoosen.includes(temp.language))
                }

                newCategory = true
                categoriesEditModal = true
            } else { toast.error($LL.EditReviews.CannotGetCategory()) }
        } else if (canAddCategory) {
            toast.error($LL.EditReviews.CategoryAlreadyExists())
        } else {
            toast.error($LL.EditReviews.NoEvaluation())
        }
    }

    // Function to validate the selection of languages
    async function validateLanguages() {
        if (languagesChoosen.length === 0) {
            toast.error($LL.EditReviews.NoSelectionLanguages())
            return
        }

        await getCategories()
        if (categories.length === 0) {
            toast.error($LL.EditReviews.NoCategories())
            return
        }

        await getRatingGroups()
        if (ratingGroups.length === 0) {
            toast.error($LL.EditReviews.NoRatingGroups())
            return
        }

        languagesShow = languagesChoosen[0]
        page++
    }

    // Function to add evaluation to review when user click button
    function addEvaluation(step: number) {
        const evaluationType = evaluationTypes[step]

        editReview.evaluations = [...editReview.evaluations, { type: evaluationType, totalValue: 0, ratingGroupId: "", template: [] }]
    }

    // Function to check if user can change step
    function checkStep(step: number) {
        let message = validateReview(editReview, step)
        if (message != null && message != "") { toast.error(message); return false }

        return true
    }

    // Function to close modal of edit category
    function closeModal() {
        editableCategory = { id: 0, categoryId: "", position: 0, value: 0, questions: [], translations: [] }
        categoriesEditModal = false
    }

    // Function to create a new evaluation by copying one that already exist
    function copyEvaluation(step: number, evaluationToCopy: any) {
        const evaluationType = evaluationTypes[step]

        const newEvaluation = JSON.parse(JSON.stringify(evaluationToCopy))
        newEvaluation.type = evaluationType
        editReview.evaluations = [...editReview.evaluations, newEvaluation]
    }

    // Function to delete category from evaluation
    function deleteCategory(id: number, index: number) {
        editReview.evaluations[index].template = editReview.evaluations[index].template.filter((cat: any) => cat.id !== id)
    }

    function deleteEvaluation(type: string) {
        editReview.evaluations = editReview.evaluations.filter((temp: any) => temp.type !== type)
    }

    // Function to change steps in evaluation when clicking step-bar
    function handleStepClick(step: number, nextStep: number) {
        if (step > nextStep) return nextStep

        for (let i = step; i < nextStep; i++) {
            let check = checkStep(i)
            if (!check) return i
        }

        return nextStep
    }

    // Function to check if checkbox of language param is checked
    function isCheckboxChecked(language: string) {
        return languagesChoosen.includes(language)
    }

    // Function to open modal to edit category
    function openCategory(categoryToEdit: EditCategory2Data, step: number) {
        newCategory = false
        editableCategory = JSON.parse(JSON.stringify(categoryToEdit))
        categoriesEditModal = true
    }

    // Function to save modal of edit category
    function saveModal() {
        const evaluationType = evaluationTypes[current]
        const evaluation = editReview.evaluations.find(temp => temp.type === evaluationType)

        if (evaluation) {
            if (newCategory) {
                evaluation.template.push(editableCategory as EditCategory2Data)
            } else {
                const cIndex = evaluation.template.findIndex(cat => cat.id === editableCategory.id)
                if (cIndex !== -1) evaluation.template[cIndex] = editableCategory as EditCategory2Data
            }
            
            editReview = { ...editReview, evaluations: [...editReview.evaluations] }
        }

        closeModal()
    }

    // Function to add checked languages to array
    function toggleCheckbox(event: Event, language: string) {
        const target = event.target as HTMLInputElement
        if (target.checked) {
            languagesChoosen = [...languagesChoosen, language]
        } else {
            languagesChoosen = languagesChoosen.filter(temp => temp !== language)
        }
    }

    onMount(async () => loadReview())

    $: {
        if (current >= 1 && current <= 5) {
            let evaluationIndex = editReview.evaluations.findIndex(temp => temp.type === evaluationTypes[current])
            if (evaluationIndex != -1) accValue = editReview.evaluations[evaluationIndex].template.reduce((acc: number, item: any) => acc + item.value, 0)
        }
    }

    $: console.log(editReview)
</script>

{#if categoriesEditModal}
    <ModalEditCategory
        bind:newCategory
        bind:editableCategory
        bind:languageChoosen={languagesChoosen}
        bind:languageShow={languagesShow}
        on:close={closeModal}
        on:save={saveModal}
    />
{/if}

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePenIcon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.EditReviews.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.EditReviews.Description()}</p>
        </div>
    </div>

    {#if loading}
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="4" cy="12" r="3" fill="currentColor">
                    <animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.5s" dur="1.5s" values="3;.2;3"/>
                </circle>
                <circle cx="12" cy="12" r="3" fill="currentColor">
                    <animate attributeName="r" begin="svgSpinners3DotsScale0.end-1.2s" dur="1.5s" values="3;.2;3"/>
                </circle>
                <circle cx="20" cy="12" r="3" fill="currentColor">
                    <animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.9s" dur="1.5s" values="3;.2;3"/>
                </circle>
            </svg>
        </div>
    {:else}
        {#if page == 0}
            <div class="flex flex-col">
                <p class="font-semibold text-base">{$LL.EditReviews.LanguageTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.EditReviews.LanguageDesc()}</p>
                <div class="flex flex-col gap-y-1 mt-2 px-5">
                    {#each languages as lang}
                        <label class="cursor-pointer flex gap-x-[10px] text-sm w-min">
                            <input
                                on:change={(e) => toggleCheckbox(e, lang)}
                                checked={isCheckboxChecked(lang)} 
                                id="languageOption_{lang}" 
                                type="checkbox"
                            />
                            {getFullLanguageText(lang)}
                        </label>
                    {/each}
                </div>
            </div>
            <button
                on:click={validateLanguages} 
                class="font-semibold mx-auto lg:ml-0 lg:mr-auto py-[5px] rounded w-[200px] bg-blue-500 hover:bg-blue-600 text-white"
            >
                {$LL.EditReviews.Continue()}
            </button>
        {:else if page == 1}
            <div class="flex flex-col gap-y-5 text-xs text-gray-400">
                <div class="hidden lg:flex justify-center">
                    <div class="w-[950px]">
                        <Steps
                            clickable={true}
                            size="2.3em"
                            {steps}
                            bind:current
                            on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)}
                        />
                    </div>
                </div>

                {#if current == 0}
                    <div class="flex flex-col">
                        <div class="flex flex-col">
                            <p class="font-semibold text-base text-black">{$LL.EditReviews.ReviewTitleTitle()}</p>
                            <p class="text-xs text-gray-400">{$LL.EditReviews.ReviewTitleDesc()}</p>
                            <input
                                bind:value={editReview.title}
                                class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                                maxlength="100"
                                name="titleReview"
                            />
                        </div>
                        <div class="flex flex-col">
                            <p class="font-semibold text-base text-black">{$LL.EditReviews.ReviewDescTitle()}</p>
                            <p class="text-xs text-gray-400">{$LL.EditReviews.ReviewDescDesc()}</p>
                            <textarea
                                bind:value={editReview.description}
                                class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                                maxlength="300"
                                name="descReview"
                                rows="4"
                            />
                        </div>
                    </div>
                {:else if current >= 1 && current <= 5}
                    {#each editReview.evaluations as evaluation}
                        {#if evaluation.type === evaluationTypes[current]}
                            <div class="flex flex-col gap-y-5">
                                <div class="flex items-center justify-between">
                                    <div class="flex gap-x-2">
                                        <p class="font-semibold text-base text-black">{$LL.EditReviews.ShowInLanguage()}</p>
                                        <select bind:value={languagesShow} class="border p-1 rounded border-gray-300 bg-gray-100 text-gray-900">
                                            {#each languagesChoosen as lang}
                                                <option value={lang}>{getFullLanguageText(lang)}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <button
                                        on:click={() => deleteEvaluation(evaluation.type)}
                                        class="border rounded border-gray-300 hover:bg-gray-100"
                                        title={$LL.EditReviews.DeleteEvaluation()}
                                    >
                                        <svelte:component this={XIcon} />
                                    </button>
                                </div>
                                <div class="flex flex-col">
                                    <p class="font-semibold text-base text-black">{$LL.EditReviews.CategoryDivTitle()}</p>
                                    <p class="text-xs text-gray-400">{$LL.EditReviews.CategoryDivDesc()}</p>
                                    <div class="flex gap-x-2 items-center mt-3">
                                        <div class="flex h-3 rounded-lg w-40 bg-gray-300">
                                            <div
                                                class="border flex rounded-lg select-none text-transparent {accValue == 0 ? 'border-transparent': 'bg-gray-100 border-gray-300'}"
                                                style="width: {accValue}%;"
                                            >percentage</div>
                                        </div>
                                        <svelte:component
                                            this={accValue == 100 ? CircleCheckIcon : CircleXIcon}
                                            class="w-4 h-4 {accValue == 100 ? 'text-green-500' : 'text-red-500'}"
                                        />
                                        <p>{accValue}/100%</p>
                                    </div>
                                    <div class="flex gap-x-5 my-1 w-full">
                                        <div class="border flex overflow-y-auto rounded w-3/4 bg-gray-100 border-gray-300">
                                            {#each editReview.evaluations as evaluation, index}
                                                {#if evaluation.type === evaluationTypes[current]}
                                                    {#if evaluation.template.length === 0}
                                                        <div class="px-4 py-2 text-sm">
                                                            <p>{$LL.EditReviews.CategoryDivPlaceholder()}</p>
                                                        </div>
                                                    {:else}
                                                        <section
                                                            use:dndzone={{ items: evaluation.template, flipDurationMs, dropTargetStyle: {}, type: "categoriesDndZone" }}
                                                            on:consider={(e) => handleSort(e, index)}
                                                            on:finalize={(e) => handleSort(e, index)}
                                                            class="flex flex-col gap-y-1 p-1 w-full"
                                                        >
                                                            {#each evaluation.template as category (category.id)}
                                                                <div
                                                                    class="flex gap-x-2 group items-start pl-[10px] pr-[5px] py-[5px] lg:pl-5 lg:pr-[10px] lg:py-[10px] rounded w-full hover:bg-gray-200"
                                                                    animate:flip={{ duration: flipDurationMs }}
                                                                >
                                                                    <div class="flex flex-col flex-grow">
                                                                        <div class="flex gap-x-[10px] items-center">
                                                                            <span class="font-medium text-base text-gray-900">
                                                                                {category.position}. {getTranslation(category.translations, languagesShow).title} ({category.value}%)
                                                                            </span>
                                                                            {#if !translationExistInLang(category.translations, languagesShow)}
                                                                                <button title="Categoria não tem tradução neste idioma">
                                                                                    <svelte:component class="text-red-500" size={20} this={AlertTriangleIcon} />
                                                                                </button>
                                                                            {/if}
                                                                        </div>
                                                                        
                                                                        <span class="hidden lg:inline text-xs text-gray-400">
                                                                            {getTranslation(category.translations, languagesShow).description}
                                                                        </span>
                                                                        <div class="flex flex-col flex-grow gap-y-1 mt-2 mx-5">
                                                                            {#each category.questions as question}
                                                                                <div class="flex flex-col">
                                                                                    <span class="text-sm text-gray-900">
                                                                                        {question.position}. {getTranslation(question.translations, languagesShow).title} {question.isRequired ? '*' : ''}
                                                                                    </span>
                                                                                    <span class="hidden lg:inline text-xs text-gray-400">
                                                                                        {getTranslation(question.translations, languagesShow).description}
                                                                                    </span>
                                                                                    <span class="mx-4">
                                                                                        {question.type === "Rating" ? `****[${$LL.EditReviews.AnswerRating()}]****` : `****[${$LL.EditReviews.AnswerText()}]****`}
                                                                                    </span>
                                                                                </div>
                                                                            {/each}
                                                                        </div>
                                                                    </div>
                                                                    <div class="flex flex-col gap-y-2 h-full shrink-0 w-4">
                                                                        <button
                                                                            on:click={() => openCategory(category, current)}
                                                                            class="group-hover:inline hidden hover:text-gray-800"
                                                                            title={$LL.EditReviews.EditCategory()}
                                                                        >
                                                                            <svelte:component this={PencilIcon} size={16} />
                                                                        </button>
                                                                        <button
                                                                            on:click={() => deleteCategory(category.id, index)}
                                                                            class="group-hover:inline hidden hover:text-gray-800"
                                                                            title={$LL.EditReviews.DeleteCategory()}
                                                                        >
                                                                            <svelte:component this={Trash2Icon} size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            {/each}
                                                        </section>
                                                    {/if}
                                                {/if}
                                            {/each}
                                        </div>
                                        <div class="border flex flex-col max-h-[400px] p-1 overflow-y-auto rounded w-1/4 bg-gray-100 border-gray-300">
                                            <p class="font-medium my-2 text-base text-center text-gray-800">{$LL.EditReviews.Categories()}</p>
                                            {#each categories as category}
                                                <button on:dblclick={() => selectCategory(category, current)} class="p-2 rounded text-left w-full hover:bg-gray-200">
                                                    {#each category.translations as translation}
                                                        {#if translation.language === languagesShow}
                                                            <li class="mx-1 text-gray-600">{translation.title}</li>
                                                        {/if}
                                                    {/each}
                                                </button>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                                <RatingGroupComponent bind:evaluation ratingGroupsInfo={ratingGroups} />
                            </div>
                        {/if}
                    {/each}
                    {#if !editReview.evaluations.find(temp => temp.type === evaluationTypes[current])}
                        <div class="flex flex-col gap-y-2">
                            <div class="flex flex-col">
                                <span class="font-semibold text-base text-black">{$LL.EditReviews.CreateEvaluation()}</span>
                                <span class="text-xs text-gray-400">{$LL.EditReviews.CreateEvaluationDesc()}</span>
                            </div>
                            <button on:click={() => addEvaluation(current)} class="flex gap-x-2 items-center p-2">
                                <svelte:component this={CirclePlusIcon} />
                                <span>{$LL.EditReviews.AddEvaluation()}</span>
                            </button>
                            {#if editReview.evaluations.length > 0}
                                <span class="font-semibold text-base text-black">{$LL.EditReviews.CopyEvaluation()}</span>
                                <div class="flex flex-col px-2">
                                    {#each editReview.evaluations as evaluation}
                                        {#if evaluation.type !== evaluationTypes[current]}
                                            <div class="flex items-center">
                                                <span class="text-xs w-[120px]">{getEvaluationTypeText(evaluation.type)}</span>
                                                <button on:click={() => copyEvaluation(current, evaluation)} class="p-1 rounded hover:bg-gray-100">
                                                    <svelte:component this={CopyIcon} size={20} />
                                                </button>
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                {:else if current == 6}
                    <EmployeesComponent bind:selectedDepartments={editReview.departments} bind:selectedEmployees={editReview.employees} />
                {/if}

                <div class="flex justify-between">
                    <button
                        on:click={handleStepBackward}
                        class="border flex font-semibold gap-x-2 items-center md:text-base px-5 py-2 rounded text-sm hover:bg-gray-100"
                        id="buttonGoBack"
                    >
                        <svelte:component this={ChevronLeftIcon} strokeWidth={4} size={20} />
                        {$LL.Steps.Return()}
                    </button>
                    <button
                        on:click={handleStepForward}
                        class="flex font-semibold gap-x-2 items-center md:text-base px-5 py-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white"
                        id="buttonGoForward"
                    >
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
    {/if}
</div>