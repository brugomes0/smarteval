import type { Translation } from "../i18n-types"

const en = {
    App: {
        Loading: "Loading",
        NoLogin: "No Login",
        NoLoginDesc: "User needs to log in before accessing the page.",
        NoUserProfileType: "User does not have a profile type.",
        NoUserProfileTypeDesc: "User does not have any associated profile type, whether frontoffice or backoffice. Please resolve this issue before accessing the page."
    },
    Categories: {
        CreateButton: "Create category",
        Description: "This page lists all categories and their respective questions, created and stored in the database. These categories are used in the creation of evaluations/sub-evaluations to build a form that users will respond to. When creating an evaluation, you can associate it with the desired categories and their respective questions.",
        Error: "Error trying to list categories",
        InputText: "Filter categories by title...",
        Loading: "Loading...",
        NoCategories: "There are no categories available at the moment. Please check back later or create a new category to get started!",
        NoCategoriesFilter: "No categories matching your search were found. Try adjusting the keywords or clear the filter to see all available categories for this language.",
        Preview: "Preview",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        Title: "Categories and Questions",
        ToastDelete: "Category removed successfully.",
        ToastDeleteError: "Error removing category. Please try again."
    },
    Competencies: {
        ChooseEmployee: "Choose an employee: ",
        Description: "Choose from the existing categories to see your progress in the various evaluations.",
        DescriptionBO: "Track the progress of an employee in each category across the various evaluations",
        GoBack: "Back",
        InputText: "Filter employees by name...",
        Next: "Continue",
        NoEmployeeChoosed: "You cannot proceed without choosing an employee",
        NoCategory: "No category selected",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        Title: "Competencies"
    },
    CreateCategory: {
        AddQuestion: "Add question",
        CategoryDescDesc: "Insert a description for the category",
        CategoryDescTitle: "Category description",
        CategoryTitleDesc: "Enter a title to identify the category",
        CategoryTitleTitle: "Category Title",
        Continue: "Continue",
        DeleteQuestion: "Delete question",
        Description: "On this page, you can create a new category along with its questions. This category can later be associated with an evaluation, so that when the user responds to the evaluation, they will answer the questions of the category.",
        LanguageDesc: "Select the languages for which you want to create the category",
        LanguageTitle: "Select language(s)",
        NoTitle: "(Untitled)",
        QuestionDesc: "Question description",
        QuestionTitle: "Question title",
        RatingQuestionsDesc: "Step to create rating questions associated with the category",
        RatingQuestionsTitle: "Create rating questions",
        ShowInLanguage: "Display in language:",
        TextQuestionsDesc: "Step to create text questions associated with the category",
        TextQuestionsTitle: "Create text questions",
        Title: "Create category and questions",
        ToastError: "Error creating category. Please try again",
        ToastSuccess: "Category created successfully",
        ValidationError: {
            CategoryTitle: "Enter a title to the category in {language}",
            NoLanguages: "Select at least one language for which the category will be created",
            NoQuestions: "The category must have at least one question",
            QuestionTitle: "Questions must have a title in all languages"
        }
    },
    CreateRatingGroups: {
        AddRatingOption: "Add rating option",
        DeleteRatingOption: "Delete rating option",
        Description: "On this page, you can create evaluation criteria. Each evaluation criterion is created with a set of rating options, which is used as a response to rating-type questions when associated with an evaluation/sub-evaluation.",
        RatingGroupDescDesc: "Enter a description for the rating group",
        RatingGroupDescTitle: "Rating group description",
        RatingGroupLangDesc: "Select the languages for which this rating group will be created",
        RatingGroupLangTitle: "Languages of rating group",
        RatingGroupTitleDesc: "Enter a title to identify the rating group",
        RatingGroupTitleTitle: "Rating group title",
        RatingOptionsDesc: "Step to create rating options associated with the rating group",
        RatingOptionsTitle: "Create rating options",
        ShowInLanguage: "Display in language:",
        SingleRatingOptionDesc: "Rating option description",
        SingleRatingOptionNeedComment: "Requires comment",
        SingleRatingOptionTitle: "Rating option title",
        Title: "Create rating group",
        ToastError: "Error creating rating group. Please try again",
        ToastSuccess: "Rating group created successfully",
        ValidationError: {
            NoLanguages: "Select at least one language for which rating group will be created",
            NoRatingOptions: "Rating group must have at least two rating options",
            RatingGroupTitle: "Enter a title for the rating group",
            RatingOptionTitle: "Enter a title for rating option in position {position} and language {language}"
        }
    },
    CreateReviews: {
        ActivateReview: "Activate review?",
        ActivateReviewDesc: "If you wish to activate the review, enter a value for the review end date. If you plan to activate the review later, leave it blank.",
        Add: "Add",
        AddEvaluation: "Add evaluation",
        AnswerRating: "Rating answer",
        AnswerText: "Text answer",
        CategoryDivDesc: "Step to associate categories and their previously created questions with the evaluation",
        CategoryDivPlaceholder: "Currently, there are no categories associated with the evaluation. Double-click on a category to associate it with the evaluation.",
        CategoryDivTitle: "Associate categories and questions",
        CategoryPercentage: "Category percentage",
        Continue: "Continue",
        CopyEvaluation: "Copy evaluation",
        CreateEvaluation: "Do you want to add this evaluation to the review?",
        CreateEvaluationDesc: "On this page, you can add and create the evaluation for this review. You can create the evaluation from scratch by clicking the create button, or you can choose to copy the properties of another evaluation created within this review. If you do not wish to create the evaluation, simply proceed.",
        DeleteCategory: "Delete category",
        DeleteEvaluation: "Delete evaluation",
        Description: "On this page, you can create a review. Each review is create with a group of evaluations. For each evaluation, you must specify the template with categories and questions to which users will respond and the rating group to be used.",
        EditCategory: "Edit category",
        LanguageDesc: "Select to which languages you want to create the category.",
        LanguageTitle: "Select the language(s)",
        Mandatory: "Required",
        Questions: "Questions",
        QuestionsOfRating: "Rating questions",
        QuestionsOfText: "Text questions",
        RatingGroupDivDesc: "Step to associate a rating group to an evaluation",
        RatingGroupDivTitle: "Associate rating group",
        ReviewDescDesc: "Enter a description to identify a review",
        ReviewDescTitle: "Review description",
        ReviewTitleDesc: "Enter a title to identify a review",
        ReviewTitleTitle: "Review title",
        Save: "Save",
        SelectEmployees: "Select employees and departments",
        SelectEmployeesText: "Select employees and departments that you want to associate to the review.",
        ShowInLanguage: "Show in language:",
        Title: "Create review",
        ToastError: "Error creating review. Try again.",
        ToastSuccess: "Review created successfully.",
        ValidationError: {
            CategoriesTotalValueNot100: "The combined percentage of the categories in the evaluation is not 100%",
            EvaluationType: "Evaluation type cannot be found",
            GetCategory: "An error occurred while trying to get category",
            NoCategories: "There are no categories in the database with the languages you want",
            NoCategoryQuestion: "Categories must have at least one question",
            NoCategoryValue: "Enter a valid value to the category",
            NoEvaluations: "Cannot create review without at least one evaluation",
            NoEvaluationTemplate: "Cannot create evaluation without at least one category and one question",
            NoEvaluationValue: "Enter a valid value to the evaluation",
            NoRatingGroups: "There are no rating groups in the database with the languages you want",
            NoSelectionLanguages: "Select at least one language for which the review will be created",
            NoSelectionRatingGroup: "Select a rating group for the evaluation",
            NoTitle: "Enter a title to the review",
            RepeatCategory: "Category already exists in the template of the evaluation"
        },
        Value: "Value"
    },
    EditCategories: {
        AddQuestion: "Add question",
        CategoryDescDesc: "Enter a description for the category",
        CategoryDescTitle: "Category description",
        CategoryTitleDesc: "Enter a title to identify the category",
        CategoryTitleTitle: "Category title",
        Continue: "Continue",
        DeleteQuestion: "Delete question",
        Description: "On this page, you can edit a category and its questions as long as it is not being used in reviews",
        LanguageDesc: "Select to which languages you want to create the category.",
        LanguageTitle: "Select the language(s)",
        NoTitle: "(Untitled)",
        QuestionDesc: "Question description",
        QuestionTitle: "Question title",
        RatingQuestionsDesc: "Step to edit rating questions associated to the category",
        RatingQuestionsTitle: "Edit rating questions",
        ShowInLanguage: "Show in language:",
        TextQuestionsDesc: "Step to edit text questions associated to the category",
        TextQuestionsTitle: "Edit text questions",
        Title: "Edit category and questions",
        ToastError: "Error editing the category. Try again",
        ToastSuccess: "Category edited successfully"
    },
    EditRatingGroups: {
        AddRatingOption: "Add rating option",
        DeleteRatingOption: "Delete rating option",
        Description: "In this page you can edit a rating group",
        IsBeingUsedAdd: "Is not possible to add a new rating option because it's already being used.",
        IsBeingUsedDelete: "Is not possible to delete rating option because it's already being used.",
        RatingGroupDescDesc: "Enter a description to the rating group",
        RatingGroupDescTitle: "Rating group description",
        RatingGroupLangDesc: "Select to which languages you want to create the rating group",
        RatingGroupLangTitle: "Languages of rating group",
        RatingGroupTitleDesc: "Insert a title to identify the rating group",
        RatingGroupTitleTitle: "Rating group title",
        RatingOptionsDesc: "Step to edit rating opitions associated to the rating group",
        RatingOptionsTitle: "Edit rating group",
        ShowInLanguage: "Show in language:",
        SingleRatingOptionDesc: "Rating option description",
        SingleRatingOptionNeedComment: "Needs comment",
        SingleRatingOptionTitle: "Rating option title",
        Title: "Edit rating group",
        ToastError: "Error when editing rating group. Try again",
        ToastSuccess: "Rating group edited successfully"
    },
    EditReviews: {
        Continue: "Continue",
        Description: "In this page, you can edit a review",
        LanguageDesc: "Select to which languages you want to create the category",
        LanguageTitle: "Select the language(s)",
        NoCategories: "There are no categories in the database with the languages you want",
        NoRatingGroups: "There are no rating group in the database with the languages you want",
        NoSelectionLanguages: "Select at least one language for which the review will be created",
        ReviewDescDesc: "Edit the description to identify the review",
        ReviewDescTitle: "Review description",
        ReviewTitleDesc: "Edit the title to identify the review.",
        ReviewTitleTitle: "Review title",
        Title: "Edit review"
    },
    EmployeesDepartments: {
        ChooseEvaluated: "Choose the employee who will be evaluated in this submission",
        ChooseEvaluatedDep: "Choose the department that will be evaluated in this submission",
        ChooseEvaluator: "Choose the employee who will be the evaluator in this submission",
        ChooseEvaluatorDep: "Choose the department that will evaluate in this submission",
        ChooseSupervisor: "Choose the supervisor who will evaluate in this submission",
        GoBack: "Back",
        Next: "Next",
        Save: "Save",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        ToastCreate: "New submission created successfully",
        ToastCreateError: "Error trying to create new submission. Try again"
    },
    EvaluationTypes: {
        BottomUp: "BottomUp",
        Departmental: "Team-evaluation",
        Interdepartmental: "Interdepartamental",
        SelfEvaluation: "Self-evaluation",
        TopDown: "TopDown"
    },
    Excel: {
        Average: "Average",
        Compilation: "Compilation",
        Scale: "Scale",
        Total: "Total"
    },
    Header: {
        Home: "Home"
    },
    HomeBackoffice: {
        ActiveReviews: "Active Reviews",
        Back: "Previous",
        Categories: "Categories",
        CompletedReviews: "Completed Reviews",
        Create: "Create",
        CreateCategory: "Create category",
        CreateRatingGroup: "Create rating group",
        CreateReview: "Create review",
        EndDate: "End date",
        ErrorActions: "Impossible to show last actions. Try again.",
        ErrorActiveReviewsList: "Impossible to show active reviews. Try again.",
        ErrorCountReviewsEachStatus: "Impossible to show the chart. Try again later",
        LastActions: "Last Actions",
        Loading: "Loading...",
        Next: "Next",
        NoActions: "No actions to show.",
        NoActiveReviews: "No active reviews in this moment.",
        RatingGroups: "Rating Groups",
        Review: "Review",
        Reviews: "Reviews",
        ShortCuts: "Short cuts",
        Templates: "Modelos"
    },
    HomeFrontoffice: {
        AvgRatingBottomUp: "Value of the last review (BottomUp)",
        AvgRatingTopDown: "Value of the last review (TopDown)",
        Dashboard: "Dashboard",
        NoSubmissions: "No submissions to do",
        Percentile: "Percentile",
        SeeAllCompetencies: "see competencies page",
        SeeAllSubmissions: "see submissions page",
        TaskList: "Task list"
    },
    Languages: {
        EN: "English",
        ES: "Spanish",
        FR: "French",
        PL: "Polish",
        PT: "Portuguese"
    },
    Menu: {
        Categories: "Categories",
        Competencies: "Competencies",
        Home: "Home",
        Performance: "Performance",
        Permissions: "Permissions",
        RatingGroups: "Rating Groups",
        Reviews: "Reviews",
        Statistics: "Statistics",
        Submissions: "Submissions",
        Team: "Team",
        TeamCompetency: "Team Competencies",
        TeamPerformance: "Team Performance",
        Templates: "Templates"
    },
    ModalEditCategory: {
        CategoryPercentageValueRequired: "Category needs a valid value to his percentage in the review",
        RequiredQuestionsNeedPercentage: "Required questions must have a valid value to his percentage in the category",
        SumQuestionsPercentage: "Sum of the percentages of the required questions must be 100%"
    },
    Performance: {
        AverageCategory: "Average category",
        CompareOtherReview: "Compare with other review",
        Description: "In this page you can see your performance in the various reviews",
        MyPerformance: "My Performance",
        Next: "Continue",
        NoReviews: "In the moment, there are no reviews about you. Try again later.",
        Scale: "Scale",
        SubmissionDetails: "Details by submission",
        Title: "Performance",
        ToastSelectReviewError: "To continue, needs to select a review",
        Total: "Total"
    },
    Permissions: {
        ChooseProfile: "Select profile",
        ChooseProfileDesc: "Select profile which you want to change permissions",
        Loading: "Loading",
        PermissionType: {
            Create: "Create",
            Delete: "Delete",
            Patch: "Alter status",
            Read: "Access",
            Update: "Edit"
        },
        PermissionsSave: "Profile permissions saved successfully",
        PermissionsSaveError: "An error occurred when saving profile permissions",
        Save: "Save"
    },
    RatingGroups: {
        CreateButton: "Create rating group",
        Description: "This page lists all the rating option groups created and stored in the database. These rating option groups are used for users to answer questions with the Rating type in reviews. You can associate an item from this page with an evaluation, where you wish to use the created rating group.",
        Error: "Error when trying to return the rating groups list",
        InputText: "Filter rating groups by title...",
        Loading: "Loading...",
        NoDescription: "No description",
        NoRatingGroups: "There are no rating groups available in the moment. Try again later or create a new rating group to start!",
        NoRatingGroupsFilter: "No rating groups matching your search were found. Try changing the status or clear the filter to see available rating groups.",
        Preview: "Preview",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        Title: "Rating Groups",
        ToastDelete: "Rating group deleted successfully.",
        ToastDeleteError: "Error when deleting a rating group. Try again."
    },
    Reviews: {
        CreateButton: "",
        Description: "",
        Error: "",
        InputText: "",
        Loading: "",
        NeedAuths: "",
        NoReviews: "",
        NoReviewsFilter: "",
        Preview: "",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        Title: "",
        ToastDelete: "",
        ToastDeleteError: ""
    },
    ReviewStatus: {
        Active: "Active",
        Canceled: "Canceled",
        Completed: "Completed",
        NotStarted: "Not Started",
        NumberReviews: "Nº of Reviews",
        SingleActive: "Active",
        SingleCanceled: "Canceled",
        SingleCompleted: "Completed",
        SingleNotStarted: "Not Started"
    },
    Sidebar: {
        Backoffice: "Backoffice Menu",
        Frontoffice: "Frontoffice Menu",
        Hello: "Hello",
        User: "User"
    },
    SingleCategories: {
        ActionsDelete: "Delete category",
        ActionsDeleteModal: "Are you sure you want to remove the category? This action cannot be reverted.",
        CreateBy: "Created by user",
        CreateDate: "Creation date",
        Description: "Description",
        Option: "Option",
        Questions: "Questions",
        QuestionsTitle: "Below are listed category questions",
        TextResponse: "Text response",
        Type: "Question type"
    },
    SingleRatingGroups: {
        ActionsDelete: "Delete rating group",
        ActionsDeleteModal: "Are you sure you want to delete the rating group? This action cannot be reverted.",
        CreateBy: "Created by user",
        CreateDate: "Creation date",
        Description: "Description",
        NeedComment: "* answer a question with this option forces user to add a comment to the answer",
        RatingOptions: "Rating Options",
        RatingOptionsDesc: "Below are the rating options listed for responding to the questions of a review/evaluation to which this rating group is associated. Click on the selection element to toggle between the available languages."
    },
    SingleReview: {
        ActionsLabel: "",
        ActionsActivate: "",
        ActionsActivateButton: "",
        ActionsActivateDesc: "",
        ActionsActivateModal: "",
        ActionsCancel: "",
        ActionsCancelButton: "",
        ActionsCancelDesc: "",
        ActionsCancelModal: "",
        ActionsComplete: "",
        ActionsCompleteButton: "",
        ActionsCompleteDesc: "",
        ActionsCompleteModal: "",
        ActionsDelete: "",
        ActionsDeleteButton: "",
        ActionsDeleteDesc: "",
        ActionsDeleteModal: "",
        ActionsEdit: "",
        ActionsEditButton: "",
        ActionsEditDesc: "",
        ActionsEditModal: "",
        ActionsExtend: "",
        ActionsExtendButton: "",
        ActionsExtendDesc: "",
        ActionsExtendModal: "",
        Confirm: "",
        CreateBy: "",
        DateCreate: "",
        DateEnd: "",
        DateStart: "",
        Description: "",
        ErrorGetEvaluation: "",
        ErrorQuestionType: "",
        FormEvaluation: "",
        Loading: "",
        NoActionsAvailable: "",
        NoDescription: "",
        Progress: "",
        ProgressComplete: "",
        ProgressTotal: "",
        ShowInLanguage: "",
        Status: "",
        Submissions: "",
        ToastChangeStatus: "",
        ToastChangeStatusError: ""
    },
    SingleSubmission: {
        EndDate: "Submit by",
        EvaluatedDepartment: "Department evaluating",
        EvaluatedEmployee: "",
        EvaluationType: "Evaluation",
        InfoSubmission: "Info about submission",
        Required: "Required",
        ReviewName: "Review name",
        SubmissionForm: "Form",
        Submit: "Submit",
        ToastNeedCommentError: "Questions with comments box visible, need to be fill",
        ToastSubmission: "Submission submitted successfully",
        ToastSubmissionError: "Error when trying to send submission."
    },
    Statistics: {
        Average: "",
        AverageByEmployee: "",
        ChooseDepartment: "",
        ChooseDepartmentDesc: "",
        ChooseEmployee: "",
        ChooseEmployeeDesc: "",
        Description: "",
        Details: "",
        ExcelFiles: "",
        Interdepartamental: "",
        Next: "",
        NoReviews: "",
        Scale: "",
        ShowingItemsLabel: "Showing {firstElement} to {lastElement} of {total} items",
        Title: "",
        ToastSelectReviewError: "",
        Total: ""
    },
    Steps: {
        Details: "Details",
        Employees: "Employees",
        Finalize: "Finalize",
        Forward: "Next",
        RatingOptions: "Rating Options",
        RatingQuestions: "Rating questions",
        Return: "Return",
        TextQuestions: "Text questions"
    },
    SubmissionModal: {
        ChooseDepartment: "Choose one department",
        ChooseEmployee: "Choose one employee",
        CreateSubmission: "Create submission",
        Date: "Date",
        Description: "Are you sure you want to delete the submission? This step is irreversible.",
        Error: "Error when trying to return submissions",
        Evaluated: "Evaluated",
        EvaluatedDep: "Evaluated Department",
        Evaluator: "Evaluator",
        EvaluatorDep: "Evaluator Department",
        Loading: "Loading...",
        NoSubmissions: "No submissions to show",
        Remove: "Delete",
        Search: "Search",
        SelectAll: "All",
        SelectNo: "Only not submitted",
        SelectYes: "Only submitted",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        Submitted: "Submitted",
        Title: "Delete submission",
        ToastCreate: "New submission created successfully",
        ToastCreateError: "An error occurred when trying to create a submission. Try again.",
        ToastDelete: "Submission deleted successfully.",
        ToastDeleteError: "An error occurred when trying to remove a submission. Try again."
    },
    Submissions: {
        AlterSubmissionDesc: "Are you sure you want to alter submission?",
        AlterSubmissionTitle: "Alter submission",
        Description: "In this section, you will find an overview of all the reviews, evaluations, and submissions you need to complete. You can view active reviews, where your participation is required to answer the questionnaire, and access the history of submissions you have made. Stay updated with the deadlines and make sure to complete your submissions on time.",
        Loading: "Loading...",
        NoReviews: "In the moment, there are no submissions to show",
        TabActive: "Active",
        TabHistory: "History",
        Title: "Submissions",
        ValidationEvaluatedDepartmentError: "Submission requires a department to be evaluated",
        ValidationEvaluatorDepartmentError: "Submission requires a department to which the employee performing the submission belongs",
        ValidationEvaluatedEmployeeError: "Submission requires an employee to be evaluated",
        ValidationEvaluatorEmployeeError: "Submission requires an employee to perform the submission"
    },
    Team: {
        Continue: "Continue",
        Description: "Your team's page. Choose from the options what you would like to view about your employees.",
        TeamCompetencyDesc: "On this page, you can view the existing categories to see your employee's progress across the various reviews.",
        TeamPerformanceDesc: "On this page, you can view your employees' performance across the various reviews.",
        Title: "Team"
    },
    TeamCompetency: {
        Description: "Choose from the existing categories to see your employee's progress across the various reviews.",
        Title: "Competencies"
    },
    TeamPerformance: {
        ChooseEmployeeTitle: "Select employee",
        ChooseEmployeeDesc: "Select an employee to show the review",
        Description: "In this page you can check the performance of your employees in the various reviews.",
        EmployeePerformance: "Employee performance",
        Next: "Continue",
        NoReviews: "In the moment, there are no review about you. Try again later.",
        ShowingItemsLabel: "Showing {firstElement} to {pageSize} of {total} items",
        SubmissionDetails: "Submission details",
        Title: "Team Performance",
        ToastSelectReviewError: "To continue you need to select a review",
        Total: "Total"
    }
} satisfies Translation

export default en