<script lang="ts">
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    export let user: UserData

    let loading: boolean = true
    let permissionSave: boolean = false
    let settings: any[] = []

    async function loadSettings() {
        const response = await requestToApi("GET", "SmartEval/Settings")
        if (response.statusCode === 200) { settings = response.data }
        loading = false
    }

    async function saveSettings() {
        const response = await requestToApi("PUT", "SmartEval/Settings", settings)
        if (response.statusCode === 200) {
            toast.success($LL.Settings.SaveSettingsToastSuccess())
            navigate("/")
        } else {
            toast.error($LL.Settings.SaveSettingsToastError())
        }
    }

    function getTitleSetting(title: string) {
        const mappingTitle: { [key: string]: () => string } = {
            "Setting01": $LL.Settings.Setting01,
        }
        return (mappingTitle[title] || (() => $LL.Settings.NoTranslation()))()
    }

    onMount(() => {
        const module = user.authorizations.find(temp => temp.moduleType === "SmartEval")
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === "Settings")
        const permission = windowPermission?.permissions.find(temp => temp.permissionType === "Update")
        if (permission?.hasPermission) permissionSave = true

        loadSettings()
    })
</script>

<div class="flex flex-col gap-y-5">
    <div class="flex flex-col">
        <span class="font-semibold text-center lg:text-left text-lg text-black">{$LL.Settings.Title()}</span>
        <span class="text-sm text-gray-400">{$LL.Settings.Description()}</span>
    </div>

    {#if loading}
        <div class="flex flex-col px-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="4" cy="12" r="3" fill="currentColor">
                    <animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.5s" dur="1.5s" values="3;.2;3" />
                </circle>
                <circle cx="12" cy="12" r="3" fill="currentColor">
                    <animate attributeName="r" begin="svgSpinners3DotsScale0.end-1.2s" dur="1.5s" values="3;.2;3" />
                </circle>
                <circle cx="20" cy="12" r="3" fill="currentColor">
                    <animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.9s" dur="1.5s" values="3;.2;3" />
                </circle>
            </svg>
        </div>
    {:else}
        <div class="flex flex-col gap-y-2">
            {#each settings as setting}
                <div class="flex gap-x-5 items-center justify-between lg:pl-5">
                    <li class="text-sm font-medium text-black">{getTitleSetting(setting.title)}</li>
                    <div class="flex-grow border-b-2 lg:inline hidden border-gray-300"></div>
                    <label class="toggle">
                        <input bind:checked={setting.isAllowed} type="checkbox" />
                        <span class="slider" />
                    </label>
                </div>
            {/each}
        </div>
    {/if}

    {#if permissionSave}
        <button
            on:click={() => saveSettings()}
            class="flex font-semibold items-center justify-center mx-auto py-2 rounded w-[100px] bg-blue-500 hover:bg-blue-600 text-white"
        >
            {$LL.Settings.Save()}
        </button>
    {/if}
</div>

<style>
    .toggle {
        display: inline-block;
        height: 22px;
        flex-shrink: 0;
        position: relative;
        width: 40px;
    }
    .toggle input {
        display: none;
    }
    .slider {
        background-color: gray;
        border-radius: 34px;
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: .4s;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked+.slider { background-color: #3B82F6; }
    input:checked+.slider:before { transform: translateX(14px); }
</style>