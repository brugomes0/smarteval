<script lang="ts">
	import { API_URL } from './stores/apiStore'
	import { ActivityIcon, BadgeInfoIcon, BadgeXIcon, ChartLineIcon, ClipboardIcon, HomeIcon, LayoutDashboardIcon, PenSquareIcon, SettingsIcon, UsersIcon } from 'lucide-svelte'
	import { getCookie, setCookie } from './helpers/cookie'
	import { Link, Route, Router } from 'svelte-routing'
	import { onMount } from 'svelte'
	import { requestToApi, requestTokens } from './helpers/api'
	import { Toaster } from 'svelte-french-toast'

	// Import Components
	import Tailwind from "./components/Tailwind.svelte"
	import Header from './components/Header.svelte'
	import Sidebar from './components/Sidebar.svelte'
	import HomeBOComponent from './components/HomeBackoffice.svelte'
	import HomeFOComponent from './components/HomeFrontoffice.svelte'
    import NotFoundComponent from './components/NotFound.svelte'
	import PermissionsComponent from './components/Permissions.svelte'

	export let authToken: string	// variable with authentication token from smarttime
	export let baseUrl: string		// variable with url of web api

	let loading: boolean = true
	let menuBackoffice = [
		{ name: "Home", endpoint: '/', icon: HomeIcon, permission: true },
		{ name: "Reviews", endpoint: '/reviews', icon: ClipboardIcon, permission: false },
		{ name: "Templates", endpoint: '/templates', icon: LayoutDashboardIcon, permission: false },
		{ name: "Statistics", endpoint: '/statistics', icon: ChartLineIcon, permission: false },
		{ name: "Permissions", endpoint: '/permissions', icon: SettingsIcon, permission: false }
	]
	let menuFrontoffice = [
		{ name: "Home", endpoint: '/', icon: HomeIcon, permission: true },
		{ name: "Submissions", endpoint: '/submissions', icon: PenSquareIcon, permission: true },
		{ name: "Performance", endpoint: '/performance', icon: ActivityIcon, permission: true },
		{ name: "TeamPerformance", endpoint: '/teamPerformance', icon: UsersIcon, permission: true }
	]
	let sidebar: boolean = false
	let token: {accessToken: string, refreshToken: string} = { accessToken: '', refreshToken: '' }
	let user: UserData

	onMount(async () => {
		// update store of apiUrl with export variable
		API_URL.update((temp: any) => temp = baseUrl)

		// if authentication token is passed as export variable, request new tokens to webapi and save them in cookies
		// if not get tokens from cookies
		if (authToken) {
			authToken = encodeURIComponent(authToken)
			let response = await requestTokens(authToken)
			if (response.statusCode === 200) {
				token.accessToken = response.data.token
				token.refreshToken = response.data.refreshToken
				setCookie('se_at', token.accessToken)
				setCookie('se_rt', token.refreshToken)
			}
		} else {
			token.accessToken = getCookie('se_at') ?? ''
			token.refreshToken = getCookie('se_rt') ?? ''
		}

		// if tokens exist, request user to webapi
		if (token.accessToken !== '' && token.refreshToken !== '') {
			let responseUser = await requestToApi("GET", "Users/Me")
			if (responseUser.statusCode === 200) user = responseUser.data
		}

		// check for permissions to show sidebar tabs
		if (user && user.profileType === 'Backoffice') {
			menuBackoffice.forEach(item => {
				if (item.name == 'Home') return

				let windowAux: string = ''
				if (item.name === 'Permissions') {
					windowAux = 'AdminSettings'
				} else if (item.name === 'Templates') {
					windowAux = 'Forms'
				} else {
					windowAux = item.name
				}

				const module = user.authorizations.find(temp => temp.moduleType === 'SmartEval')
				const windowPermission = module?.windowPermissions.find(temp => temp.windowType === windowAux)
				const permission = windowPermission?.permissions.find(temp => temp.permissionType === 'Read')
				if (permission?.hasPermission) item.permission = true
			})
		}

		// change loading after all process, to show page in dom
		loading = false
	})
</script>

<Tailwind />
<Toaster />

{#if loading}
	<div class="flex flex-col items-center justify-center min-h-screen">
		<p>Loading...</p>
	</div>
{:else}
	{#if user && user.profileType === 'Backoffice'}
		<Router>
			<main class="flex min-h-screen">
				{#if sidebar}
					<div class="fixed 2xl:hidden inset-0 bg-black bg-opacity-50 z-20"></div>
					<Sidebar bind:sidebar {user} menu={menuBackoffice} />
				{/if}
				<div class="flex flex-col flex-1 items-center {sidebar ? '2xl:ml-[250px]' : ''}">
					<Header bind:sidebar />
					<div class="flex justify-center w-full">
						<div class="max-w-[1400px] w-full p-5">
							<Route path="/" component={HomeBOComponent} />
							<Route path="/permissions" component={PermissionsComponent} {user} />
							<Route component={NotFoundComponent} />
						</div>
					</div>
				</div>
			</main>
		</Router>
	{:else if user && user.profileType === 'Frontoffice'}
		<Router>
			<main class="flex min-h-screen">
				{#if sidebar}
					<div class="fixed 2xl:hidden inset-0 bg-black bg-opacity-50 z-20"></div>
					<Sidebar bind:sidebar {user} menu={menuFrontoffice} />
				{/if}
				<div class="flex flex-col flex-1 items-center {sidebar ? '2xl:ml-[250px]' : ''}">
					<Header bind:sidebar />
					<div class="flex justify-center w-full">
						<div class="max-w-[1400px] w-full p-5">
							<Route path="/" component={HomeFOComponent} />
							<Route component={NotFoundComponent} />
						</div>
					</div>
				</div>
			</main>
		</Router>
	{:else if user}
		<div class="flex flex-col gap-y-5 items-center justify-center min-h-screen">
			<svelte:component this={BadgeInfoIcon} class="w-[60px] h-[60px] text-black" strokeWidth={1.5} />
			<div class="flex flex-col gap-y-2 items-center justify-center max-w-80">
				<p class="font-semibold">User profile type missing</p>
				<p class="font-light text-center text-sm text-gray-400">You don't have a profile type corresponding to either frontoffice or backoffice. Try to solve this problem first before accessing this page.</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-y-5 items-center justify-center min-h-screen">
			<svelte:component this={BadgeXIcon} class="w-[60px] h-[60px] text-black" strokeWidth={1.5} />
			<div class="flex flex-col gap-y-2 items-center justify-center max-w-80">
				<p class="font-semibold">No login</p>
				<p class="font-light text-center text-sm text-gray-400">Need to login first before accessing this page.</p>
			</div>
		</div>
	{/if}
{/if}