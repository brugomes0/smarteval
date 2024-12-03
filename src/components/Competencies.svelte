<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { afterUpdate, onMount } from "svelte"
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { requestToApi } from "../helpers/api"
    import { Chart } from "chart.js"

    export let lang: string

    let categories: CategoryInfoData[] = []
    let categoryChoosen: CategoryInfoData
    let categoryPage: number = 1
    let categorySize: number = 10
    let categoryTotal: number = 0
    let loading: boolean = false

    // variables for chart
    let ctx: any, myChart: any
    let data: { labels: string[], datasets: { label: string, data: number[] }[] } = { labels: [], datasets: [] }
    let isDragging: boolean = false
    let circlePosition: any = undefined
    let min = 0
    let zoomRangeSlider = {
        id: 'zoomRangeSlider',
        afterDatasetDraw(chart: any, args: any, plugins: any) {
            const { ctx, chartArea: { left, top, right, width } } = chart
            circlePosition = circlePosition || right
            const angle = Math.PI

            ctx.beginPath()
            ctx.fillStyle = 'lightgrey'
            ctx.roundRect(left, 10, width, 10, 10)
            ctx.fill()

            ctx.beginPath()
            ctx.fillStyle = 'black'
            ctx.arc(circlePosition, 15, 10, 0, 360 * angle, false)
            ctx.fill()
        },
        afterUpdate(chart: any, args: any, plugins: any) {
            chart.options.scales.x.min = min
        },
        afterEvent(chart: any, args: any, plugins: any) {
            const { ctx, canvas, chartArea: { left, top, right, width } } = chart
            canvas.addEventListener('mousedown', () => { isDragging = true })
            canvas.addEventListener('mouseup', () => { isDragging = false })
            if (args.event.type == 'mouseout') { isDragging = false }
            if (args.event.type == 'mousemove' && isDragging) {
                const val = args.event.x / (width + left)
                min = val * data.labels.length - 1
                args.changed = true
                circlePosition = args.event.x < left ? left : args.event.x > right ? right : args.event.x
                chart.update()
            }
        }
    }

    async function getCategories() {
        let response = await requestToApi("GET", `SmartEval/Categories/AllCategories?page=${categoryPage}&pageSize=${categorySize}&language=${lang}`)
        if (response.statusCode === 200) {
            categories = response.data
            categoryTotal = response.totalCount
            getCompetency(categories[0].categoryId)

        }
    }

    async function getCompetency(categoryId: string) {
        if (categoryChoosen && categoryChoosen.categoryId == categoryId) return;

        let response = await requestToApi("GET", `SmartEval/Categories/${categoryId}/Competency?language=${lang}`)
        if (response.statusCode === 200) { 
            categoryChoosen = categories.find(c => c.categoryId == categoryId)!
            data.labels = response.data.reviewTitles.map((r: any) => {
                return r.title && r.title.trim() !== "" ? r.title : convertUtcToLocalDateShort(r.endDate, lang)
            })
            data.datasets = response.data.evaluations
            min = data.labels.length - 1
        }
        loading = true
        createChart()
    }

    function createChart() {
        ctx = document.getElementById('myChart')
        if (myChart) myChart.destroy()

        myChart = new Chart(ctx, {
            type: 'line',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { 
                    padding: { top: 30, right: 10 }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ": " + context.raw + "%"
                            }
                        }
                    }
                },
                scales: {
                    x: { type: 'category', offset: true },
                    y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
                }
            },
            plugins: [zoomRangeSlider]
        })
    }

    afterUpdate(() => { if (categoryChoosen) createChart() })
    onMount(() => { getCategories() })
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-xl text-black">{$LL.Competencies.Title()}</span>
        <span class="hidden md:inline text-sm text-gray-400">{$LL.Competencies.Description()}</span>
    </div>

    <div class="flex gap-x-[10px] items-start w-full">
        <div class="flex flex-col gap-y-[5px] w-80">
            {#each categories as category}
                <button on:click={() => getCompetency(category.categoryId)} class="border px-2 py-1 rounded shadow text-left text-sm border-gray-300 {categoryChoosen == category ? 'bg-gray-200' : 'hover:bg-gray-100'}">{category.title}</button>
            {/each}
        </div>
        <div class="border flex flex-grow px-5 py-[10px] rounded shadow border-gray-300">
            {#if categoryChoosen && loading}
                <div class="flex flex-col flex-grow">
                    <span class="font-medium text-base">{categoryChoosen.title}</span>
                    <span class="text-xs text-gray-400">{categoryChoosen.description}</span>
                    <div class="flex w-[600px] h-[350px]">
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