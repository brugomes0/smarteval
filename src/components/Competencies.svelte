<script lang="ts">
    import toast from "svelte-french-toast"
    import LL from "../i18n/i18n-svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { fly } from "svelte/transition"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { Chart } from "chart.js"
    import { ChevronLeftCircleIcon, ChevronLeftIcon, ChevronLeftSquareIcon, ChevronRightCircleIcon, ChevronRightSquareIcon, SearchIcon } from "lucide-svelte"

    export let lang: string

    let categoriesPage: number = 1
    let categoriesSize: number = 10
    let categoriesTotal: number = 0
    let categories: CategoryInfoData[] = []
    let ctx: HTMLCanvasElement
    let data1: any = [], data2: any = [], data3: any = [], data4: any = []
    let employees: InfoEmployeeData[] = []
    let employeesInput: string = ""
    let employeesPage: number = 1
    let employeesSize: number = 10
    let employeesTotal: number = 0
    let firstElement: number = 0
    let labels: string[] = []
    let lastCategoryObserver: IntersectionObserver
    let lastElement: number = 0
    let loading: boolean = true
    let max: number = 0
    let min: number = 0
    let myChart: Chart
    let observer: IntersectionObserver
    let page: number = 1
    let selectedCategory: CategoryInfoData = { categoryId: "", title: "", description: "" }
    let selectedEmployee: InfoEmployeeData = { employeeId: 0, employeeName: "", departmentName: "" }
    let timeoutId: any
    let value: number = 0

    async function initializeObserver() {
        await loadCategories()

        const cardElements = document.querySelectorAll('.category')
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("show", entry.isIntersecting)
            })
        })

        lastCategoryObserver = new IntersectionObserver(async (entries) => {
            const lastCategory = entries[0]
            if (!lastCategory.isIntersecting) return

            if (categories.length == categoriesTotal) {
                lastCategoryObserver.disconnect()
            } else {
                categoriesPage++
                await loadCategories()

                lastCategoryObserver.unobserve(lastCategory.target)
                lastCategoryObserver.observe(document.querySelector('.category:last-child')!)
            }
        }, { rootMargin: '100px' })

        lastCategoryObserver.observe(document.querySelector('.category:last-child')!)
        cardElements.forEach((card) => observer.observe(card))
    }

    async function loadChartData(category: CategoryInfoData) {
        if (!category) return

        const response = await requestToApi("GET", `SmartEval/Categories/${category.categoryId}/Competency?employeeId=${selectedEmployee.employeeId}&language=${lang}`)
        if (response.statusCode === 200) {
            labels = response.data.reviewTitles.map((r: any) => {
                return r.title && r.title.trim() !== "" ? r.title : convertUtcToLocalDateShort(r.endDate, lang)
            })
            max = labels.length - 1
            value = max
            data1 = response.data.evaluations.find((evaluation: any) => evaluation.label == "TopDown").data
            data2 = response.data.evaluations.find((evaluation: any) => evaluation.label == "BottomUp").data
            data3 = response.data.evaluations.find((evaluation: any) => evaluation.label == "SelfEvaluation").data
            data4 = response.data.evaluations.find((evaluation: any) => evaluation.label == "TeamEvaluation").data

            renderChart()
        }
    }

    async function loadCategories() {
        const response = await requestToApi("GET", `SmartEval/Categories/AllCategories?page=${categoriesPage}&pageSize=${categoriesSize}&language=${lang}&employeeId=${selectedEmployee.employeeId}`)
        if (response.statusCode === 200) {
            categories = [...categories, ...response.data]
            categoriesTotal = response.totalCount

            setTimeout(() => {
                const cardElements = document.querySelectorAll(".category")
                cardElements.forEach((card) => observer.observe(card))
            })
        }
    }

    async function loadEmployees() {
        const response = await requestToApi("GET", `Employees?page=${employeesPage}&pageSize=${employeesSize}&name=${employeesInput}`)
        if (response.statusCode === 200) {
            employees = response.data
            employeesTotal = response.totalCount
            loading = false
        }
    }

    function changeEmployeePage(action: string) {
        if (action == 'decrement' && employeesPage > 1) {
            loading = true, employees = []
            employeesPage--
        } else if (action == 'increment' && lastElement != employeesTotal) {
            loading = true, employees = []
            employeesPage++
        } else return

        debounce(loadEmployees, 500)
    }

    function changePage(action: string) {
        if (action == "back") {
            selectedCategory = { categoryId: "", title: "", description: "" }
            categories = []
            employeesPage = 1
            loadEmployees()
            page--
            if (observer) observer.disconnect()
            if (lastCategoryObserver) lastCategoryObserver.disconnect()
        } else if (action == "next" && selectedEmployee.employeeId != 0) {
            page++
            initializeObserver()
        } else if (action == "next") {
            toast.error($LL.Competencies.NoEmployeeChoosed())
        }
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function handleInputChanges() {
        loading = true, employees = [], employeesTotal = 0
        debounce(loadEmployees, 1000)
    }

    function handleValueChart(action: string) {
        if (action == "Back" && value != min) value--
        else if (action == "Next" && value != max) value++
        else return
        
        renderChart()
    }

    function renderChart() {
        if (!ctx) return
        if (myChart) myChart.destroy()

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: value == min ? labels : labels.slice(value),
                datasets: [
                    { label: 'TopDown', data: value == min ? data1 : data1.slice(value) },
                    { label: 'BottomUp', data: value == min ? data2 : data2.slice(value) },
                    { label: 'SelfEvaluation', data: value == min ? data3 : data3.slice(value) },
                    { label: 'TeamEvaluation', data: value == min ? data4 : data4.slice(value) }
                ]
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return (context.dataset.label + ": " + context.raw + "%")
                            }
                        }
                    }
                },
                scales: {
                    x: { type: 'category', offset: true },
                    y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
                }
            }
        })
    }

    onMount(() => loadEmployees())

    $: {
        if (page == 1) {
            firstElement = Math.min((employeesPage - 1) * employeesSize + 1, employeesTotal)
            lastElement = Math.min(employeesPage * employeesSize, employeesTotal)
        }
    }
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center md:text-left text-xl">{$LL.Competencies.Title()}</span>
        <span class="hidden md:inline text-sm text-gray-400">{$LL.Competencies.DescriptionBO()}</span>
    </div>

    {#if page == 1}
        <div in:fly={{ delay: 200, duration: 200, x: -50 }} class="flex flex-col gap-y-2">
            <span class="text-base text-gray-800">{$LL.Competencies.ChooseEmployee()}</span>
            <div class="flex flex-col gap-y-1">
                <div class="flex relative">
                    <input
                        bind:value={employeesInput}
                        on:input={() => { employeesPage = 1; handleInputChanges() }}
                        class="border pl-10 pr-5 py-2 rounded-lg text-sm w-full border-gray-200 bg-gray-100"
                        placeholder={$LL.Competencies.InputText()}
                        type="text"
                    />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svelte:component this={SearchIcon} size={16} />
                    </div>
                </div>
                {#if loading}
                    <div class="px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="4" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.5s" dur="1.5s" values="3;.2;3"/></circle><circle cx="12" cy="12" r="3" fill="currentColor"><animate attributeName="r" begin="svgSpinners3DotsScale0.end-1.2s" dur="1.5s" values="3;.2;3"/></circle><circle cx="20" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.9s" dur="1.5s" values="3;.2;3"/></circle></svg>
                    </div>
                {:else}
                    <div class="flex flex-col flex-shrink-0 overflow-y-auto">
                        {#each employees as employee}
                            <label class="border-b cursor-pointer flex gap-x-2 px-4 py-2 border-gray-300 hover:bg-gray-100 text-gray-800">
                                <input bind:group={selectedEmployee} type="radio" value={employee} />
                                <span class="text-sm text-gray-800">{employee.employeeName}</span>
                            </label>
                        {/each}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">{$LL.Competencies.ShowingItemsLabel({ firstElement, pageSize: lastElement, total: employeesTotal })}</span>
                        <div class="flex gap-x-2 items-center">
                            <button on:click={() => changeEmployeePage("decrement")} class="text-gray-500 hover:text-gray-800">
                                <svelte:component this={ChevronLeftSquareIcon} />
                            </button>
                            <button on:click={() => changeEmployeePage("increment")} class="text-gray-500 hover:text-gray-800">
                                <svelte:component this={ChevronRightSquareIcon} />
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
            <button on:click={() => changePage("next")} class="font-semibold mt-5 mx-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white">{$LL.Competencies.Next()}</button>
        </div>
    {:else if page == 2}
        <div in:fly={{ delay: 200, duration: 200, x: -50 }} class="flex flex-col gap-y-5">
            <button on:click={() => changePage("back")} class="flex font-semibold gap-x-1 mr-auto pl-2 pr-4 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white">
                <svelte:component this={ChevronLeftIcon} />
                {$LL.Competencies.GoBack()}
            </button>

            <div class="flex flex-col lg:flex-row gap-5 px-5">
                <div class="categories">
                    {#if categories.length > 0}
                        {#each categories as category}
                            <button
                                class="category show"
                                on:click={() => {
                                    if (selectedCategory != category) selectedCategory = category
                                    else return
                                    loadChartData(category)
                                }}
                                class:selected={selectedCategory.categoryId == category.categoryId}
                            >
                                {category.title}
                            </button>
                        {/each}
                    {/if}
                </div>
                <div class="border flex flex-col flex-grow h-[420px] px-5 py-[10px] rounded border-gray-300">
                    {#if selectedCategory.categoryId != ""}
                        <div class="flex flex-col flex-grow">
                            <span class="font-medium text-base">{selectedCategory.title}</span>
                            <span class="text-xs text-gray-400">{selectedCategory.description}</span>
                            <div class="flex flex-col mt-[10px] w-[600px]">
                                {#if labels.length > 1}
                                    <div class="flex gap-x-2 items-center mx-10">
                                        <button on:click={() => handleValueChart("Back")} class="text-gray-300 hover:text-gray-800">
                                            <svelte:component this={ChevronLeftCircleIcon} />
                                        </button>
                                        <input on:change={renderChart} bind:value {max} {min} class="cursor-pointer flex flex-grow" type="range" />
                                        <button on:click={() => handleValueChart("Next")} class="text-gray-300 hover:text-gray-800">
                                            <svelte:component this={ChevronRightCircleIcon} />
                                        </button>
                                    </div>
                                {/if}
                                <canvas bind:this={ctx}></canvas>
                            </div>
                        </div>
                    {:else}
                        <span class="font-medium text-sm text-gray-800">{$LL.Competencies.NoCategory()}</span>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(.categories) {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 420px;
        overflow-y: auto;
        row-gap: 10px;
        width: 300px;
    }
    :global(.category) {
        align-items: center;
        border: 1px solid #d1d5db;
        border-radius: 5px;
        column-gap: 5px;
        cursor: pointer;
        display: flex;
        font-size: 0.875rem;
        margin-right: 5px;
        padding: 10px 16px;
        opacity: 0;
        text-align: left;
        transition: opacity 0.3s ease-in-out;
    }
    :global(.category:hover) {
        background-color: #f9fafb;
    }
    :global(.category.show) {
        opacity: 1;
    }
    :global(.category.selected) {
        background-color: #e5e7eb;
    }
</style>