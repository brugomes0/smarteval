<!-- COMPONENT TO SELECT RATING GROUP TO A SINGLE EVALUATION OF REVIEW BEING CREATED -->
<script lang="ts">
    import LL from "../../i18n/i18n-svelte"

    export let evaluation: CreateReviewEvaluationData
    export let ratingGroupsInfo: RatingGroupInfo2Data[]
</script>

<div class="flex flex-col gap-y-2">
    <div class="flex flex-col">
        <p class="font-semibold text-base text-black">{$LL.CreateReviews.RatingGroupDivTitle()}</p>
        <p class="text-xs text-gray-400">{$LL.CreateReviews.RatingGroupDivDesc()}</p>
    </div>
    <div class="flex flex-col max-h-[200px] overflow-y-auto">
        {#each ratingGroupsInfo as ratingGroup}
            <label class="flex flex-shrink-0 gap-x-3 h-10 items-center">
                <input bind:group={evaluation.ratingGroupId} class="w-5 h-5" type="radio" value={ratingGroup.ratingGroupId} />
                <div class="flex flex-col">
                    <span class="text-sm text-black">{ratingGroup.title}</span>
                    <span>{ratingGroup.description != "" ? ratingGroup.description : $LL.RatingGroups.NoDescription()}</span>
                </div>
            </label>
        {/each}
    </div>
</div>