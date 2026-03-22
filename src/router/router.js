import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/view/LoginPage/index.vue";
import Layout from '@/layout/common/index.vue'

import axios from "axios";


const routes = [
    {
        path:"/login",
        name:'LoginPage',
        component:LoginPage,
    },
    {
        path:"/",
        name:'Layout',
        component: Layout,
        redirect:'/dashboard',
        children:[
            {
                path:"/dashboard",
                name:'Dashboard',
                component: () => import('@/view/DataDashboard/index.vue'),
            },
            {
                path:"/userManage",
                name:'UserManage',
                component: () => import('@/view/UserManage/index.vue'),
            },
            {
                path:"/blogManage",
                name:'BlogManage',
                component: () => import('@/view/BlogManage/index.vue'),
            },
            {
                path:"/comRepManage",
                name:'ComRepManage',
                component: () => import('@/view/ComRepManage/index.vue'),
            }
        ]

    }

]


const router = createRouter({
    history: createWebHistory(),
    routes
})

// // 添加路由守卫
// router.beforeEach(async (to, from, next) => {
//     // 检查是否需要认证并且目标路由不是登录页
//
//     const token = localStorage.getItem('token')
//
//     if (to.path !== '/login') {
//         if (!token) {
//             next('/login'); // 未认证用户重定向到登录页
//         } else {
//             try {
//                 // 发送请求验证 token
//                 const response = await axios.get('http://localhost:8080/admin//isValidToken', {
//                     headers: {
//                         token: token
//                     }
//                 });
//
//                 if (response.data.code===200) {
//                     next(); // token 有效，继续导航
//                 } else {
//                     next('/login'); // token 无效，重定向到登录页
//                 }
//             } catch (error) {
//                 console.error('Token validation error:', error);
//                 next('/login'); // 请求出错，重定向到登录页
//             }
//         }
//     } else {
//         next(); // 继续导航到登录页
//     }
//
//     //const isAuthentication=localStorage.getItem("token");
//     // // 检查是否需要认证并且目标路由不是登录页
//     // if (to.path !== '/login' && !isAuthentication) {
//     //     next('/login'); // 未认证用户重定向到登录页
//     // } else {
//     //     next(); // 继续导航
//     // }
// })

export default router
