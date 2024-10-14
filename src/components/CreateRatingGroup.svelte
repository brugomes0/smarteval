<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { ChevronLeftIcon, ChevronRightIcon, FilePlus2Icon } from "lucide-svelte"
    import { Steps } from "svelte-steps"
    import { getFullLanguageText } from "../helpers/action";

    let current: number = 0
    let languages: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let ratingGroup: CreateRatingGroupData = { title: "", description: "", ratingOptions: [] }
    let steps = [{ text: $LL.CreateRatingGroups.Details() }, { text: $LL.CreateRatingGroups.RatingOptions() }]
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateRatingGroups.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.CreateRatingGroups.Description()}</p>
        </div>
    </div>
    <div class="flex flex-col gap-y-5 text-xs text-gray-400">
        <div class="hidden lg:flex justify-center">
            <div class="w-[950px]">
                <Steps clickable={true} size="2.3em" {steps} bind:current />
            </div>
        </div>
    </div>
    
    {#if current == 0}
        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingGroupTitleTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingGroupTitleDesc()}</p>
                <input bind:value={ratingGroup.title} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="75" name="titleRatingGroup" />
            </div>
            <div class="flex flex-col">
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingGroupDescTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingGroupDescDesc()}</p>
                <textarea bind:value={ratingGroup.description} class="border my-1 p-2 peer rounded text-xs w-auto text-black" maxlength="250" name="descRatingGroup" rows="4" />
            </div>
            <div class="flex flex-col">
                <p class="font-semibold text-base text-black">{$LL.CreateRatingGroups.RatingGroupLangTitle()}</p>
                <p class="text-xs text-gray-400">{$LL.CreateRatingGroups.RatingGroupLangDesc()}</p>
                <div class="flex flex-col px-5 py-[10px]">
                    {#each languages as language}
                        <label class="cursor-pointer flex gap-x-[10px] w-min">
                            <input id="language{language}" type="checkbox" />
                            {getFullLanguageText(language)}
                        </label>
                    {/each}
                </div>
            </div>
        </div>
    {:else if current == 1}
        <p>Current 1</p>
    {/if}

    <div class="flex justify-between">
        <button class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded hover:bg-gray-100" id="buttonGoBack">
            <svelte:component this={ChevronLeftIcon} strokeWidth={4} size={20} />
            {$LL.Steps.Return()}
        </button>
        <button class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">
            {#if current != steps.length - 1}
                {$LL.Steps.Forward()}
            {:else}
                {$LL.Steps.Finalize()}
            {/if}
            <svelte:component this={ChevronRightIcon} strokeWidth={4} size={20} />
        </button>
    </div>
</div>