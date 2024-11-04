<!-- COMPONENT TO SELECT RATING GROUP TO A SINGLE EVALUATION OF REVIEW BEING CREATED -->
<script lang="ts">
    import LL from "../../i18n/i18n-svelte"

    export let evaluation: CreateReviewEvaluationData
    export let ratingGroupsInfo: RatingGroupInfo2Data[]
</script>

<div class="flex flex-col">
    <p class="font-semibold text-base text-black">{$LL.CreateReviews.RatingGroupDivTitle()}</p>
    <p class="text-xs text-gray-400">{$LL.CreateReviews.RatingGroupDivDesc()}</p>
    <div class="flex flex-col mt-3">
        {#each ratingGroupsInfo as ratingGroup}
            <label class="flex gap-x-3">
                <input
                    bind:group={evaluation.ratingGroupId}
                    type="radio"
                    value={ratingGroup.ratingGroupId}
                />
                <div class="flex flex-col">
                    <span class="text-sm text-black">{ratingGroup.title}</span>
                    <span>{ratingGroup.description != "" ? ratingGroup.description : "Sem descrição"}</span>
                </div>
            </label>
        {/each}
    </div>
</div>