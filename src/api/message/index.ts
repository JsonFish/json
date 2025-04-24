import request from '@/utils/request'
import type { BasicResponse, MessageInfoList } from './type'
enum API {
  Message = '/message',
}
export const getMessage = () => {
  return request.get<any, BasicResponse<MessageInfoList>>(
    API.Message + `?page=1&pageSize=100`,
  )
}
export const addMessage = (data: { text: string }) => {
  return request.post<any, BasicResponse<any>>(API.Message, data)
}
