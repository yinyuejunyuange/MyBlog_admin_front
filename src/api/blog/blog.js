import request from "@/utils/request.js";

/**
 * 博客管理 -- 分页获取博客列表
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const blogsForAdmin = async (blogName, authorName,startDate, endDate , status, currentPage, pageSize) => {
    return await request.get('/blog/admin/getBlogListByAdmin',{
        params: {
            blogName: blogName,
            authorName: authorName,
            startDate: startDate,
            endDate: endDate,
            status: status,
            currentPage: currentPage,
            pageSize: pageSize
        }
    })
}

/**
 * 博客管理 -- 博客的12月被执行的操作
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const monthlyBehaviorTrend = async (blogId) => {
    return await request.get('/blog/admin/monthlyBehaviorTrend',{
        params: {
            blogId: blogId
        }
    })
}

/**
 * 博客管理 -- 修改博客状态
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateBlogStatus = async (blogId,status) => {
    return await request.put('/blog/admin/updateBlogStatus',null,{
        params: {
            blogId: blogId,
            status: status
        }
    })
}

/**
 * 阅读博客
 * @param blogId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const readBlog = async (blogId) => {
    return await request.get('/blog/read',{
        params:{
            id: blogId,
        }
    })
}


