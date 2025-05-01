import { createApp } from 'vue'
// 引入elementplus
import ElementPlus from 'element-plus'
import './assets/css/iconFont/iconfont.css'
import 'element-plus/dist/index.css'
// 引入element-plus的暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from '@/index'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目全局组件
import gloablComponent from '@/components'
// 引入状态管理
import pinia from './store'
// 引入路由
import router from '@/router'
import 'md-editor-v3/lib/style.css'
// 引入模板的全局的样式
import '@/styles/index.scss'

// 获取应用实例对象
const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.use(gloablComponent)
app.use(router)
// 挂载
app.mount('#app')
