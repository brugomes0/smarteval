<script lang="ts">
    import { CircleUserRoundIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-svelte"
    import LL from "../i18n/i18n-svelte"

    export let sidebar: boolean
    export let user: UserData
</script>

<div class="flex gap-x-5 items-center justify-between h-12 w-full px-2 lg:px-5 border-b border-gray-300">
    <div class="flex gap-x-3 items-center w-[100px]">
        <button on:click={() => sidebar = !sidebar} class="hidden 2xl:inline p-1 hover:bg-gray-200 rounded">
            <svelte:component this={sidebar ? PanelLeftCloseIcon : PanelLeftOpenIcon } />
        </button>
        <button on:click={() => sidebar = true} class="inline 2xl:hidden p-1 rounded hover:bg-gray-200">
            <svelte:component this={MenuIcon} />
        </button>
        <div class="hidden lg:flex gap-x-1 items-center">
            <a class="text-sm hover:underline text-gray-400" href="/">{$LL.Header.Home()}</a>
        </div>
    </div>
    <p class="font-semibold hidden 2xl:inline text-xl">SmartEval</p>
    <div class="hidden 2xl:flex"></div>
    <div class="flex gap-x-2 items-center 2xl:hidden">
        <span class="font-semibold text-sm">{user.userName}</span>
        <svelte:component this={CircleUserRoundIcon} />
    </div>
</div>