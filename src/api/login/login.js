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

export const userLogin = async (loginForm) => {
    return await request.post('/auth/login',loginForm)
}

export const userRegister = async (registerForm) => {
    return await request.post('/auth/register',registerForm)
}

export const userLogout = async()=>{
    return await request.post('/auth/logout')
}