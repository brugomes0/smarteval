<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { FilePenIcon } from "lucide-svelte"

    const evaluationTypes: { [key: number]: string } = { 1: "TopDown", 2: "BottomUp", 3: "SelfEvaluation", 4: "TeamEvaluation", 5: "Interdepartamental" }

    let page: number = 0
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePenIcon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.EditReviews.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.EditReviews.Description()}</p>
        </div>
    </div>
</div>