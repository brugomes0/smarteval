<script lang="ts">
    import LL from "../i18n/i18n-svelte"
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-lg text-black">{$LL.Settings.Title()}</span>
        <span class="text-sm text-gray-400">{$LL.Settings.Description()}</span>
    </div>
</div>