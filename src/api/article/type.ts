export interface BasicResponse<T = any> {
  code: number
  data: T
  message: string
}

export interface ArticleList {
  articleList: ArticleInfo[]
  total: number
}
export interface ArticleInfo {
  content: string
  description: string
  title: string
  createTime: string
  id: number
  isTop: number
  views: number
  status: number
  tagIds: string
  tags?: Tag[]
  updateTime?: string
}

export interface Tag {
  tagName: string
}
