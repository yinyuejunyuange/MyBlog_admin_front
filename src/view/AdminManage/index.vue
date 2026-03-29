<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="myTableColumns"
      :table-data="adminList"
      :show-add="true"
      @search="getAdminPage"
      @add="openDialog"
      :total="total"
      @page-change="getAdminPage"
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
  >
    <template #isUserFreeze="{ value }">
      <el-tag :type="value === 0 ? 'success' : 'danger'" effect="light">
        {{ statusMap[value] }}
      </el-tag>
    </template>
    <template #createTime="{ row }">
      {{formatDate(row.createTime)}}
    </template>
    <template #actions="{ row }">
      <el-button link v-if="row.isUserFreeze === 0" type="danger" size="small" @click="freezeAdminInfo(row)" >冻结</el-button>
      <el-button link v-else type="success" size="small" @click="unFreezeAdminInfo(row)">解冻</el-button>
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
            @click="addNewAdmin"
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
import {onMounted, ref} from "vue";
import {addAdmin, adminPage, freezeAdmin, unFreezeAdmin} from "@/api/admin/admin.js";

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
  { label: '用户名', prop: 'userName' },
  { label: '用户头像', prop: 'userHead' },
  { label: '用户创建时间', prop: 'createTime' },
  { label: '是否冻结', prop: 'isUserFreeze' },
  { label: '操作', prop: 'actions', width: '150' }
]

const adminList = ref([])

const statusMap={
  1:'冻结',
  0:'正常'
}

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

const getAdminPage =async(params) => {
  const res = await adminPage(
      params.userName,
      params.startData,
      params.endTime,
      params.isUserFreeze,
      params.currentPage,
      params.pageSize
  )
  if(res.data.code === 200){
    adminList.value = res.data.data.records
    total.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }
}
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const freezeAdminInfo=async (row) => {
  const res = await freezeAdmin(row.id)
  if(res.data.code === 200){
    const params={
      currentPage: 1,
      pageSize : 10
    }
    await getAdminPage(params)
  }else{
    ElMessage.error("网络繁忙")
  }

}

const unFreezeAdminInfo=async (row) => {
  const res = await unFreezeAdmin(row.id)
  if(res.data.code === 200){
    const params={
      currentPage: 1,
      pageSize : 10
    }
    await getAdminPage(params)
  }else{
    ElMessage.error("网络繁忙")
  }
}

/**
 * 新增用户信息
 */
const addNewAdmin = async() => {
  const res = await addAdmin(formData.value)
  if(res.data.code === 200){
    const params={
      currentPage: currentPage.value,
      pageSize : pageSize.value
    }
    await getAdminPage(params)
    visible.value=false
  }else{
    ElMessage.error("网络繁忙")
  }
}


onMounted(async()=> {
  const params={
    currentPage: 1,
    pageSize : 10
  }
  await getAdminPage(params)
})

</script>

<style scoped>

</style>