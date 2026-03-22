/**
 * 配置同一的请求地址
 */
import axios from 'axios'

const request = axios.create({
    // 基础地址
    baseURL:import.meta.env.VITE_API_BASE_URL,
    // 超时时间
    timeout: 30000,
})

// ===================== 核心：添加请求拦截器 =====================
request.interceptors.request.use(
    // 请求发送前的处理逻辑
    (config) => {
        // 1. 从localStorage中获取token
        const token = localStorage.getItem('token')
        // 2. 如果token存在，添加到请求头X-Token中
        if (token && token!=='undefined' ) {
            console.log('token', token)
            config.headers['X-Token'] = token
        }
        // 3. 返回修改后的配置（必须返回，否则请求会中断）
        return config
    },
    // 请求出错时的处理逻辑
    (error) => {
        console.error('请求拦截器异常：', error)
        return Promise.reject(error)
    }
)

// 可选：添加响应拦截器（统一处理响应/错误，非必需但建议保留）
request.interceptors.response.use(
    // 响应成功的处理（只返回data，简化业务代码）
    (response) => {
        const {data} = response
        if(data.code === 401){
            localStorage.clear()
        }
        return response  // 将响应全部放回
    },
    // 响应失败的处理
    (error) => {
        console.error('请求失败：', error)
        // 扩展： todo 当用户token失效时跳转重新登录
        return Promise.reject(error)
    }
)

export default request