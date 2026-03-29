import request from "@/utils/request.js";

/**
 * 博客管理 -- 分页获取用户列表
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const usersForAdmin = async (userName,startDate, endDate ,isUserFreeze, currentPage, pageSize) => {
    return await request.get('/admin/userPage',{
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
 * 博客管理 -- 获取用户详情
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getUserDetail = async (userId) => {
    return await request.get('/admin/userDetail',{
        params: {
            userId: userId
        }
    })
}

/**
 * 博客管理 -- 冻结用户
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const freezeUser = async (userId) => {
    return await request.put('/admin/freezeUser',null,{
        params: {
            userId: userId
        }
    })
}

/**
 * 博客管理 -- 解冻用户
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const unFreezeUser = async (userId) => {
    return await request.put('/admin/unFreezeUser',null,{
        params: {
            userId: userId
        }
    })
}


