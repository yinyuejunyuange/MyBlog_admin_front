import request from "@/utils/request.js";

/**
 * 知识点管理--分页获取知识库信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getPageList = async ( currentPage, pageSize,baseId,level,tags,search) => {
    return await request.get('/knowledgePoint/admin/list',{
        params: {
            currentPage: currentPage,
            pageSize: pageSize,
            baseId: baseId,
            level: level,
            tags: tags,
            search: search
        }
    })
}

/**
 * 知识点管理--分页获取知识库信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getPointDetail = async ( id) => {
    return await request.get('/knowledgePoint/admin/detail',{
        params: {
            id: id
        }
    })
}

/**
 * 知识点管理--新增
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const add = async (data) => {
    return await request.post('/knowledgePoint/admin/add',data)
}

/**
 * 知识点管理--修改
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const update = async (data) => {
    return await request.put('/knowledgePoint/admin/update',data)
}

/**
 * 知识点管理--删除
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deletePoint = async (data) => {
    return await request.put('/knowledgePoint/admin/delete',data)
}

/**
 * 知识点管理--获取知识点的所有评论信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const commentsAdmin = async (knowledgePointId,userName,replyCommentId,currentPage,pageSize) => {
    return await request.get('/knowledgePoint/admin/comments',{
        params:{
            knowledgePointId: knowledgePointId,
            userName: userName,
            replyCommentId: replyCommentId,
            currentPage: currentPage,
            pageSize: pageSize
        }
    })
}

/**
 * 知识点管理--获取相关问题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const questionList = async (knowledgePointId,currentPage,pageSize) => {
    return await request.get('/knowledgePoint/admin/questions',{
        params:{
            knowledgePointId: knowledgePointId,
            currentPage: currentPage,
            pageSize: pageSize
        }
    })
}

/**
 * 知识点管理--关联知识点与试题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const relateQuestion = async (knowledgePointId,data) => {
    return await request.post('/knowledgePoint/admin/relateQuestions',data,{
        params:{
            knowledgePointId: knowledgePointId,
        }
    })
}

/**
 * 知识点管理--关联知识点与试题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const unRelateQuestion = async (questionId) => {
    return await request.put('/knowledgePoint/admin/unrelateQuestion',null,{
        params:{
            questionId: questionId,
        }
    })
}


/**
 * 知识点评论管理--设置可见
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const commentVisible = async (commentId) => {
    return await request.put('/knowledgePoint/admin/comments/visible',null,{
        params:{
            commentId: commentId,
        }
    })
}

/**
 * 知识点评论管理--设置可见不
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const commentUnVisible = async (commentId) => {
    return await request.put('/knowledgePoint/admin/comments/unVisible',null,{
        params:{
            commentId: commentId,
        }
    })
}

/**
 * 知识点获取
 * @param param
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const pointList = async(param) => {
    return await request.get('/point',{
        params: param
    })
}

/**
 * 知识点 依据知识库获取所有未关联的知识点
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const pointToSelect = async (currentPage, pageSize,keywords, baseId) => {
    return await request.get('/knowledgePoint/admin/getPointToSelect',{
        params:{
            id: baseId,
            currentPage: currentPage,
            pageSize: pageSize,
            keywords: keywords
        }
    })
}




