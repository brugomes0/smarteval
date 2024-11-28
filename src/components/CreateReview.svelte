<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, CircleCheckIcon, CirclePlusIcon, CircleXIcon, CopyIcon, FilePlus2Icon, PencilIcon, Trash2Icon, XIcon } from "lucide-svelte"
    import { dndzone } from "svelte-dnd-action"
    import { flip } from "svelte/animate"
    import { getEvaluationTypeText, getFullLanguageText } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { requestToApi } from "../helpers/api"
    import { Steps } from "svelte-steps"
    import { validateReview } from "../helpers/validationReview"
    import ModalEditCategory from "./ModalEditCategory.svelte"
    import EmployeesComponent from "./helpers/EmployeesComponent.svelte"
    import RatingGroupComponent from "./helpers/RatingGroupComponent.svelte"
    import SveltyPicker from 'svelty-picker'
    import { convertLocalToUtcDate } from "../helpers/date";

    const evaluationTypes: { [key: number]: string } = { 1: "TopDown", 2: "BottomUp", 3: "SelfEvaluation", 4: "TeamEvaluation", 5: "Interdepartamental" }

    let accValue: number = 0
    let categoriesInfo: CategoryInfo2Data[] = []
    let categoriesInput: string = ""
    let categoriesEditModal: boolean = false
    let categoriesPage: number = 1
    let categoriesPageSize: number = 10
    let current: number = 0
    let editableCategory: CreateReviewCategoryData = { id: 0, categoryId: "", position: 0, value: 0, questions: [], translations: [] }
    let error: string = ""
    let flipDurationMs: number = 200
    let languageChoosen: string[] = []
    let languageList: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languageShow: string = ""
    let newCategory: boolean = false
    let page: number = 0
    let ratingGroupsInfo: RatingGroupInfo2Data[] = []
    let ratingGroupsInput: string = ""
    let ratingGroupsPage: number = 1
    let ratingGroupsPageSize: number = 10
    let review: CreateReviewData = { title: "", description: "", endDate: undefined, status: "NotStarted", departments: [], employees: [], evaluations: [] }
    let selectedRatingGroupId: string = ""
    let steps = [
        { text: $LL.Steps.Details() },
        { text: $LL.EvaluationTypes.TopDown() },
        { text: $LL.EvaluationTypes.BottomUp() },
        { text: $LL.EvaluationTypes.SelfEvaluation() },
        { text: $LL.EvaluationTypes.Departmental() },
        { text: $LL.EvaluationTypes.Interdepartmental() },
        { text: $LL.Steps.Employees() },
        { text: $LL.Steps.Finalize() }
    ]

    async function getCategories() {
        let response = await requestToApi("GET", `SmartEval/Categories/AvailableLanguages?page=${categoriesPage}&pageSize=${categoriesPageSize}&name=${categoriesInput}&languages=${languageChoosen.join(",")}`)
        if (response.statusCode === 200) {
            categoriesInfo = response.data
        } else { error = response.error }
    }

    async function getRatingGroups() {
        let response = await requestToApi("GET", `SmartEval/RatingGroups/AvailableLanguages?page=${ratingGroupsPage}&pageSize=${ratingGroupsPageSize}&name=${ratingGroupsInput}&languages=${languageChoosen.join(",")}`)
        if (response.statusCode === 200) {
            ratingGroupsInfo = response.data
        } else { error = response.error }
    }

    async function saveReview() {
        if (review.endDate) {
            review.endDate = convertLocalToUtcDate(review.endDate)
            review.status = "Active"
        }
        let response = await requestToApi("POST", `SmartEval/Reviews`, review)
        if (response.statusCode === 201) {
            toast.success($LL.CreateReviews.ToastSuccess())
            navigate("/")
        } else {
            document.getElementById('buttonGoForward')?.removeAttribute('disabled')
            toast.error($LL.CreateReviews.ToastError())
        }
    }

    async function selectCategory(categoryToAdd: CategoryInfo2Data, step: number) {
        const evaluationTypes: { [key: number]: string } = { 1: "TopDown", 2: "BottomUp", 3: "SelfEvaluation", 4: "TeamEvaluation", 5: "Interdepartamental" }
        const evaluationType = evaluationTypes[step] || ""

        const evaluation = review.evaluations.find(temp => temp.type === evaluationType)
        const canAddCategory = evaluation?.template.some(temp => temp.categoryId == categoryToAdd.categoryId)

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
                    translations: question.translations.filter(temp => languageChoosen.includes(temp.language))
                }))

                editableCategory = { 
                    id: evaluation.template.length + 1,
                    categoryId: category.categoryId,
                    position: evaluation.template.length + 1,
                    value: 0,
                    questions: mappedQuestions,
                    translations: category.translations.filter(temp => languageChoosen.includes(temp.language))
                }

                newCategory = true
                categoriesEditModal = true
            } else { toast.error($LL.CreateReviews.ValidationError.GetCategory()) }
        } else if (canAddCategory) {
            toast.error($LL.CreateReviews.ValidationError.RepeatCategory())
        } else {
            toast.error($LL.CreateReviews.ValidationError.EvaluationType())
        }
    }

    async function validateLanguages() {
        if (languageChoosen.length === 0) {
            toast.error($LL.CreateReviews.ValidationError.NoSelectionLanguages())
            return
        }

        await getCategories()
        if (categoriesInfo.length === 0) {
            toast.error($LL.CreateReviews.ValidationError.NoCategories())
            return
        }

        await getRatingGroups()
        if (ratingGroupsInfo.length === 0) {
            toast.error($LL.CreateReviews.ValidationError.NoRatingGroups())
            return
        }

        languageShow = languageChoosen[0]
        page++
    }

    // Function to handle changing of position of categories in the array inside evaluation
    const handleSort = (evt: any, evaluationIndex: number) => {
        review.evaluations[evaluationIndex].template = evt.detail.items.map((item: any, index: number) => ({...item, position: index + 1}))
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
            document.getElementById('buttonGoForward')?.setAttribute("disabled", "disabled")
            saveReview()
        }
    }

    // Function to add evaluation to review when user click button
    function addEvaluation(step: number) {
        const evaluationTypes: { [key: number]: string } = { 1: "TopDown", 2: "BottomUp", 3: "SelfEvaluation", 4: "TeamEvaluation", 5: "Interdepartamental" }
        const evaluationType = evaluationTypes[step] || ""

        review.evaluations = [...review.evaluations, { type: evaluationType, totalValue: 0, ratingGroupId: "", template: [] }]
    }

    // Function to check if user can change step
    function checkStep(step: number) {
        let message = validateReview(review, step)
        if (message != null && message != "") { toast.error(message); return false }

        return true
    }

    // Function to close modal when user clicks X button
    function closeModal() {
        editableCategory = { id: 0, categoryId: "", position: 0, value: 0, questions: [], translations: [] }
        categoriesEditModal = false
    }

    function copyEvaluation(step: number, evaluationToCopy: CreateReviewEvaluationData) {
        const evaluationType = evaluationTypes[step]

        const newEvaluation = JSON.parse(JSON.stringify(evaluationToCopy))
        newEvaluation.type = evaluationType
        review.evaluations = [...review.evaluations, newEvaluation]
    }

    // Function to remove category from evaluation template when clicking button
    function deleteCategory(id: number, index: number) {
        review.evaluations[index].template = review.evaluations[index].template.filter(cat => cat.id !== id)
    }

    function deleteEvaluation(type: string) {
        review.evaluations = review.evaluations.filter(temp => temp.type !== type)
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
    function isCheckboxChecked(language: string) { return languageChoosen.includes(language) }

    function openCategory(categoryToEdit: CreateReviewCategoryData, step: number) {
        newCategory = false
        editableCategory = JSON.parse(JSON.stringify(categoryToEdit))
        categoriesEditModal = true
    }

    // Function to save category in edit modal to review/evaluation
    function saveModal() {
        const evaluationTypes: { [key: number]: string } = { 1: "TopDown", 2: "BottomUp", 3: "SelfEvaluation", 4: "TeamEvaluation", 5: "Interdepartamental" }
        const evaluationType = evaluationTypes[current] || ""
        const evaluation = review.evaluations.find(temp => temp.type === evaluationType)

        if (evaluation) {
            if (newCategory) {
                evaluation.template.push(editableCategory)
            } else {
                const categoryIndex = evaluation.template.findIndex(cat => cat.id === editableCategory.id)
                if (categoryIndex !== -1) evaluation.template[categoryIndex] = { ...editableCategory }
            }

            review = { ...review, evaluations: [...review.evaluations] }
        }

        closeModal()
    }

    // Function to add checked languages to array
    function toggleCheckbox(event: Event, language: string) {
        const target = event.target as HTMLInputElement
        if (target.checked) {
            languageChoosen = [...languageChoosen, language]
        } else {
            languageChoosen = languageChoosen.filter(temp => temp !== language)
        }
    }

    $: { 
        if (current >= 1 && current <= 5) {
            let evaluationIndex = review.evaluations.findIndex(temp => temp.type === evaluationTypes[current])
            if (evaluationIndex != -1) {
                accValue = review.evaluations[evaluationIndex].template.reduce((acc, item) => acc + item.value, 0)
            }
        }
    }
</script>

{#if categoriesEditModal}
    <ModalEditCategory bind:newCategory bind:editableCategory bind:languageChoosen bind:languageShow on:close={closeModal} on:save={saveModal} />
{/if}

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateReviews.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.CreateReviews.Description()}</p>
        </div>
    </div>

    {#if page == 0}
        <div class="flex flex-col">
            <p class="font-semibold text-base text-black">{$LL.CreateReviews.LanguageTitle()}</p>
            <p class="text-xs text-gray-400">{$LL.CreateReviews.LanguageDesc()}</p>
            <div class="flex flex-col gap-y-1 mt-2 px-5">
                {#each languageList as lang}
                    <label class="cursor-pointer flex gap-x-[10px] text-sm w-min">
                        <input checked={isCheckboxChecked(lang)} id="languageOption_{lang}" type="checkbox" on:change={(event) => toggleCheckbox(event, lang)} />
                        {getFullLanguageText(lang)}
                    </label>
                {/each}
            </div>
        </div>
        <button on:click={validateLanguages} class="font-semibold mx-auto lg:ml-0 lg:mr-auto py-[5px] rounded w-[200px] bg-blue-500 hover:bg-blue-600 text-white">
            {$LL.CreateReviews.Continue()}
        </button>
    {:else if page == 1}
        <div class="flex flex-col gap-y-5 text-xs text-gray-400">
            <div class="hidden lg:flex justify-center">
                <div class="w-[950px]">
                    <Steps clickable={true} size="2.3em" {steps} bind:current on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)} />
                </div>
            </div>

            {#if current == 0}
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.CreateReviews.ReviewTitleTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.CreateReviews.ReviewTitleDesc()}</p>
                    <input bind:value={review.title} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="100" name="titleReview" />
                </div>
                <div class="flex flex-col">
                    <p class="font-semibold text-base text-black">{$LL.CreateReviews.ReviewDescTitle()}</p>
                    <p class="text-xs text-gray-400">{$LL.CreateReviews.ReviewDescDesc()}</p>
                    <textarea bind:value={review.description} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="300" name="descReview" rows="4" />
                </div>
            {:else if current >= 1 && current <= 5}
                {#each review.evaluations as evaluation}
                    {#if evaluation.type === evaluationTypes[current]}
                        <div class="flex items-center justify-between">
                            <div class="flex gap-x-2">
                                <p class="font-semibold text-base text-black">{$LL.CreateReviews.ShowInLanguage()}</p>
                                <select bind:value={languageShow} class="border p-[5px] rounded border-gray-300 bg-gray-100 text-gray-900">
                                    {#each languageChoosen as lang}
                                        <option value={lang}>{getFullLanguageText(lang)}</option>
                                    {/each}
                                </select>
                            </div>
                            <button on:click={() => deleteEvaluation(evaluation.type)} class="border rounded border-gray-300 hover:bg-gray-100" title={$LL.CreateReviews.DeleteEvaluation()}>
                                <svelte:component this={XIcon} />
                            </button>
                        </div>
                        <!-- <div class="flex flex-col">
                            <p class="font-semibold text-base text-black">{$LL.CreateReviews.TotalValueTitle()}</p>
                            <p class="text-xs text-gray-400">{$LL.CreateReviews.TotalValueDesc()}</p>
                            <input bind:value={evaluation.totalValue} class="border my-1 p-2 peer rounded text-xs w-auto text-black" type="number" />
                        </div> -->
                        <div class="flex flex-col">
                            <p class="font-semibold text-base text-black">{$LL.CreateReviews.CategoryDivTitle()}</p>
                            <p class="text-xs text-gray-400">{$LL.CreateReviews.CategoryDivDesc()}</p>
                            <div class="flex gap-x-2 items-center mt-3">
                                <div class="flex h-3 rounded-lg w-40 bg-gray-300">
                                    <div class="border flex rounded-lg select-none text-transparent {accValue == 0 ? 'border-transparent': 'bg-gray-100 border-gray-300'}" style="width: {accValue}%;">percentage</div>
                                </div>
                                <svelte:component this={accValue == 100 ? CircleCheckIcon : CircleXIcon} class="w-4 h-4 {accValue == 100 ? 'text-green-500' : 'text-red-500'}" />
                                <p>{accValue}/100%</p>
                            </div>
                            <div class="flex gap-x-5 h-[200px] my-1 w-full">
                                <div class="border flex rounded w-3/4 bg-gray-100 border-gray-300">
                                    {#each review.evaluations as evaluation, index}
                                        {#if evaluation.type === evaluationTypes[current]}
                                            {#if evaluation.template.length === 0}
                                                <div class="px-4 py-2 text-sm">
                                                    <p>{$LL.CreateReviews.CategoryDivPlaceholder()}</p>
                                                </div>
                                            {:else}
                                                <section
                                                    use:dndzone={{ items: evaluation.template, flipDurationMs, dropTargetStyle: {}, type: "categoriesDndZone" }}
                                                    on:consider={(e) => handleSort(e, index)}
                                                    on:finalize={(e) => handleSort(e, index)}
                                                    class="flex flex-col gap-y-1 p-1 w-full"
                                                >
                                                    {#each evaluation.template as category (category.id)}
                                                        <div class="flex gap-x-2 group items-start pl-[10px] pr-[5px] py-[5px] lg:pl-[20px] lg:pr-[10px] lg:py-[10px] rounded w-full hover:bg-gray-200" animate:flip={{ duration: flipDurationMs }}>
                                                            {#each category.translations as translation}
                                                                {#if translation.language === languageShow}
                                                                    <div class="flex flex-col flex-grow">
                                                                        <p class="font-medium text-base text-gray-900">{category.position}. {translation.title} ({category.value}%)</p>
                                                                        <p class="hidden lg:inline text-xs text-gray-400">{translation.description}</p>
                                                                        <div class="flex flex-col flex-grow gap-y-1 mt-2 mx-5">
                                                                            {#each category.questions as question}
                                                                                <div class="flex flex-col">
                                                                                    {#each question.translations as qTranslation}
                                                                                        {#if qTranslation.language === languageShow}
                                                                                            <p class="text-sm text-gray-900">{question.position}. {qTranslation.title} {question.isRequired ? '*': ''}</p>
                                                                                            <p class="hidden lg:inline text-xs text-gray-400">{qTranslation.description}</p>
                                                                                            <span class="mx-4">{question.type === "Rating" ? '***[Resposta de classificação]***': '***[Resposta de texto]***'}</span>
                                                                                        {/if}
                                                                                    {/each}
                                                                                </div>
                                                                            {/each}
                                                                        </div>
                                                                    </div>
                                                                {/if}
                                                            {/each}
                                                            <div class="flex flex-col gap-y-2 h-full shrink-0 w-4">
                                                                <button on:click={() => openCategory(category, current)} class="group-hover:inline hidden hover:text-gray-800" title={$LL.CreateReviews.EditCategory()}>
                                                                    <svelte:component this={PencilIcon} size={16} />
                                                                </button>
                                                                <button on:click={() => deleteCategory(category.id, index)} class="group-hover:inline hidden hover:text-gray-800" title={$LL.CreateReviews.DeleteCategory()}>
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
                                <div class="border flex flex-col p-1 rounded w-1/4 bg-gray-100 border-gray-300">
                                    <p class="font-medium my-2 text-base text-center text-gray-800">Categories</p>
                                    {#each categoriesInfo as category}
                                        <button on:dblclick={() => selectCategory(category, current)} class="p-2 rounded text-left w-full hover:bg-gray-200">
                                            {#each category.translations as translation}
                                                {#if translation.language === languageShow}
                                                    <li class="mx-1 text-gray-600">{translation.title}</li>
                                                {/if}
                                            {/each}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                        <RatingGroupComponent bind:evaluation bind:ratingGroupsInfo />
                    {/if}
                {/each}
                {#if !review.evaluations.find(temp => temp.type === evaluationTypes[current])}
                    <div class="flex flex-col gap-y-2">
                        <div class="flex flex-col">
                            <span class="font-semibold text-base text-black">{$LL.CreateReviews.CreateEvaluation()}</span>
                            <span class="text-xs text-gray-400">{$LL.CreateReviews.CreateEvaluationDesc()}</span>
                        </div>
                        <button on:click={() => addEvaluation(current)} class="flex gap-x-2 items-center p-2">
                            <svelte:component this={CirclePlusIcon} />
                            <span>{$LL.CreateReviews.AddEvaluation()}</span>
                        </button>
                        <span class="font-semibold text-base text-black">{$LL.CreateReviews.CopyEvaluation()}</span>
                        <div class="flex flex-col px-2">
                            {#each review.evaluations as evaluation}
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
                    </div>
                {/if}
            {:else if current == 6}
                <EmployeesComponent bind:selectedDepartments={review.departments} bind:selectedEmployees={review.employees} />
            {:else if current == 7}
                <div class="flex flex-col gap-y-5">
                    <div class="flex flex-col">
                        <span class="font-semibold text-base text-black">{$LL.CreateReviews.ActivateReview()}</span>
                        <span class="text-xs text-gray-400">{$LL.CreateReviews.ActivateReviewDesc()}</span>
                    </div>
                    <div class="flex gap-x-2 items-center">
                        <svelte:component this={CalendarDaysIcon} size={20} />
                        <SveltyPicker bind:value={review.endDate} format="yyyy-mm-dd hh:ii" inputClasses="border p-2 rounded bg-gray-100 border-gray-300" />
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
</div>