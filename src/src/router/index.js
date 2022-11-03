/**
 * Created by zhanghongwei on 2022-9-13.
 * 软件：装备试验数据标准技术体制符合性检查原型系统
 * 版本号：V1.0
 * 说明：路由功能集合
 */
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 配置路由
 */
const routes = [
  { path: '/', redirect: "/demo", },
  { name: "demo", path: '/demo', component: () => import("@/views/demo/index.vue") },//登录
  { name: "code", path: '/code', component: () => import("@/components/code/code.vue") },//登录
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
/**
 * 导出路由配置
 */
export default router
