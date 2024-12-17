<script lang="ts">
    import { convertUtcToLocalDateShort } from "../helpers/date"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { Chart } from "chart.js"
    import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-svelte"
    import LL from "../i18n/i18n-svelte"

    export let lang: string;

    let categoriesPage: number = 1;
    let categoriesSize: number = 10;
    let categoriesTotal: number = 0;
    let categories: CategoryInfoData[] = [];
    let ctx: HTMLCanvasElement;
    let data1: any = [], data2: any = [], data3: any = [], data4: any = [];
    let error: boolean = false;
    let labels: string[] = [];
    let lastCategoryObserver: IntersectionObserver;
    let max: number = 0;
    let min: number = 0;
    let myChart: Chart;
    let observer: IntersectionObserver;
    let selectedCategory: CategoryInfoData = { categoryId: "", title: "", description: "" };
    let value: number = 0;

    async function initializeObserver() {
        await loadCategories();

        const catElements = document.querySelectorAll(".category");
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("show", entry.isIntersecting);
            });
        });

        lastCategoryObserver = new IntersectionObserver(
            async (entries) => {
                const lastCategory = entries[0];
                if (!lastCategory.isIntersecting) return;

                categoriesPage++;
                await loadCategories();

                if (categories.length == categoriesTotal) {
                    lastCategoryObserver.disconnect();
                } else {
                    lastCategoryObserver.unobserve(lastCategory.target);
                    lastCategoryObserver.observe(
                        document.querySelector(".category:last-child")!,
                    );
                }
            },
            {
                rootMargin: "100px",
            },
        );

        lastCategoryObserver.observe(
            document.querySelector(".category:last-child")!,
        );

        catElements.forEach((cat) => {
            observer.observe(cat);
        });
    }

    async function loadCategories() {
        const response = await requestToApi(
            "GET",
            `SmartEval/Categories/AllCategories?page=${categoriesPage}&pageSize=${categoriesSize}&language=${lang}`,
        );
        if (response.statusCode === 200) {
            categories = [...categories, ...response.data];
            categoriesTotal = response.totalCount;

            setTimeout(() => {
                const cardElements = document.querySelectorAll(".category");
                cardElements.forEach((card) => observer.observe(card));
            });
        } else {
            error = true;
        }
    }

    async function loadChartData(category: CategoryInfoData) {
        if (!category) return;

        const response = await requestToApi(
            "GET",
            `SmartEval/Categories/${category.categoryId}/Competency?language=${lang}`,
        );
        if (response.statusCode === 200) {
            labels = response.data.reviewTitles.map((r: any) => {
                return r.title && r.title.trim() !== ""
                    ? r.title
                    : convertUtcToLocalDateShort(r.endDate, lang);
            });
            max = labels.length - 1;
            value = max;
            data1 = response.data.evaluations.find(
                (evaluation: any) => evaluation.label == "TopDown",
            ).data;
            data2 = response.data.evaluations.find(
                (evaluation: any) => evaluation.label == "BottomUp",
            ).data;
            data3 = response.data.evaluations.find(
                (evaluation: any) => evaluation.label == "SelfEvaluation",
            ).data;
            data4 = response.data.evaluations.find(
                (evaluation: any) => evaluation.label == "TeamEvaluation",
            ).data;

            renderChart();
        }
    }

    function handleValueChart(action: string) {
        if (action == "Back" && value != min) value--;
        else if (action == "Next" && value != max) value++;
        else return;

        renderChart();
    }

    function renderChart() {
        if (!ctx) return;
        if (myChart) { myChart.destroy() }

        myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: value == min ? labels : labels.slice(value),
                datasets: [
                    {
                        label: "TopDown",
                        data: value == min ? data1 : data1.slice(value),
                    },
                    {
                        label: "BottomUp",
                        data: value == min ? data2 : data2.slice(value),
                    },
                    {
                        label: "SelfEvaluation",
                        data: value == min ? data3 : data3.slice(value),
                    },
                    {
                        label: "TeamEvaluation",
                        data: value == min ? data4 : data4.slice(value),
                    },
                ],
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return (context.dataset.label + ": " + context.raw + "%")
                            },
                        },
                    },
                },
                scales: {
                    x: { type: "category", offset: true },
                    y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } },
                },
            },
        });
    }

    onMount(() => {
        initializeObserver();
        return () => {
            if (observer) observer.disconnect();
            if (lastCategoryObserver) lastCategoryObserver.disconnect();
        };
    });
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-xl">{$LL.Competencies.Title()}</span>
        <span class="hidden md:inline text-sm text-gray-400">{$LL.Competencies.Description()}</span>
    </div>
    <div class="flex flex-col lg:flex-row gap-x-5 gap-y-5 px-5">
        <div class="categories">
            {#if categories.length > 0}
                {#each categories as category}
                    <button
                        class="category show"
                        on:click={() => {
                            if (selectedCategory != category)
                                selectedCategory = category;
                            else return;
                            loadChartData(category);
                        }}
                        class:selected={selectedCategory.categoryId ===
                            category.categoryId}
                    >
                        {category.title}
                    </button>
                {/each}
            {:else}
                <span>{$LL.App.Loading()}</span>
            {/if}
        </div>
        <div
            class="border flex flex-col flex-grow h-[420px] px-5 py-[10px] rounded border-gray-300"
        >
            {#if selectedCategory.categoryId != ""}
                <div class="flex flex-col flex-grow">
                    <span class="font-medium text-base">{selectedCategory.title}</span>
                    <span class="text-xs text-gray-400">{selectedCategory.description}</span>
                    <div class="flex flex-col mt-[10px] w-[600px]">
                        {#if labels.length > 1}
                            <div class="flex gap-x-2 items-center mx-10">
                                <button
                                    on:click={() => handleValueChart("Back")}
                                    class="text-gray-300 hover:text-gray-800"
                                >
                                    <svelte:component
                                        this={ChevronLeftCircleIcon}
                                    />
                                </button>
                                <input
                                    on:change={renderChart}
                                    bind:value
                                    {max}
                                    {min}
                                    class="cursor-pointer flex flex-grow"
                                    type="range"
                                />
                                <button
                                    on:click={() => handleValueChart("Next")}
                                    class="text-gray-300 hover:text-gray-800"
                                >
                                    <svelte:component
                                        this={ChevronRightCircleIcon}
                                    />
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

<style>
    :global(.categories) {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        row-gap: 10px;
        width: 300px;
        height: 420px;
        overflow-y: auto;
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
