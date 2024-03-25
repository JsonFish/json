export interface BasicResponse<T = any> {
    code: number
    data: T
    message: string
}
export interface LinkInfo {
    siteAvatar: string
    siteDesc: string
    siteName: string
    siteUrl: string
}