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

type CreateTranslationData = {
    language: string,
    title: string,
    description: string
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

type RatingGroupInfoData = {
    ratingGroupId: string,
    title: string,
    description: string,
    createDate: string
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

type ReviewInfoData = {
    reviewId: string,
    title: string,
    description: string,
    status: string,
    createDate: string,
    startDate: string,
    endDate: string
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