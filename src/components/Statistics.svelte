<script lang="ts">
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"

    let error: string = ""
    let loaded: boolean = false
    let page: number = 1
    let pageSize: number = 10
    let reviews: any = []

    // get reviews completed
    async function getStatistics() {
        let response = await requestToApi("GET", `SmartEval/Reviews?page=${page}&pageSize=${pageSize}&status=Completed`)
        if (response.statusCode === 200) {
            reviews = response.data
        } else { error = response.error }
        loaded = true
    }

    onMount(async () => { getStatistics() })
</script>

{#if loaded && reviews.length > 0}
    <div class="flex flex-col gap-y-5">
        {#each reviews as review}
            <span>{review.title}</span>
        {/each}
    </div>
{:else if loaded}
    <span>{$LL.Statistics.NoReviews()}</span>
{/if}