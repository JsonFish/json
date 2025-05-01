import request from '@/utils/request'

export interface BasicResponse<T = any> {
  code: number
  data: T
  message: string
}

/** 获取榜单 */
export const reqToplist = () => {
  return request.get<any, BasicResponse<any>>('/music/toplist/detail')
}

/** 获取榜单歌曲列表 */
export const reqTopDetaliList = ({
  id,
  limit,
  offset,
}: {
  id: number
  limit: number
  offset: any
}) => {
  return request.get(
    `/music/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`,
  )
}

/** 获取歌曲详情 主要是播放地址 */
export const reqMusicDetail = ({ id, level }: any) => {
  return request.get(`/music/song/url/v1?id=${id}&level=${level}`)
}

// 获取音乐的描述
export const reqMusicDescription = (id: number) => {
  return request.get(`/music/song/detail?ids=${id}`)
}

// 搜索
export const reqSearch = (keyWords: string, offset: string, limit: string) => {
  return request.get(
    `/music/search?keywords=${keyWords}&offset=${offset}&limit=${limit}`,
  )
}

// 根据歌曲id获取歌词
export const reqMusicLyricById = (id: number) => {
  return request.get(`/music/lyric?id=${id}`)
}
