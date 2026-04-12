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
export const updateBlogStatus = async (blogId,status,reason) => {
    return await request.put('/blog/admin/updateBlogStatus',null,{
        params: {
            blogId: blogId,
            status: status,
            reason: reason
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

/**
 * 分页查看 评论信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 * @param blogName
 * @param userName
 * @param startTime
 * @param endTime
 * @param isVisible
 * @param currentPage
 * @param pageSize
 */
export const getCommentForAdmin = async (blogName,userName,startTime, endTime, isVisible, currentPage , pageSize) => {
    return await request.get('/blog/admin/getCommentForAdmin',{
        params:{
            blogName: blogName,
            userName: userName,
            startTime: startTime,
            endTime: endTime,
            isVisible: isVisible,
            currentPage: currentPage,
            pageSize: pageSize
        }
    })
}

/**
 * 分页查看 评论信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 * @param blogName
 * @param userName
 * @param commentId
 * @param startTime
 * @param endTime
 * @param isVisible
 * @param currentPage
 * @param pageSize
 */
export const getReplyForAdmin = async (blogName,userName,commentId,startTime, endTime, isVisible, currentPage , pageSize) => {
    return await request.get('/blog/admin/getReplyForAdmin',{
        params:{
            blogName: blogName,
            userName: userName,
            commentId: commentId,
            startTime: startTime,
            endTime: endTime,
            isVisible: isVisible,
            currentPage: currentPage,
            pageSize: pageSize
        }
    })
}

/**
 * 修改评论是否可见
 */
export const updateCommentStatus = async (commentId, status) => {
    return await request.put('/blog/admin/changeCommentStatus',null,{
        params:{
            commentId: commentId,
            isVisible: status
        }
    })
}

/**
 * 修改回复是否可见
 */
export const updateReplyStatus = async (replyId, status) => {
    return await request.put('/blog/admin/changeReplyStatus',null,{
        params:{
            replyId: replyId,
            isVisible: status
        }
    })
}


/**
 * 修改评论攻击性是否可见
 */
export const updateCommentToxic = async (data) => {
    return await request.put('/blog/admin/updateCommentToxic',data)
}

/**
 * 修改评论攻击性是否可见
 */
export const updateReplyToxic = async (data) => {
    return await request.put('/blog/admin/updateReplyToxic',data)
}




