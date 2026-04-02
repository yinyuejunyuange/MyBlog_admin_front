<template>
  <div class="h-screen bg-slate-50 flex flex-col relative overflow-hidden">
    <div id="particles-js" class="absolute inset-0 z-0"></div>

    <header class="h-14  bg-white/70 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
      <div class="flex items-center gap-2">
        <div class="w-15 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">CNDN</div>
        <span class="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
          CSDN后台管理系统
        </span>
      </div>

      <div class="flex items-center gap-5">
        <div class="flex items-center gap-4 text-slate-500">
          <el-icon class="cursor-pointer hover:text-indigo-600"><Bell /></el-icon>
          <el-icon class="cursor-pointer hover:text-indigo-600"><Monitor /></el-icon>
          <el-icon class="cursor-pointer hover:text-indigo-600"><Switch /></el-icon>
        </div>

        <el-dropdown trigger="click">
          <div class="flex items-center gap-2 cursor-pointer outline-none">
            <el-avatar :size="28" :src="imgPrefix + userImg" />
            <span class="text-sm font-medium text-slate-700">{{userName}}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showPasswordDialog = true" ><el-icon><EditPen /></el-icon>修改密码</el-dropdown-item>
              <el-dropdown-item divided text-color="red"
                                @click="logOut"
              >
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden z-10">
      <aside class="w-56  bg-white/50 backdrop-blur-sm flex flex-col">
        <Aside/>
      </aside>

      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <router-view :key="$route.fullPath"></router-view>
      </main>
    </div>

    <el-dialog
        v-model="showPasswordDialog"
        title="修改登录密码"
        width="400px"
        destroy-on-close
        align-center
    >
      <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
          label-position="top"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入 6-16 位新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="showPasswordDialog = false">取消</el-button>
      <el-button type="primary" @click="handleUpdatePassword">确认修改</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
// 导入 Element Plus 图标
import {
  Bell, Monitor, Switch, ArrowDown, Wallet, DataAnalysis,
  Key, Document, Setting, EditPen, SwitchButton
} from '@element-plus/icons-vue'

import Aside from '@/components/layout/aside/index.vue'
import {ElMessage} from "element-plus";
import {updatePassword, userLogout} from "@/api/login/login.js";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const imgPrefix = import.meta.env.VITE_API_BASE_URL+'user/getHead/'
const userName = localStorage.getItem('username')
const userImg = localStorage.getItem('userImg')
// --- 修改密码逻辑开始 ---
const showPasswordDialog = ref(false)
const passwordFormRef = ref(null)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义校验规则：确认密码必须一致
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleUpdatePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate(async(valid) => {
    if (valid) {
      // 这里调用你的后端接口
      console.log('提交的数据：', passwordForm)
      const res = await updatePassword(passwordForm)
      if(res.data.code === 200){
        ElMessage.success('密码修改成功，请重新登录')
        showPasswordDialog.value = false
        // 重置表单
        passwordFormRef.value.resetFields()
      }else{
        ElMessage.error("密码修改失败")
      }
    } else {
      console.log('校验失败')
    }
  })
}

const logOut = async () => {
  await userLogout()
  localStorage.clear()
  router.push({
    name: "LoginPage"
  })
}


onMounted(() => {
  if (window.particlesJS) {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 50 },
        color: { value: '#6366f1' },
        shape: { type: 'circle' },
        opacity: { value: 0.2 },
        size: { value: 2 },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#6366f1',
          opacity: 0.1,
          width: 1
        },
        move: { enable: true, speed: 0.6 }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: 'grab' } }
      }
    })
  }
})
</script>

<style scoped>
.app {
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  padding: 20px;
  z-index: 1;
}

.logo {
  font-weight: bold;
  margin-bottom: 20px;
}

.menu li {
  padding: 10px;
  border-radius: 8px;
}

.menu li.active {
  background: rgba(127,90,240,0.2);
}

/* 主体 */
.main {
  flex: 1;
  padding: 20px;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #7f5af0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 卡片 */
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.card {
  padding: 20px;
  border-radius: 12px;
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

/* 内容 */
.content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart, .side {
  padding: 20px;
  border-radius: 12px;
  height: 300px;
}

/* 公告 */
.notice {
  padding: 12px;
  border-radius: 8px;
}
</style>