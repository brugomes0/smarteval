<script lang="ts">
    import { ClipboardCheckIcon, ClipboardIcon, ClockIcon, ListIcon } from "lucide-svelte"
    import LL from "../i18n/i18n-svelte"
</script>

<div class="w-full box-border grid grid-cols-1 xl:grid-cols-2 gap-[10px] md:gap-[25px] xl:gap-[50px]">
    <div class="w-full box-border grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-[25px] xl:gap-[50px]">
        <div id="numbers" style="--backgroundColor: #F1C40F; --textColor: black">
            <p class="absolute left-[20px] top-[10px] font-semibold text-lg">0</p>
            <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.Templates()}</p>
            <svelte:component class="absolute right-[20px] top-[10px]" this={ListIcon} />
        </div>
        <div id="numbers" style="--backgroundColor: #EA4ABC; --textColor: black">
            <p class="absolute left-[20px] top-[10px] font-semibold text-lg">0</p>
            <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.Reviews()}</p>
            <svelte:component class="absolute right-[20px] top-[10px]" this={ClipboardIcon} />
        </div>
    </div>
    <div class="w-full box-border grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-[25px] xl:gap-[50px]">
        <div id="numbers" style="--backgroundColor: #4ADE80; --textColor: black">
            <p class="absolute left-[20px] top-[10px] font-semibold text-lg">0</p>
            <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.ActiveReviews()}</p>
            <svelte:component class="absolute right-[20px] top-[10px]" this={ClockIcon} />
        </div>
        <div id="numbers" style="--backgroundColor: #60A5FA; --textColor: black">
            <p class="absolute left-[20px] top-[10px] font-semibold text-lg">0</p>
            <p class="absolute bottom-[10px] left-[20px] font-semibold text-sm">{$LL.HomeBackoffice.CompletedReviews()}</p>
            <svelte:component class="absolute right-[20px] top-[10px]" this={ClipboardCheckIcon} />
        </div>
    </div>
</div>

<style>
    #numbers {
        background-color: var(--backgroundColor);
        border: 1px solid #000;
        border-radius: 10px;
        color: var(--textColor);
        display: inline-block;
        height: 75px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        position: relative;
    }
</style>