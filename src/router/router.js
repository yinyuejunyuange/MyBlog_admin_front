import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/components/loginPage/LoginPage.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import UserManage from "@/components/manage/userManage/UserManage.vue";
import Layout from "@/components/layout/Layout.vue";
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
            },{
                path:"announcementManage",
                name:"AnnouncementManagePage",
                component:()=>import('@/components/manage/AnnouncementTaskManage/AnnouncementManage.vue')
            },{
                path:"commentManage",
                name:"CommentManagePage",
                component:()=>import('@/components/manage/messageManage/CommentManage.vue')
            },{
                path:'replyManage',
                name:'ReplyManage',
                component:()=>import('@/components/manage/messageManage/ReplyManage.vue')
            },{
                path:'adminManage',
                name:'AdminManagePage',
                component:()=>import('@/components/manage/adminManage/AdminManage.vue')
            },{
                path:'menuManage',
                name:'MenuManage',
                component:()=>import('@/components/manage/menuManage/MenuManage.vue')
            },{
                path:'blogReportManage',
                name:'BlogReportManage',
                component:()=>import('@/components/manage/reportManage/BlogReportManage.vue')
            },{
                path:'commentReportManage',
                name:'CommentReportManage',
                component:()=>import('@/components/manage/reportManage/CommentReportManage.vue')
            },{
                path:'replyReportManage',
                name:'ReplyReportManage',
                component:()=>import('@/components/manage/reportManage/ReplyReportManage.vue')
            },{
                path:'userReportManage',
                name:'UserReportManage',
                component:()=>import('@/components/manage/reportManage/UserReportManage.vue')
            }
        ]
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
    // 检查是否需要认证并且目标路由不是登录页

    const token = localStorage.getItem('token')

    if (to.path !== '/login') {
        if (!token) {
            next('/login'); // 未认证用户重定向到登录页
        } else {
            try {
                // 发送请求验证 token
                const response = await axios.get('http://localhost:8080/admin//isValidToken', {
                    headers: {
                        token: token
                    }
                });

                if (response.data.code===200) {
                    next(); // token 有效，继续导航
                } else {
                    next('/login'); // token 无效，重定向到登录页
                }
            } catch (error) {
                console.error('Token validation error:', error);
                next('/login'); // 请求出错，重定向到登录页
            }
        }
    } else {
        next(); // 继续导航到登录页
    }

    //const isAuthentication=localStorage.getItem("token");
    // // 检查是否需要认证并且目标路由不是登录页
    // if (to.path !== '/login' && !isAuthentication) {
    //     next('/login'); // 未认证用户重定向到登录页
    // } else {
    //     next(); // 继续导航
    // }
})

export default router
