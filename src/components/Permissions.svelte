<script lang="ts">
    import { navigate } from 'svelte-routing'
    import { onMount } from 'svelte'
    import { requestToApi } from '../helpers/api'
    import LL from '../i18n/i18n-svelte'
    import toast from 'svelte-french-toast'
    
    export let user: UserData

    let buttonDisabled: boolean = false
    let error: string = ""
    let loading: boolean = true
    let permissionSave: boolean = false
    let profileChooseId: number = 0
    let profilePermissions: WindowPermissionData[] = []
    let profiles: ProfileData[] = []

    // request to api of permission from profile in parameter :id
    async function getPermissionOfProfile(id: number) {
        let response = await requestToApi("GET", `Admin/${id}/Permissions?module=SmartEval`)
        if (response.statusCode === 200 && response.data.length > 0) {
            profilePermissions = response.data
        } else {
            error = "Couldn't get permissions"
        }
    }

    // request to api all profiles
    async function getProfiles() {
        let response = await requestToApi("GET", "Profiles")
        if (response.statusCode === 200) profiles = response.data
        if (profiles.length > 0) {
            profileChooseId = profiles[0].idperfil
        } else {
            error = "Couldn't get any profile"
        }
        loading = false
    }

    // send a post request to api to save changes in profile permissions
    async function saveSettings() {
        buttonDisabled = true
        let permissionsGranted: number[] = []
        if (profilePermissions.length !== 0) {
            profilePermissions.forEach(window => {
                window.permissions.forEach(permission => {
                    if (permission.hasPermission) permissionsGranted = [...permissionsGranted, permission.permissionId]
                })
            })
        }

        let response = await requestToApi("POST", `Admin/${profileChooseId}/Permissions?module=SmartEval`, permissionsGranted)
        if (response.statusCode === 200) {
            toast.success($LL.Permissions.PermissionsSave())
            //navigate('/')
            setTimeout(() => {window.location.href = '/'}, 2000)
        } else {
            toast.error($LL.Permissions.PermissionsSaveError())
            buttonDisabled = false
        }
    }

    function getText(name: string) {
        const mapping: { [key: string]: () => string } = {
            "AdminSettings": $LL.Menu.Permissions,
            "Forms": $LL.Menu.Templates,
            "Reviews": $LL.Menu.Reviews,
            "Statistics": $LL.Menu.Statistics,
            "Create": $LL.Permissions.PermissionType.Create,
            "Delete": $LL.Permissions.PermissionType.Delete,
            "Patch": $LL.Permissions.PermissionType.Patch,
            "Read": $LL.Permissions.PermissionType.Read,
            "Update": $LL.Permissions.PermissionType.Update
        }
        return (mapping[name] ? mapping[name]() : "Error")
    }

    onMount(async () => {
        // get if user have permission to save changes of profile permissions
        const module = user.authorizations.find(temp => temp.moduleType === 'SmartEval')
        const windowPermission = module?.windowPermissions.find(temp => temp.windowType === 'AdminSettings')
        const permission = windowPermission?.permissions.find(temp => temp.permissionType === 'Create')
        if (permission?.hasPermission) permissionSave = true

        getProfiles() 
    })
</script>

{#if loading}
    <div class="flex flex-col items-center justify-center min-h-screen">
        <p>{$LL.Permissions.Loading()}...</p>
    </div>
{:else}
    <div class="flex flex-col gap-y-5">
        <div class="flex flex-col">
            <p class="text-black text-lg font-semibold">{$LL.Permissions.ChooseProfile()}</p>
            <p class="text-gray-400 text-xs">{$LL.Permissions.ChooseProfileDesc()}</p>
        </div>
        {#if profiles.length > 0}
            <select bind:value={profileChooseId} class="p-2 text-sm border border-gray-300 bg-gray-200 rounded">
                {#each profiles as profile}
                    <option value={profile.idperfil}>{profile.idperfil} - {profile.nome}</option>
                {/each}
            </select>

            <div class="flex flex-col gap-y-5">
                {#await getPermissionOfProfile(profileChooseId)}
                    <p>{$LL.Permissions.Loading()}...</p>
                {:then}
                    <div class="flex flex-col gap-y-5">
                        {#if profilePermissions.length !== 0}
                            {#each profilePermissions as wp}
                                <div class="flex flex-col gap-y-2">
                                    <li class="font-medium">{getText(wp.windowType)}</li>
                                    <div class="flex flex-col gap-y-2">
                                        {#each wp.permissions as p}
                                            <div class="flex gap-x-2 justify-between">
                                                <p>{getText(p.permissionType)}</p>
                                                <div class="flex-grow border-b-2 border-gray-300"></div>
                                                <label class="toggle">
                                                    <input id={`permission_${p.permissionId}`} type="checkbox" bind:checked={p.hasPermission} />
                                                    <span class="slider" />
                                                </label>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                            <button on:click={() => saveSettings()} class="font-semibold mx-auto mt-5 px-5 py-2 rounded text-white {permissionSave ? 'inline' : 'hidden'} {buttonDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}" disabled={buttonDisabled}>
                                {$LL.Permissions.Save()}
                            </button>
                        {:else}
                            <div class="font-semibold p-2 text-sm rounded border-2 border-red-800 bg-red-700 text-white">
                                <p>{error}</p>
                            </div>
                        {/if}
                    </div>
                {/await}
            </div>
        {:else}
            <div class="font-semibold p-2 text-sm rounded border-2 border-red-800 bg-red-700 text-white">
                <p>{error}</p>
            </div>
        {/if}
    </div>
{/if}

<style>
    .toggle {
        display: inline-block;
        height: 22px;
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