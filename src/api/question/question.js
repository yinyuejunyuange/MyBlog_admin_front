import request from "@/utils/request.js";

/**
 * 试题管理--分页获取试题信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const questionPageList = async ( currentPage, pageSize,questionType,keyword,knowledgePointId,knowledgeBaseId) => {
    return await request.get('/question/admin/list',{
        params: {
            currentPage: currentPage,
            pageSize: pageSize,
            questionType: questionType,
            keyword: keyword,
            knowledgePointId: knowledgePointId,
            knowledgeBaseId: knowledgeBaseId
        }
    })
}

/**
 * 试题管理--分页获取试题信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const questionPageListForSelect = async ( currentPage, pageSize,questionType,keyword) => {
    return await request.get('/question/admin/listForSelect',{
        params: {
            currentPage: currentPage,
            pageSize: pageSize,
            questionType: questionType,
            keyword: keyword
        }
    })
}


/**
 * 试题管理--试题详情
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const questionDetail = async ( id) => {
    return await request.get('/question/admin/detail',{
        params: {
            id: id
        }
    })
}

/**
 * 试题管理--试题关联知识点
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const questionRelateKnowledgePoint = async (questionId,knowledgePointId) => {
    return await request.post('/question/admin/relateKnowledgePoint',null,{
        params: {
            questionId: questionId,
            knowledgePointId: knowledgePointId
        }
    })
}

/**
 * 试题管理--试题取消关联知识点
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const questionUnRelateKnowledgePoint = async (questionId) => {
    return await request.post('/question/admin/unrelateKnowledgePoint',null,{
        params: {
            questionId: questionId
        }
    })
}

/**
 * 试题管理--新增试题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addQuestion = async (data) => {
    return await request.post('/question/admin/add',data)
}

/**
 * 试题管理--新增试题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateQuestion = async (data) => {
    return await request.put('/question/admin/update',data)
}


/**
 * 试题管理--删除试题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteQuestion = async (data) => {
    return await request.put('/question/admin/delete',data)
}


