import request from '@/utils/request'
import type { BasicResponse, LinkInfo, LinkList } from './type'
enum API {
  Link = '/link',
  ApplyLink = '/links',
}
export const getLink = () => {
  return request.get<any, BasicResponse<LinkList>>(
    API.Link + `?page=${1}&pageSize=${100}`,
  )
}

export const applyLink = (data: LinkInfo) => {
  return request.post<any, BasicResponse<any>>(API.ApplyLink, data)
}
