<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { afterUpdate, onMount } from "svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { requestToApi } from "../helpers/api"
    import { Chart } from "chart.js"

    export let lang: string
    export let user: UserData

    let categories: CategoryInfoData[] = []
    let categoryChoosen: CategoryInfoData|undefined
    let categoryPage: number = 1
    let categorySize: number = 10
    let categoryTotal: number = 0
    let employees: InfoEmployeeData[] = []
    let employeeChoosen: InfoEmployeeData
    let loading: boolean = false

    // variables for chart
    let ctx: any, myChart: any
    let min: number = 0, max: number = 0, value: number = 0
    let labels: string[]
    let data1: any, data2: any, data3: any, data4: any = []

    async function getCategories() {
        let response = await requestToApi("GET", `SmartEval/Categories/AllCategories?page=${categoryPage}&pageSize=${categorySize}&language=${lang}`)
        if (response.statusCode == 200) {
            categories = response.data
            categoryTotal = response.totalCount
            getCompetency(categories[0].categoryId)
        }
    }

    async function getCompetency(categoryId: string) {
        if (categoryChoosen && categoryChoosen.categoryId == categoryId) return;

        let response = await requestToApi("GET", `SmartEval/Categories/${categoryId}/Competency?employeeId=${employeeChoosen.employeeId}&language=${lang}`)
        if (response.statusCode === 200) {
            categoryChoosen = categories.find(c => c.categoryId == categoryId)
            labels = response.data.reviewTitles.map((r: any) => { return r.title && r.title.trim() !== "" ? r.title : convertUtcToLocalDateShort(r.endDate, lang) })
            max = labels.length - 1
            value = max
            data1 = response.data.evaluations.find((evaluation: any) => evaluation.label == "TopDown").data
            data2 = response.data.evaluations.find((evaluation: any) => evaluation.label == "BottomUp").data
            data3 = response.data.evaluations.find((evaluation: any) => evaluation.label == "SelfEvaluation").data
            data4 = response.data.evaluations.find((evaluation: any) => evaluation.label == "TeamEvaluation").data
        }
        loading = true
        createChart()
    }

    async function getEmployeesOfSupervisor() {
        let response = await requestToApi("GET", `Employees/SubordinatesList?chefiaId=${user.employeeId}`)
        if (response.statusCode === 200) { 
            employees = response.data
            employeeChoosen = employees[0]
            console.log(employeeChoosen)
        }
    }

    function createChart() {
        ctx = document.getElementById('myChart')
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
                        callbacks: { label: function (context) { return context.dataset.label + ": " + context.raw + "%" } }
                    }
                },
                scales: {
                    x: { type: 'category', offset: true },
                    y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
                }
            }
        })
    }

    afterUpdate(() => { if (categoryChoosen && employeeChoosen) createChart() })
    onMount(async () => {
        await getEmployeesOfSupervisor()
        await getCategories()
    })
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-xl">{$LL.TeamCompetency.Title()}</span>
        <span class="hidden md:inline text-sm text-gray-400">{$LL.TeamCompetency.Description()}</span>
    </div>

    <div class="flex gap-x-[10px] items-start w-full">
        <div class="flex flex-col gap-y-[5px] w-80">
            {#each categories as category}
                <button on:click={() => getCompetency(category.categoryId)} class="border px-2 py-1 rounded shadow text-left text-sm border-gray-300 {categoryChoosen == category ? 'bg-gray-200' : 'hover:bg-gray-100'}">
                    {category.title}
                </button>
            {/each}
        </div>
        <div class="border flex flex-grow px-5 py-[10px] rounded shadow border-gray-300">
            {#if categoryChoosen && loading}
                <div class="flex flex-col flex-grow">
                    <span class="font-medium text-base">{categoryChoosen.title}</span>
                    <span class="text-xs text-gray-400">{categoryChoosen.description}</span>
                    <div class="flex flex-col h-[350px] mt-[10px] w-[600px]">
                        {#if labels.length > 1}
                            <div class="flex items-center mx-10">
                                <input bind:value class="cursor-pointer flex flex-grow" type="range" {min} {max} />
                            </div>
                        {/if}
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
            {:else}
                <div class="flex flex-col">
                    <span class="text-xs text-gray-400">{$LL.Competencies.NoCategory()}</span>
                </div>
            {/if}
        </div>
    </div>
</div>