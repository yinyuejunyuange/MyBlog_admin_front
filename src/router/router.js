import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/components/loginPage/LoginPage.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import UserManage from "@/components/manage/userManage/UserManage.vue";
import Layout from "@/components/layout/Layout.vue";


const routes = [
    {
        path:"/",
        name:'Layout',
        component:Layout,
        children:[
            {
                path:'',
                name:'dashboard',
                component:()=>import('@/components/dashboard/Dashboard.vue')
            },
            {
                path:"userManage",
                name:'UserManagePage',
                component:()=>import('@/components/manage/userManage/UserManage.vue')
            },
            {
                path:"blogManger",
                name:'BlogMangerPage',
                component:()=>import('@/components/manage/blogManage/BlogManage.vue')
            },
            {
                path:"taskManage",
                name:"TaskManagePage",
                component:()=>import('@/components/manage/AnnouncementTaskManage/TaskManage.vue')
            }
        ]
    },
    {
        path:"/login",
        name:'LoginPage',
        component:LoginPage,

    },
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
    const isAuthentication=localStorage.getItem("token");

    // 检查是否需要认证并且目标路由不是登录页
    if (to.path !== '/login' && !isAuthentication) {
        next('/login'); // 未认证用户重定向到登录页
    } else {
        next(); // 继续导航
    }
})

export default router
