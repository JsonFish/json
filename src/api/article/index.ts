import request from '@/utils/request'
import type { BasicResponse, ArticleInfo, ArticleList } from './type'
enum API {
  Article = '/article',
}
export const getArticleList = (page: number, pageSize: number) => {
  return request.get<any, BasicResponse<ArticleList>>(
    API.Article + `?page=${page}&pageSize=${pageSize}`,
  )
}
export const getArticleInfo = (id: number) => {
  return request.get<any, BasicResponse<ArticleInfo>>(API.Article + `?id=${id}`)
}
