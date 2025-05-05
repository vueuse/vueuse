import { createRouter,createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router"

const routes:RouteRecordRaw[]=[
    {
        path:"/",
        name:"Home",
        component:()=>import("../App.vue"),
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router