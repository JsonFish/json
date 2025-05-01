// 进行axios二次封装 使用请求与响应拦截器
import axios, { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { getToken, formatToken } from '../token'
const { VITE_BASE_URL } = import.meta.env
// 利用axios对象的create方法,去创建axios实例(其他的配置:基础路径、超时的时间)
const request: AxiosInstance = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 20000, // 设置请求超时的时间 20s
  // 请求头
  headers: {
    Accept: 'application/json, text/plain, multipart/form-data, */*',
    'X-Requested-With': 'XMLHttpRequest',
  },
})
let isRefreshing: boolean = false
// 存储请求
let requests: Array<any> = []
// request 实例添加请求拦截器
request.interceptors.request.use(
  (config) => {
    if (config.url == '/auth/refresh') {
      config.headers['Authorization'] = formatToken(getToken('refresh'))
    } else {
      config.headers['Authorization'] = formatToken(getToken('access'))
    }
    if (config.url?.startsWith('/music')) {
      config.baseURL = ''
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    /// accessToken过期
    if (error.response.status === 401 && error.config.url != '/auth/refresh') {
      const config = error.config
      // 判断是否正在刷新token
      if (!isRefreshing) {
        isRefreshing = true
        return useUserStore()
          .handRefreshToken()
          .then(
            (response) => {
              const token = response.data.accessToken
              request.defaults.headers.common.Authorization = formatToken(token)
              //执行requests队列中的请求，（requests中存的不是请求参数，而是请求的Promise函数，这里直接拿来执行就好）
              requests.forEach((cb) => cb(token))
              requests = []
              return request.request(config)
            },
            (reason) => {
              isRefreshing = false
              ElMessage({ message: reason.message, type: 'info' })
            },
          )
          .catch((err) => {
            isRefreshing = false
            throw err
          })
          .finally(() => {
            isRefreshing = false
          })
      } else {
        // 如果正在刷新token，将刷新token过程中的发起的请求存储起来
        return new Promise((resolve) => {
          // 将请求放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests = [
            requests,
            (token: string) =>
              resolve(
                request.request({
                  ...error.config,
                  headers: {
                    ...(error.config.headers || {}),
                    Authorization: formatToken(token),
                  },
                }),
              ),
          ]
        })
      }
    }
    // refreshToken 过期
    else if (
      error.response.status === 401 &&
      error.config.url == '/auth/refresh'
    ) {
      isRefreshing = false
      ElMessage.error('身份过期, 请重新登录')
      useUserStore().logOut()
      return
    } else {
      isRefreshing = false
      let msg: string
      if (error.response.status) {
        switch (error.response.status) {
          case 404:
            msg = '系统维护中'
            break
          case 500:
            msg = '系统维护中'
            break
          default:
            msg = '无网络'
        }
        ElMessage({ message: msg, type: 'info', grouping: true })
      }
      error.isCancelRequest = axios.isCancel(error)
      // 所有的响应异常 区分来源为取消请求/非取消请求
      return Promise.reject(error)
    }
  },
)
export default request
