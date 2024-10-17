<script lang="ts">
	import { API_URL } from './stores/apiStore'
	import { ActivityIcon, BadgeInfoIcon, BadgeXIcon, ChartLineIcon, ClipboardIcon, HomeIcon, LayoutListIcon, ListIcon, PenSquareIcon, ShieldIcon, UsersIcon } from 'lucide-svelte'
	import { deleteCookie, getCookie, setCookie } from './helpers/cookie'
	import { Route, Router } from 'svelte-routing'
	import { loadAllLocales } from './i18n/i18n-util.sync'
	import { onMount } from 'svelte'
	import { requestToApi, requestTokens } from './helpers/api'
	import { Toaster } from 'svelte-french-toast'
	import LL, { setLocale } from './i18n/i18n-svelte'
	import type { Locales } from './i18n/i18n-types'

	// Import Components
	import Tailwind from "./components/Tailwind.svelte"
	import Header from './components/Header.svelte'
	import Sidebar from './components/Sidebar.svelte'
	import HomeBOComponent from './components/HomeBackoffice.svelte'
    import NotFoundComponent from './components/NotFound.svelte'
	import PermissionsComponent from './components/Permissions.svelte'
	import RatingGroupsComponent from './components/RatingGroups.svelte'
    import SingleRatingGroupComponent from './components/SingleRatingGroup.svelte'
	import CreateRatingGroupComponent from './components/CreateRatingGroup.svelte'
	import EditRatingGroupComponent from './components/EditRatingGroup.svelte'
	import CategoriesComponent from './components/Categories.svelte'

	export let authToken: string	// authentication token from smarttime
	export let baseUrl: string		// url of web api
	export let lang: string = "PT"	// language to use

	let loading: boolean = true
	let menuBackoffice = [
		{ name: "Home", endpoint: '/', icon: HomeIcon, permission: true },
		{ name: "Reviews", endpoint: '/reviews', icon: ClipboardIcon, permission: false },
		{ name: "Categories", endpoint: '/categories', icon: LayoutListIcon, permission: false },
		{ name: "RatingGroups", endpoint: '/ratingGroups', icon: ListIcon, permission: false },
		{ name: "Statistics", endpoint: '/statistics', icon: ChartLineIcon, permission: false },
		{ name: "Permissions", endpoint: '/permissions', icon: ShieldIcon, permission: false }
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
			deleteCookie('se_at')
			deleteCookie('se_rt')
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

				const module = user.authorizations.find(temp => temp.moduleType === 'SmartEval')
				const windowPermission = module?.windowPermissions.find(temp => temp.windowType === item.name)
				const permission = windowPermission?.permissions.find(temp => temp.permissionType === 'Read')
				if (permission?.hasPermission) item.permission = true
			})
		}

		// change loading after all process, to show page in dom
		loading = false
	})

	loadAllLocales()
	setLocale(lang.toLowerCase().slice(0, 2) as Locales)
</script>

<Tailwind />
<Toaster />

{#if loading}
	<div class="flex flex-col items-center justify-center min-h-screen">
		<p>{$LL.App.Loading()}...</p>
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
							<Route path="/categories" component={CategoriesComponent} {user} />
							<Route path="/ratingGroups" component={RatingGroupsComponent} {user} />
							<Route path="/ratingGroups/createRatingGroup" component={CreateRatingGroupComponent} />
							<Route path="/ratingGroups/:ratingGroupId" component={SingleRatingGroupComponent} {user} {lang} />
							<Route path="/ratingGroups/:ratingGroupId/edit" component={EditRatingGroupComponent} />
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
				<p class="font-semibold text-center">{$LL.App.NoUserProfileType()}</p>
				<p class="font-light text-center text-sm text-gray-400">{$LL.App.NoUserProfileTypeDesc()}</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-y-5 items-center justify-center min-h-screen">
			<svelte:component this={BadgeXIcon} class="w-[60px] h-[60px] text-black" strokeWidth={1.5} />
			<div class="flex flex-col gap-y-2 items-center justify-center max-w-80">
				<p class="font-semibold text-center">{$LL.App.NoLogin()}</p>
				<p class="font-light text-center text-sm text-gray-400">{$LL.App.NoLoginDesc()}</p>
			</div>
		</div>
	{/if}
{/if}