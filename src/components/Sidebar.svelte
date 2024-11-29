<script lang="ts">
    import { CircleUserRoundIcon, XIcon } from 'lucide-svelte'
    import { fly } from 'svelte/transition'
    import { Link } from 'svelte-routing'
    import LL from '../i18n/i18n-svelte'

    export let menu: any
    export let sidebar: boolean
    export let user: UserData

    // function to get name of tab and give the translated text in the lang used
    function getText(name: string) {
        const menuMapping: { [key: string]: () => string } = {
            "Categories": $LL.Menu.Categories,
            "Competencies": $LL.Menu.Competencies,
            "Home": $LL.Menu.Home,
            "Performance": $LL.Menu.Performance,
            "Permissions": $LL.Menu.Permissions,
            "Reviews": $LL.Menu.Reviews,
            "RatingGroups": $LL.Menu.RatingGroups,
            "Statistics": $LL.Menu.Statistics,
            "Submissions": $LL.Menu.Submissions,
            "TeamPerformance": $LL.Menu.TeamPerformance,
            "Templates": $LL.Menu.Templates,
        }
        return (menuMapping[name] || (() => "Error"))()
    }

    // function to force sidebar close when click in tab and width under 1535px
    function handleClick() {
        const mediaQuery = window.matchMedia('(max-width: 1535px)')
        if (mediaQuery.matches) sidebar = false
    }
</script>

<nav transition:fly={{ delay: 0, duration: 200, x: -50 }} class="flex flex-col fixed w-[250px] min-h-screen border-r border-gray-300 bg-gray-50 z-30">
    <div class="hidden 2xl:flex h-auto px-3 py-5 bg-gray-200">
        <div class="flex gap-x-2 items-center">
            <svelte:component this={CircleUserRoundIcon} class="h-14 w-14" strokeWidth={1.5} />
            <div class="flex flex-col justify-center">
                <p class="font-semibold">{$LL.Sidebar.Hello()}, </p>
                <p class="line-clamp-1 cursor-pointer">
                    {#if user && user.userName}
                        <p class="text-sm" title="{user.userName}">{user.userName}</p>
                    {:else}
                        <p class="text-sm">{$LL.Sidebar.User()}</p>
                    {/if}
                </p>
            </div>
        </div>
    </div>

    <div class="flex 2xl:hidden items-center justify-end p-2">
        <button on:click={() => sidebar = false} class="hover:bg-gray-200 rounded">
            <svelte:component this={XIcon} />
        </button>
    </div>

    <div class="flex flex-col items-center justify-center mx-5 mb-5 2xl:m-5 border-b border-gray-300">
        <p class="font-medium text-sm pb-3">{user.profileType === 'Backoffice' ? $LL.Sidebar.Backoffice() : $LL.Sidebar.Frontoffice() }</p>
    </div>

    <div class="flex flex-col">
        {#each menu as item}
            {#if item.permission}
                <Link 
                    class="flex items-center justify-between h-10 px-3 cursor-pointer hover:font-semibold hover:bg-gray-200"
                    on:click={handleClick}
                    to={item.endpoint}
                >
                    <div class="flex gap-x-2 items-center">
                        <svelte:component this={item.icon} />
                        <p>{getText(item.name)}</p>
                    </div>
                </Link>
            {/if}
        {/each}
    </div>
</nav>