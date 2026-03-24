<template>
  <div class="login-page">
    <!-- 动态背景 -->
    <div class="bg-blob"></div>
    <div class="bg-blob blob2"></div>

    <!-- 登录卡片 -->
    <div class="login-container">
      <h2 class="title">系统登录</h2>

      <el-form :model="form" :rules="rules" ref="formRef">
        <!-- 用户名 -->
        <div class="input-box">
          <el-input v-model="form.username" required  placeholder="用户名"/>

        </div>

        <!-- 密码 -->
        <div class="input-box">
          <el-input v-model="form.password" type="password" required show-password  placeholder="密码" />
        </div>

        <!-- 验证码 -->
        <div class="input-box code-box">
          <el-input v-model="form.code" required  placeholder="验证码"/>
          <img :src="verifyImg" @click="loadCode " class="code-img" />
        </div>

        <!-- 登录按钮 -->
        <el-button class="login-btn" @click="handleLogin">立即登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { ElMessage } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import {getCode, userLogin, verifyCode} from "@/api/login/login.js";

const formRef = ref()

const route = useRoute()
const router = useRouter()

const form = ref({
  username: '',
  password: '',
  code: ''
})

const verifyImg = ref('')
const verifyToken = ref('')

const loadCode = async () => {
  const res = await getCode()

  // 获取验证token
  verifyToken.value = res.headers['x-verify-token']

  // 获取图片
  const blob = res.data
  verifyImg.value = URL.createObjectURL(blob)
}


const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const checkCode = async ( ) => {
  let result=null
  await verifyCode(form.value.code,verifyToken.value).then(res => {
    result = res.data.code === 200;
  })

  return result
}

const goDashboard = () => {
  router.push({
    name: 'Dashboard'
  })
}

const handleLogin = async() => {
  const checkCodeResult = await checkCode()
  console.log(checkCodeResult)
  if(!checkCodeResult){
    ElMessage.error("验证码错误")
    return
  }

  const res = await userLogin(form.value)
  if (res.data.code === 200) {
    localStorage.setItem('token', res.data.data.token)
    localStorage.setItem('username', res.data.data.username)
    localStorage.setItem('userImg', res.data.data.image)
    goDashboard()
  } else {
    ElMessage.error('登录失败')
  }
}

onMounted(async() => {
  await loadCode()
})

</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  position: relative;
  overflow: hidden;
}

/* 动态背景 */
.bg-blob {
  position: absolute;
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #7f5af0, #2cb67d);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: move 18s infinite linear;
  filter: blur(80px);
  opacity: 0.4;
}

.blob2 {
  right: -150px;
  bottom: -150px;
  animation-delay: 5s;
}

@keyframes move {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.3); }
  100% { transform: rotate(360deg) scale(1); }
}

/* 登录卡片 */
.login-container {
  width: 380px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* 输入框 */
.input-box {
  position: relative;
  margin-bottom: 25px;
}

.input-box :deep(.el-input__wrapper) {
  background: rgba(255,255,255,0.5);
  border-radius: 10px;
}

.floating-label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
  transition: 0.3s;
  pointer-events: none;
}

.input-box :deep(input:focus) ~ .floating-label,
.input-box :deep(input:not(:placeholder-shown)) ~ .floating-label {
  top: -8px;
  font-size: 12px;
  color: #7f5af0;
}

/* 验证码 */
.code-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code-img {
  width: 100px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #eee;
}

/* 按钮 */
.login-btn {
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background: linear-gradient(45deg, #7f5af0, #2cb67d);
  border: none;
  color: #fff;
  font-size: 16px;
}

.login-btn:hover {
  opacity: 0.9;
}
</style>