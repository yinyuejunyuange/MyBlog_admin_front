import request from "@/utils/request.js";

export const getCode = async () => {
    return await request.get('/user/verify/getCode',{
        responseType: 'blob' // 对于图片验证码
    })
}

export const verifyCode = async (code,verifyToken) => {
    return await request.get('/user/verify/checkCode',{
        params: {
            code: code
        },
        headers:{
            "X-Verify-Token": verifyToken
        }
    })
}
/**
 * 管理员登录
 * @param loginForm
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const userLogin = async (loginForm) => {
    return await request.post('/auth/adminLogin',loginForm)
}

/**
 * 用户修改密码
 * @param loginForm
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updatePassword = async (loginForm) => {
    return await request.post('/auth/updatePassword',loginForm)
}

export const userRegister = async (registerForm) => {
    return await request.post('/auth/register',registerForm)
}

export const userLogout = async()=>{
    return await request.post('/auth/logout')
}