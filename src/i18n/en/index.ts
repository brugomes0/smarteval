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
    CreateTemplates: {
        AddRatingOption: "Add rating option",
        CategoriesAndQuestionsDesc: "Step for creating categories and questions associated with the template",
        CategoriesAndQuestionsTitle: "Create categories and questions",
        Continue: "Continue",
        DeleteRatingOption: "Delete rating option",
        Description: "This page allows the creation of questionnaire templates to be used in evaluations, thus maintaining a consistent and uniform standard across evaluations. For each template, multiple categories can be defined and questions can be added to each category.",
        NoLanguagesError: "At least one language must be associated with the template",
        NoRatingOptions: "Template doesn't have any associated rating option",
        NumericValue: "Numeric value",
        RatingOptionsDesc: "Rating options serve as response options for questions categorized as Rating type. If the survey contains Rating type questions, you must create the options you want. If there are no such questions, this step can be skipped.",
        RatingOptionsTitle: "Create rating options",
        RtoDescPlaceholder: "Insert a description",
        RtoTitlePlaceholder: "Insert a title",
        SelectedLanguage: "Selected language",
        SelectLangs: "Select languages to create the template",
        TemplateDescDesc: "Insert a description to the template",
        TemplateDescTitle: "Template description",
        TemplateTitleDesc: "Insert a title to the template",
        TemplateTitleTitle: "Template title",
        Title: "Create templates"
    },
    Header: {        
        Home: "Home"
    },
    HomeBackoffice: {
		ActiveReviews: "Active Reviews",
		CompletedReviews: "Completed Reviews",
		Reviews: "Reviews",
		Templates: "Templates"
	},
    Languages: {
        EN: "English",
        ES: "Spanish",
        FR: "French",
        PL: "Polish",
        PT: "Portuguese"
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
    },
    Steps: {
        Details: "Details",
        Categories: "Categories and questions",
        Finalize: "Finish",
        Forward: "Next",
        RatingOptions: "Rating options",
        Return: "Return"
    },
    Templates: {
        CreateTemplate: "Create template",
        Error: "Error trying to list templates",
        InputText: "Filter templates by title...",
        NoTemplates: "No templates are available at the moment. Please check back later or create a new template to get started!",
        NoTemplatesFilter: "No templates found matching your search. Try adjusting your keywords or clear the filter to see all available templates.",
        Preview: "Preview",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        Templates: "Templates",
        ToastDelete: "Template deleted successfully",
        ToastErrorDelete: "Error when removing template. Try again."
    }
} satisfies Translation

export default en