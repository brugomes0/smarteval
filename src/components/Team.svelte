<script lang="ts">
    import { ActivityIcon, StarIcon } from "lucide-svelte"
    import LL from "../i18n/i18n-svelte"
    import { navigate } from "svelte-routing"

    let activeOption: number = 1

    function goToPage() {
        if (activeOption == 1) { navigate("/teamCompetencies") } 
        else if (activeOption == 2) { navigate("/teamPerformance") }
    }
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-xl">{$LL.Team.Title()}</span>
        <span class="hidden md:inline text-sm text-gray-400">{$LL.Team.Description()}</span>
    </div>
    <div class="border flex flex-col p-1 rounded-lg bg-gray-100 border-gray-100">
        <label class="cursor-pointer flex items-center justify-between px-4 py-2 rounded-lg {activeOption == 1 ? 'bg-white' : 'bg-gray-100 hover:bg-gray-50'}">
            <div class="flex gap-x-5 items-center">
                <svelte:component this={StarIcon} size={30} />
                <div class="flex flex-col">
                    <span class="font-medium md:text-lg text-gray-800">{$LL.Menu.TeamCompetency()}</span>
                    <span class="text-xs text-gray-400">{$LL.Team.TeamCompetencyDesc()}</span>
                </div>
            </div>
            <input bind:group={activeOption} class="scale-150" type="radio" value={1} />
        </label>
        <label class="cursor-pointer flex items-center justify-between px-4 py-2 rounded-lg {activeOption == 2 ? 'bg-white' : 'bg-gray-100 hover:bg-gray-50'}">
            <div class="flex gap-x-5 items-center">
                <svelte:component this={ActivityIcon} size={30} />
                <div class="flex flex-col">
                    <span class="font-medium md:text-lg text-gray-800">{$LL.Menu.TeamPerformance()}</span>
                    <span class="text-xs text-gray-400">{$LL.Team.TeamPerformanceDesc()}</span>
                </div>
            </div>
            <input bind:group={activeOption} class="scale-150" type="radio" value={2} />
        </label>
    </div>
    <div class="flex items-center justify-center">
        <button on:click={goToPage} class="font-medium px-2 py-1 rounded text-sm md:text-base bg-blue-500 hover:bg-blue-600 text-white">{$LL.Team.Continue()}</button>
    </div>
</div>