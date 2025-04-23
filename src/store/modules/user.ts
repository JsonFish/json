// 创建用户相关的仓库
import { defineStore } from 'pinia'
import { reqLogin, reqRefreshToken } from '@/api/user'
import { setToken, removeToken } from '@/utils/token'
import { LoginParmars } from '@/api/user/type'

const useUserStore = defineStore('User', {
  state: () => {
    return {
      username: '',
      avatar: '',
    }
  },
  actions: {
    async userLogin(data: LoginParmars) {
      await reqLogin(data).then((response) => {
        if (response.code == 200) {
          this.username = response.data.username
          this.avatar = response.data.avatar
          setToken(response.data)
        } else {
          return Promise.reject(new Error(response.message))
        }
      })
    },

    async handRefreshToken() {
      return new Promise<any>((resolve, reject) => {
        reqRefreshToken()
          .then((response) => {
            // 刷新成功
            if (response.code == 200) {
              // 存储token
              setToken({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
              } as any)
              resolve(response)
            } else {
              reject(response)
            }
          })
          .catch((error) => {
            throw error
          })
      })
    },

    logOut() {
      this.username = ''
      this.avatar = ''
      removeToken()
    },
  },
})

export default useUserStore
