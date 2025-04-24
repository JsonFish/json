export interface BasicResponse<T = any> {
  code: number
  data: T
  message: string
}
export interface MessageInfo {
  id: string
  avatar: string
  text: string
}

export interface MessageInfoList {
  messageList: MessageInfo[]
  total: number
}
