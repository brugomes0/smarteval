type AuthorizationData = {
    moduleId: number,
    moduleType: string,
    windowPermissions: WindowPermissionData[]
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

type UserData = {
    userId: number | undefined,
    employeeId: number | undefined,
    userName: string,
    userEmail: string | undefined
    profileDescription: string,
    profileType: string,
    authorizations: AuthorizationData[]
}

type WindowPermissionData = {
    windowId: number,
    windowType: string,
    permissions: PermissionData[]
}