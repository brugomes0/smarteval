<script lang="ts">
    import BarComponent from "./BarComponent.svelte"
    import LL from "../../i18n/i18n-svelte"
    import { CircleCheckIcon, CircleXIcon, DotIcon } from "lucide-svelte"

    export let actual: number
    export let total: number

    let percentage = ((actual / total) * 100).toFixed(1)
</script>

<div class="flex flex-col gap-y-2 mx-4">
    <div class="flex gap-x-2 items-center">
        <BarComponent bind:percentage />
        <svelte:component this={parseFloat(percentage) == 100 ? CircleCheckIcon : CircleXIcon} class="w-4 h-4 {parseFloat(percentage) == 100 ? 'text-green-500' : 'text-red-500'}" />
        <p>{percentage}/100.0%</p>
    </div>
    <div class="flex flex-col mx-4">
        <span class="flex gap-x-[5px]">
            <svelte:component this={DotIcon} strokeWidth={8} class="text-blue-500" />
            {$LL.SingleReview.ProgressComplete()}: {actual}
        </span> 
        <span class="flex gap-x-[5px]">
            <svelte:component this={DotIcon} strokeWidth={8} class="text-gray-300" /> 
            {$LL.SingleReview.ProgressTotal()}: {total}
        </span>
    </div>
</div>