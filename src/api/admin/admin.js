import request from "@/utils/request.js";

/**
 * 首页数据 -- 4表单
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getDashboard = async () => {
    return await request.get('/admin/dashBoardTitle')
}
/**
 * 首页数据 -- 博客12月增长率
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const blog12Month = async () => {
    return await request.get('/blog/admin/blog12Month')
}
/**
 * 首页数据 -- 博客各个类别展示
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const blogTypeDashboard = async () => {
    return await request.get('/blog/admin/blogTypeDashboard')
}

/**
 * 首页数据 -- 用户12月增长率
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const user12Month = async () => {
    return await request.get('/admin/user12Month')
}

/**
 * 首页数据 -- 获取首页博客相关数据
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const knowledgeDashboard = async () => {
    return await request.get('/knowledgeBase/admin/knowledgeDashboard')
}


