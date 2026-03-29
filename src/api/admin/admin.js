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


/**
 * 博客管理 -- 分页获取管理员列表
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const adminPage = async (userName,startDate, endDate ,isUserFreeze, currentPage, pageSize) => {
    return await request.get('/admin/adminPage',{
        params: {
            userName: userName,
            startDate: startDate,
            endDate: endDate,
            isUserFreeze: isUserFreeze,
            currentPage: currentPage,
            pageSize: pageSize
        }
    })
}

/**
 * 博客管理 -- 解冻
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const unFreezeAdmin = async (userId) => {
    return await request.put('/admin/unFreezeAdmin',null,{
        params: {
            userId: userId
        }
    })
}

/**
 * 博客管理 -- 冻结
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const freezeAdmin = async (userId) => {
    return await request.put('/admin/freezeAdmin',null,{
        params: {
            userId: userId
        }
    })
}

/**
 * 新增管理员
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addAdmin = async (data) => {
    return await request.post('/auth/registerAdmin',data)
}

/**
 * 上传图片
 *
 * @param file
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const uploadBlogImage = async(file) => {
    return await request.post('/blog/uploadImg',file,{
        headers: {
            'Content-Type': 'multipart/form-data' // 显式指定，确保后端能解析
        }
    })
}



