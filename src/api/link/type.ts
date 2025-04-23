export interface BasicResponse<T = any> {
  code: number
  data: T
  message: string
}
export interface LinkInfo {
  id?: number
  avatar: any
  description: string
  name: string
  link: string
}

export interface LinkList {
  linkList: LinkInfo[]
  total: number
}
