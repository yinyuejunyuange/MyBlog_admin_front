<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="myTableColumns"
      :table-data="adminList"
      :show-add="true"
      @search="onSearch"
      @add="openDialog"
  >
    <template #isUserFreeze="{ value }">
      <el-tag :type="value === 0 ? 'success' : 'danger'" effect="light">
        {{ statusMap[value] }}
      </el-tag>
    </template>
    <template #actions="{ row }">
      <el-button link type="danger" size="small" >冻结</el-button>
      <el-button link type="danger" size="small" >删除</el-button>
    </template>
  </DataTable>

  <el-dialog
      v-model="visible"
      title="新增管理员账号"
      width="400px"
      class="glass-dialog"
      destroy-on-close
  >
    <div class="p-2">
      <div class="mb-6">
        <h3 class="text-lg font-bold text-slate-800">创建新管理员</h3>
        <p class="text-xs text-slate-400 mt-1">请设置该管理员的登录凭证，确保密码安全。</p>
      </div>

      <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-position="top"
      >
        <el-form-item label="管理员用户名" prop="username">
          <el-input
              v-model="formData.username"
              placeholder="请输入登录账号"
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input
              v-model="formData.password"
              type="password"
              show-password
              placeholder="请输入初始密码"
              :prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="formData.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入密码"
              :prefix-icon="Check"
          />
        </el-form-item>
      </el-form>

      <div class="mt-4 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50 flex items-start gap-2">
        <el-icon class="mt-0.5 text-blue-500"><InfoFilled /></el-icon>
        <span class="text-[11px] text-blue-600 leading-relaxed">
          管理员账号创建后，请告知用户在首次登录后及时修改默认密码。
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 px-2 pb-2">
        <el-button @click="visible = false">取消</el-button>
        <el-button
            type="primary"
            @click="handleSave"
            class="!bg-slate-900 !border-slate-900 w-32"
        >确认创建</el-button>
      </div>
    </template>
  </el-dialog>

</template>


<script setup >
import { User, Lock, Check, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import DataTable from "@/components/common/DataTable/index.vue";
import {ref} from "vue";

const mySearchConfig = [
  { label: '管理员', prop: 'keyword', type: 'input', placeholder: '搜索关键词...' },
  { label: '开始时间', prop: 'startTime', type: 'date' },
  { label: '结束时间', prop: 'endTime', type: 'date' },
  {
    label: '是否冻结',
    prop: 'isUserFreeze',
    type: 'select',
    options: [
      { label: '冻结', value: 1 },
      { label: '未冻结', value: 0 },
    ]
  },
]

const myTableColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '用户名', prop: 'userName' },
  { label: '用户头像', prop: 'userHead' },
  { label: '用户创建时间', prop: 'createTime' },
  { label: '是否冻结', prop: 'isUserFreeze' },
  { label: '操作', prop: 'actions', width: '150' }
]

const adminList = ref([
  {
    id: 1001, // ID字段（数字类型）
    userName: 'admin', // 用户名（管理员账号）
    userHead: 'https://example.com/avatar/admin.png', // 头像URL（模拟真实地址）
    createTime: '2026-01-10 09:30:00', // 创建时间（常用格式化字符串）
    isUserFreeze: 0, // 0=未冻结，1=已冻结（数字类型，贴合后台常用状态码）
    actions: '' // 操作列仅作为表格展示占位，实际由表格组件渲染按钮
  },
  {
    id: 1002,
    userName: 'zhang_san',
    userHead: 'https://example.com/avatar/zhangsan.png',
    createTime: '2026-02-15 14:20:00',
    isUserFreeze: 0,
    actions: ''
  },
  {
    id: 1003,
    userName: 'li_si',
    userHead: 'https://example.com/avatar/lisi.png',
    createTime: '2026-02-20 10:15:00',
    isUserFreeze: 1, // 标记为已冻结
    actions: ''
  },
  {
    id: 1004,
    userName: 'wang_wu',
    userHead: 'https://example.com/avatar/wangwu.png',
    createTime: '2026-03-01 16:40:00',
    isUserFreeze: 0,
    actions: ''
  },
  {
    id: 1005,
    userName: 'zhao_liu',
    userHead: 'https://example.com/avatar/zhaoliu.png',
    createTime: '2026-03-10 11:00:00',
    isUserFreeze: 1,
    actions: ''
  }
])

const statusMap={
  1:'冻结',
  0:'正常'
}

const visible = ref(false)
const formRef = ref(null)

// 对应后端的 LoginDTO 结构 + 前端校验字段
const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 最终只提取后端需要的 LoginDTO 参数
      const submitData = {
        username: formData.value.username,
        password: formData.value.password
      }
      console.log('发送给后端的 LoginDTO:', submitData)
      ElMessage.success('管理员账号创建成功')
      visible.value = false
    }
  })
}

const openDialog = () => {
  visible.value = true;
  formData.value = {
    username: '',
    password: '',
    confirmPassword: ''
  }
}

</script>

<style scoped>

</style>