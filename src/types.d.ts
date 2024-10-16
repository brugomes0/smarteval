type AuthorizationData = { 
    moduleId: number, 
    moduleType: string, 
    windowPermissions: WindowPermissionData[] 
}

type CreateRatingGroupData = { 
    title: string, 
    description: string, 
    ratingOptions: CreateRatingOptionData[]
}

type CreateRatingOptionData = {
    numericValue: number,
    needComment: boolean,
    translations: CreateRatingOptionTranslationData[]
}

type CreateRatingOptionTranslationData = {
    language: string,
    title: string,
    description: string
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
    translations: EditRatingOptionTranslationData[]
}

type EditRatingOptionTranslationData = {
    ratingOptionTranslationId?: string,
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

type TemplateData = {
    templateId: string,
    title: string,
    description: string,
    createDate: Date
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