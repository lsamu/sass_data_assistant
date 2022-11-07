import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: "/speed", },
    {
        name: "layout",
        path: '/layout',
        component: () => import("/src/layout/index.vue"),
        children: [
            {
                name: "speed",
                path: '/speed',
                component: () => import("/src/views/speed/index.vue"),
            },
            {
                name: "game",
                path: '/game',
                component: () => import("/src/views/game/index.vue"),
            },
            {
                name: "recharge",
                path: '/recharge',
                component: () => import("/src/views/recharge/index.vue"),
            }
        ]
    }
] as any

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(function () {

})

export default router
