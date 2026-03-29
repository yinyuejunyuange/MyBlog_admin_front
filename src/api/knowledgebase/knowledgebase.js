import request from "@/utils/request.js";

/**
 * 知识库管理--分页获取知识库信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getPageList = async ( currentPage, pageSize,name) => {
    return await request.get('/knowledgeBase/admin/list',{
        params: {
            currentPage: currentPage,
            pageSize: pageSize,
            name: name
        }
    })
}

/**
 * 知识库管理--知识库详情
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const baseDetail = async (id) => {
    return await request.get('/knowledgeBase/admin/detail',{
        params: {
            id: id
        }
    })
}

/**
 * 知识库管理--新增知识库
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addBase = async (data) => {
    return await request.post('/knowledgeBase/admin/add',data)
}

/**
 * 知识库管理--修改知识库
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateBase = async (data) => {
    return await request.put('/knowledgeBase/admin/update',data)
}

/**
 * 知识库管理--删除知识库
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteBase = async (id) => {
    return await request.delete('/knowledgeBase/admin/delete',{
        params: {
            id: id
        }
    })
}
/**
 * 知识库管理--关联知识点
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const relatePoints = async (baseId,data) => {
    return await request.post('/knowledgeBase/admin/addKnowledgePoints',data,{
        params: {
            knowledgeBaseId: baseId
        }
    })
}


/**
 * 知识库管理--取消关联知识点
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const unRelatePoints = async (baseId,data) => {
    return await request.post('/knowledgeBase/admin/removeKnowledgePoints',data,{
        params: {
            knowledgeBaseId: baseId
        }
    })
}

