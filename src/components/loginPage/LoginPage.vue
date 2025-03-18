
<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="form-header">
        <h2>管理员登录</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      <form @submit.prevent="handleLogin" class="floating-form">
        <div class="input-group">
          <input id="phone" v-model.trim="loginForm.phone" type="text" autocomplete="off" @input="validateInput" required />
          <label for="phone">电话号码</label>
          <span class="highlight"></span>
        </div>
        <div class="input-group">
          <input id="password" v-model.trim="loginForm.password" type="password" autocomplete="off" @input="validateInput" required />
          <label for="password">密码</label>
          <span class="highlight"></span>
        </div>
        <div class="input-group inline-group">
          <input id="encode" v-model.trim="loginForm.encode" type="text" autocomplete="off" @input="validateInput" required class="half-width" />
          <label for="encode">请输入邮箱验证码</label>
          <span class="highlight"></span>
          <button type="button" class="get-code-btn" @click="getCode">获取验证码</button>
        </div>
        <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>
        <button type="submit" class="submit-btn" >
          <span>登录</span>
          <i class="arrow-icon"></i>
        </button>
      </form>
    </div>
  </div>
</template>



<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {ElMessage} from "element-plus";

const router = useRouter()

// 表单数据
const loginForm = reactive({
  phone: '',
  password: '',
  encode: '',
  uuid:''
})

const errorMsg = ref('')
const isFormValid = ref(false)

// 输入验证
const validateInput = () => {
  // 基本验证
  if (loginForm.phone && loginForm.password && loginForm.encode) {
    isFormValid.value = true
    errorMsg.value = ''
  } else {
    isFormValid.value = false
  }
}

// 登录处理
const handleLogin = async () => {
  // 防止XSS攻击
  const xssPattern = /(~|\{|\}|"|'|<|>|\?)/g
  if (xssPattern.test(loginForm.phone) || xssPattern.test(loginForm.password)) {
    errorMessage('警告:输入内容包含非法字符');
    return
  }


  // 验证手机号是否为11位数字
  const phonePattern = /^\d{11}$/;
  if (!phonePattern.test(loginForm.phone)) {
    errorMessage('警告:手机号必须为11位数字');
    return;
  }

  if(!loginForm.password || !loginForm.encode || !loginForm.phone) {
    errorMessage('警告:输入不可为空');
    return ;
  }

  // 验证密码是否超过6位
  if (loginForm.password.length <= 3) {
    errorMessage('警告:密码必须超过6位');
    return;
  }
  try {
    // 对输入进行转义处理
    const safePhone = encodeURIComponent(loginForm.phone)
    const safePassword = encodeURIComponent(loginForm.password)

    // 实际的登录API调用
    console.log('登录请求:', { phone: safePhone, password: safePassword })
    const param={
      phone: safePhone,
      password: safePassword,
      encode: loginForm.encode,
      uuid:loginForm.uuid,
    }

    console.log(param)

    const response=await axios.post("http://localhost:8080/admin/login", {
      phone: safePhone,
      password: safePassword,
      encode: loginForm.encode,
      uuid: loginForm.uuid,
    },{
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if(response.data.code===200){
      ElMessage.success(response.data.msg)
      localStorage.setItem('token',response.data.data.token)
      localStorage.setItem('name',response.data.data.name)
      localStorage.setItem('id',response.data.data.id)
      localStorage.setItem('imageUrl',response.data.data.imageUrl)

      // 跳转到主页
      await router.push('/')
    }else{
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    errorMessage('登录失败，请稍后重试');
  }
}

const getCode = async() => {
  // 实际的获取验证码 API 调用
  console.log('请求验证码:', loginForm.phone);
  const response=await axios.get("http://localhost:8080/admin/getEncode",{
    params:{
      phone: loginForm.phone
    }
  })

  if(response.data.code===200){
    ElMessage.success(response.data.msg);
    loginForm.uuid=response.data.data
  }else{
    ElMessage.error(response.data.msg)
  }

}

// 错误提示
const errorMessage = (text) => {
  errorMsg.value = text
  setTimeout(() => {
    errorMsg.value = ''
  }, 3000)
}

onMounted(() => {
  validateInput()
})

</script>


<style scoped>
.login-wrapper {
  min-height: 93.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  padding-right: 80px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 700;
}

.form-header p {
  color: #95a5a6;
  font-size: 16px;
}

.floating-form .input-group {
  position: relative;
  margin-bottom: 30px;
}

.input-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: transparent;
}

.input-group label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 5px;
  color: #95a5a6;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-group input:focus,
.input-group input:valid {
  border-color: #3498db;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: 0;
  font-size: 14px;
  color: #3498db;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  margin-left: 15px;
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.arrow-icon {
  border: solid white;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #95a5a6;
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
  }

  .form-header h2 {
    font-size: 24px;
  }

  .input-group input {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .login-container {
    max-width: 400px;
    padding: 30px;
  }

  .form-header h2 {
    font-size: 28px;
  }

  .form-header p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
    margin: 10px;
    max-width: 100%;
  }

  .form-header h2 {
    font-size: 24px;
  }

  .form-header p {
    font-size: 14px;
  }

  .input-group input {
    padding: 12px;
    font-size: 14px;
  }

  .input-group label {
    font-size: 14px;
  }

  .submit-btn {
    padding: 12px;
    font-size: 16px;
  }
}

@media (max-width: 320px) {
  .login-container {
    padding: 15px;
  }

  .form-header h2 {
    font-size: 20px;
  }

  .input-group {
    margin-bottom: 20px;
  }
}

.inline-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.half-width {
  width: 60%; /* 设置输入框宽度为70% */
  margin-right: 10px; /* 添加右边距 */
}

.get-code-btn {
  width: 40%;
  height: 50px;
  padding: 5px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.get-code-btn:hover {
  background-color: #2980b9;
}
</style>

