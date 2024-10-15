<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast";
    import { FilePenIcon } from "lucide-svelte"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { Steps } from "svelte-steps"
    import { validateRatingGroup } from "../helpers/validationRatingGroup";

    export let ratingGroupId: string

    let current: number = 0
    let editRatingGroup: EditRatingGroup
    let error: string = ""
    let ratingGroup: RatingGroupData = { ratingGroupId: "", title: "", description: "", createDate: "", createByUser: "", ratingOptions: [] }
    let steps = [{ text: $LL.Steps.Details() }, { text: $LL.Steps.RatingOptions() }]

    async function getRatingGroup() {
        let response = await requestToApi("GET", `SmartEval/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            ratingGroup = response.data
        } else { error = response.error }
    }

    function checkStep(step: number) {
        let message = validateRatingGroup(ratingGroup, step)
        if (message != null && message != "") { toast.error(message); return false }
        return true
    }

    function handleStepClick(step: number, nextStep: number): number {
        if (step > nextStep) return nextStep

        for (let i = step; i < nextStep; i++) {
            let check = checkStep(i)
            if (!check) return i
        }

        return nextStep
    }

    onMount(async () => {
        getRatingGroup()
    })
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePenIcon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <h1 class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.EditRatingGroups.Title()}</h1>
            <p class="text-center md:text-left text-sm text-gray-400">{$LL.EditRatingGroups.Description()}</p>
        </div>
    </div>
    <div class="flex flex-col gap-y-5 text-xs text-gray-400">
        <div class="hidden lg:flex justify-center">
            <div class="w-[950px]">
                <Steps clickable={true} size="2.3em" {steps} bind:current on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)} />
            </div>
        </div>
    </div>
</div>