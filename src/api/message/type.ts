export interface BasicResponse<T = any> {
  code: number
  data: T
  message: string
}
export interface MessageInfo {
  id: string
  avatar: string
  text: string
  browserName: string
  browserVersion: string
  createTime: string
  email: string
  ip: string
  ipAddress: string
  osName: string
  osVersion: string
  status: number
  userId: number
  username: string
}

export interface MessageInfoList {
  messageList: MessageInfo[]
  total: number
}
