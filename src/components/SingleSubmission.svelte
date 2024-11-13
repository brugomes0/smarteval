<script lang="ts">
    import { onMount } from "svelte";
    import { requestToApi } from "../helpers/api";

    export let lang: string
    export let submissionId: string

    let form: any

    async function getForm() {
        let response = await requestToApi("GET", `SmartEval/Submissions/${submissionId}/Form`)
        if (response.statusCode === 200) {
            form = response.data
        }
    }

    onMount(async () => { getForm() })
</script>

<span>{submissionId}, {lang}</span>