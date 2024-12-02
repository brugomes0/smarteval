<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { afterUpdate } from "svelte"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"

    export let lang: string

    let categories: CategoryInfoData[] = []
    let categoryChoosen: CategoryInfoData
    let categoryPage: number = 1
    let categorySize: number = 10
    let categoryTotal: number = 0

    async function getCategories() {
        let response = await requestToApi("GET", `SmartEval/Categories/AllCategories?page=${categoryPage}&pageSize=${categorySize}&language=${lang}`)
        if (response.statusCode === 200) {
            categories = response.data
            categoryTotal = response.totalCount
        }
    }

    onMount(() => { getCategories() })
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-xl text-black">{$LL.Competencies.Title()}</span>
        <span class="hidden md:inline text-sm text-gray-400">{$LL.Competencies.Description()}</span>
    </div>

    <div class="flex items-start gap-x-[10px]">
        <div class="flex flex-col gap-y-[5px] w-80">
            {#each categories as category}
                <button on:click={() => categoryChoosen = category} class="border px-2 py-1 rounded shadow text-left text-sm border-gray-300 {categoryChoosen == category ? 'bg-gray-100' : 'hover:bg-gray-100'}">{category.title}</button>
            {/each}
        </div>
        <div class="border flex flex-grow h-80 px-5 py-[10px] rounded shadow border-gray-300">
            {#if categoryChoosen}
                <span class="font-medium text-base">{categoryChoosen.title}</span>
                <canvas id="myChart" />
            {:else}
                <span class="text-xs">No category choosen yet</span>
            {/if}
        </div>
    </div>
</div>