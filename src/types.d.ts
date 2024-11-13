type AuthorizationData = { 
    moduleId: number,
    moduleType: string,
    windowPermissions: WindowPermissionData[]
}

type CategoryData = {
    categoryId: string,
    createByUser: string,
    createDate: string,
    isBeingUsed: boolean,
    questions: QuestionData[],
    translations: CategoryTranslationData[]
}

type CategoryInfoData = {
    categoryId: string,
    title: string,
    description: string
}

type CategoryInfo2Data = {
    categoryId: string,
    translations: { language: string, title: string }[]
}

type CategoryTranslationData = {
    categoryTranslationId: string,
    language: string,
    title: string,
    description: string
}

type CreateCategoryData = {
    questions: CreateQuestionData[]
    translations: CreateTranslationData[]
}

type CreateQuestionData = {
    type: string,
    translations: CreateTranslationData[]
}

type CreateRatingGroupData = { 
    title: string, 
    description: string, 
    ratingOptions: CreateRatingOptionData[]
}

type CreateRatingOptionData = {
    numericValue: number,
    needComment: boolean,
    translations: CreateTranslationData[]
}

type CreateReviewCategoryData = {
    id: number,
    categoryId: string,
    position: number,
    value: number,
    questions: CreateReviewQuestionData[]
    translations: CreateTranslationData[]
}

type CreateReviewData = {
    title: string,
    description: string,
    endDate: string | undefined,
    status: string,
    departments: number[],
    employees: number[],
    evaluations: CreateReviewEvaluationData[]
}

type CreateReviewEvaluationData = {
    type: string,
    totalValue: number,
    ratingGroupId: string,
    template: CreateReviewCategoryData[]
}

type CreateReviewQuestionData = {
    id: number,
    questionId: string,
    type: string,
    position: number,
    value: number,
    isRequired: boolean,
    translations: CreateTranslationData[]
}

type CreateSubmissionData = {
    evaluatedEmployeeId: number | null,
    evaluatorEmployeeId: number | null,
    evaluatedDepartmentId: number | null,
    evaluatorDepartmentId: number | null
}

type CreateTranslationData = {
    language: string,
    title: string,
    description: string
}

type DepartmentData = {
    departmentId: number,
    departmentDescription: string,
    departmentParentId: number,
    employees: EmployeeData[],
    totalEmployees: number | null,
    isOpen: boolean
}

type EditCategoryData = {
    questions: EditQuestionData[],
    translations: EditTranslationData[]
}

type EditQuestionData = {
    questionId?: string,
    type: string,
    translations: EditTranslationData[]
}

type EditRatingGroupData = {
    title: string,
    description: string
    ratingOptions: EditRatingOptionData[]
}

type EditRatingOptionData = {
    ratingOptionId?: string,
    numericValue: number,
    needComment: boolean,
    translations: EditTranslationData[]
}

type EditTranslationData = {
    translationId?: string,
    language: string,
    title: string,
    description: string
}

type EmployeeData = {
    employeeId: number,
    employeeName: string,
    employeeEmail: string,
    departmentId: number
}

type EvaluationData = {
    evaluationId: string,
    availableInLanguages: string[],
    ratingOptions: EvaluationRatingOptionData[],
    template: TemplateCategoryData[],
    totalValue: number,
    type: string
}

type EvaluationRatingOptionData = {
    ratingOptionId: string,
    numericValue: number,
    needComment: boolean,
    translations: { language: string, title: string, description: string }[]
}

type InfoEmployeeData = {
    employeeId: number,
    employeeName: string,
    departmentName: string
}

type PermissionData = { 
    permissionId: number, 
    permissionType: string, 
    hasPermission: boolean
}

type ProfileData = { 
    idperfil: number,
    nome: string,
    portalColaborador: int
}

type QuestionData = {
    questionId: string,
    type: string,
    translations: QuestionTranslationData[]
}

type QuestionTranslationData = {
    questionTranslationId: string,
    language: string,
    title: string,
    description: string
}

type RatingGroupData = {
    ratingGroupId: string
    title: string,
    description: string,
    createDate: string,
    createByUser: string,
    isBeingUsed: boolean,
    ratingOptions: RatingOptionData[]
}

type RatingGroupInfoData = {
    ratingGroupId: string,
    title: string,
    description: string,
    createDate: string
}

type RatingGroupInfo2Data = {
    ratingGroupId: string,
    title: string,
    description: string
}

type RatingOptionData = {
    ratingOptionId: string
    numericValue: number,
    needComment: boolean,
    translations: RatingOptionTranslationData[]
}

type RatingOptionTranslationData = {
    ratingOptionTranslationId: string,
    language: string,
    title: string,
    description: string
}

type ReviewData = {
    reviewId: string,
    title: string,
    description: string,
    createByUser: string
    createDate: string,
    startDate: string,
    endDate: string,
    status: string,
    evaluationsAvailable: string[],
    evaluations: EvaluationData[]
}

type ReviewInfoData = {
    reviewId: string,
    title: string,
    description: string,
    status: string,
    createDate: string,
    startDate: string,
    endDate: string
}

type SubmissionData = {
    submissionId: string,
    isAnswered: boolean,
    submissionDate: string,
    evaluatedEmployee: string,
    evaluatorEmployee: string,
    evaluatedDepartment: string,
    evaluatorDepartment: string
}

type SubmissionsEvaluationData = {
    evaluationId: string,
    type: string,
    submissions: SubmissionData[]
}

type SubmissionsReviewData = {
    reviewId: string,
    title: string,
    description: string,
    endDate: string,
    status: string,
    username: string,
    evaluations: SubmissionsEvaluationData[]
}

type TemplateCategoryData = {
    categoryId: string,
    position: number,
    questions: TemplateQuestionData[],
    translations: { language: string, title: string, description: string }[],
    value: number
}

type TemplateQuestionData = {
    questionId: string,
    position: number,
    isRequired: boolean,
    type: string
    translations: { language: string, title: string, description: string }[],
    value: number
}

type UserData = {
    userId: number | undefined,
    employeeId: number | undefined,
    userName: string,
    userEmail: string | undefined,
    profileDescription: string,
    profileType: string,
    authorizations: AuthorizationData[]
}

type WindowPermissionData = {
    windowId: number,
    windowType: string,
    permissions: PermissionData[]
}