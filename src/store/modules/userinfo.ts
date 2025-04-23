// 用户信息处理相关仓库
import { defineStore } from 'pinia'
const useUserinfoStore = defineStore('Userinfo', {
  state: () => {
    return {}
  },
  // 异步/逻辑的地方
  actions: {
    async getUserinfo() {},
  },
})
// 对外暴露
export default useUserinfoStore
