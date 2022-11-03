import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//入口
const app = createApp(App)
app.use(store) //存储
app.use(router)//路由
app.use(createPinia())//pinia
app.use(ElementPlus,{})//框架

//注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//挂载
app.mount('#app')