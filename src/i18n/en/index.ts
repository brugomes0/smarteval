import type { Translation } from '../i18n-types'

const en = {
	// this is an example Translation, just rename or delete this folder if you want
    App: {
        Loading: "Loading",
        NoLogin: "No login",
        NoLoginDesc: "You need to login first before accessing this page.",
        NoUserProfileType: "No profile type",
        NoUserProfileTypeDesc: "You don't have a profile type corresponding to either frontoffice or backoffice. Try to solve this problem first before accessing this page."
    },
    Header: {        
        Home: "Home"
    },
    Menu: {
		Home: "Home",
		Performance: "Performance",
		Permissions: "Permissions",
		Reviews: "Reviews",
		Statistics: "Statistics",
		Submissions: "Submissions",
		TeamPerformance: "TeamPerformance",
		Templates: "Templates"
	},
    Permissions: {
        ChooseProfile: "Select Profile",
        ChooseProfileDesc: "Select the profile for which you want to change the permissions.",
        Loading: "Loading",
        PermissionType: {
            Create: "Create",
            Delete: "Delete",
            Patch: "Patch",
            Read: "Access",
            Update: "Update"
        },
        PermissionsSave: "Profile permissions saved successfully",
        PermissionsSaveError: "An error occurred while trying to save the profile permissions",
        Save: "Save"
    },
    Sidebar: {
        Backoffice: "Backoffice Menu",
        Frontoffice: "Frontoffice Menu",
        Hello: "Hello",
        User: "User"
    }
} satisfies Translation

export default en