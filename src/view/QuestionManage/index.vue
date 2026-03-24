<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="myTableColumns"
      :table-data="listData"
      :show-add="true"
      @search="onSearch"
      @add="openAdd"
  >

    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
      <el-button  link type="danger" size="small">删除</el-button>
    </template>
  </DataTable>
    <el-dialog
        v-model="visible"
        :title="formData.id ? '编辑试题详情' : '新增试题'"
        width="65%"
        class="glass-dialog"
        destroy-on-close
    >
      <el-form :model="formData" label-position="top" class="px-2">
        <div class="grid grid-cols-12 gap-6">

          <div class="col-span-12 md:col-span-7 space-y-4">
            <el-form-item label="题目类型">
              <el-radio-group v-model="formData.questionType" @change="handleTypeChange">
                <el-radio-button label="单选题" value="single" />
                <el-radio-button label="多选题" value="multiple"/>
                <el-radio-button label="判断题" value="true-false"/>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="题干内容">
              <el-input v-model="formData.questionText" type="textarea" :rows="4" placeholder="请输入题目内容..." />
            </el-form-item>

            <el-form-item label="题目讲解">
              <el-input v-model="formData.explanation" type="textarea" :rows="3" placeholder="请输入题目解析..." />
            </el-form-item>
          </div>

          <div class="col-span-12 md:col-span-5 bg-slate-50/50 p-5 rounded-2xl border border-white/60 shadow-inner">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-bold text-slate-600">选项与答案设置</span>
              <el-button
                  v-if="formData.questionType !== 'true-false'"
                  type="primary"
                  link
                  @click="addOption"
              >+ 添加选项</el-button>
            </div>

            <div class="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              <div
                  v-for="(opt, index) in formData.options"
                  :key="index"
                  class="flex items-start gap-2 group"
              >
                <div class="pt-1.5">
                  <el-checkbox
                      v-if="formData.questionType === 'multiple'"
                      :model-value="formData.answer.includes(formData.options[index])"
                      @change="(val) => handleCheckChange(val, index)"
                  />
                  <el-radio
                      v-else
                      v-model="singleSelectedValue"
                      :label="formData.options[index]"
                      @change="handleRadioChange"
                  >{{''}}</el-radio>
                </div>

                <div class="flex-1 flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden focus-within:border-blue-400 transition-all">
                <span class="px-3 py-1.5 bg-slate-100 text-slate-500 font-mono font-bold border-r border-slate-200 text-sm">
                  {{ getPrefix(index) }}
                </span>
                  <input
                      :value="extractContent(formData.options[index], index)"
                      @input="(e) => syncOption(e.target.value, index)"
                      placeholder="请输入答案内容"
                      class="w-full px-3 py-1.5 text-sm bg-transparent outline-none text-slate-700"
                      :disabled="formData.questionType === 'true-false'"
                  />
                </div>

                <el-button
                    v-if="formData.questionType !== 'true-false' && formData.options.length > 2"
                    type="danger" link class="mt-1 opacity-0 group-hover:opacity-100"
                    @click="removeOption(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-200">
              <div class="text-[10px] text-slate-400 font-bold uppercase mb-2">答案设置</div>
              <div class="space-y-1">
                <div v-for="ans in formData.answer" :key="ans" class="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  "{{ ans }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" class="!bg-slate-900 px-6">确认保存</el-button>
      </template>
    </el-dialog>

</template>

<script setup>

import DataTable from "@/components/common/DataTable/index.vue";

const mySearchConfig = [
  { label: '关键词', prop: 'keyword', type: 'input', placeholder: '搜索关键词...' },
  {
    label: '类型',
    prop: 'questionType',
    type: 'select',
    options: [
      { label: '单选题', value: 'single' },
      { label: '多选题', value: 'multiple' },
      { label: '判断题', value: 'true-false' }
    ]
  },
]

const myTableColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '题目类型', prop: 'questionType' },
  { label: '标题', prop: 'questionText' },
  { label: '操作', prop: 'actions', width: '150' }
]

import { ref, reactive, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const openDialog = (row)=>{
  visible.value = true
  formData.value = row

  if (row.questionType === 'true-false') {
    formData.value.options = ['true', 'false']
  }

}

const openAdd = ()=> {
  visible.value = true
  formData.value = {
    id: null,
    questionType: 'single',
    questionText: '',
    options: ['', '', '', ''], // 默认4个空选项
    answer: [], // 存储字母如 ["A", "B"]
    explanation: '',
    knowledgePointId: null
  }
}


const listData = ref([
  {
    id: 1001, // Long类型在JS中用Number表示
    createBy: 'admin',
    createTime: '2026-03-01T09:00:00', // Date类型用ISO字符串
    updateBy: 'admin',
    updateTime: '2026-03-01T10:15:00',
    questionType: 'single_choice', // 题目类型：单选题
    questionText: 'Vue3中实现响应式的核心API是？', // 题干
    options: [ // 选项列表（单选题示例）
      'A.Object.defineProperty',
      'B.Proxy',
      'C.Reflect',
      'D.Vue.observable'
    ],
    answer: ['Proxy'], // 答案列表（单选题仅一个答案）
    knowledgePointId: 101, // 关联的知识点ID（Long类型）
    isDelete: 0, // 0未删除，1已删除
    explanation: 'Vue3放弃了Vue2的Object.defineProperty，改用Proxy实现响应式，Proxy能监听更多场景（如数组变化、新增属性）。' // 答案解析
  },
  {
    id: 1002,
    createBy: 'dev01',
    createTime: '2026-03-02T14:30:00',
    updateBy: 'dev01',
    updateTime: '2026-03-02T15:20:00',
    questionType: 'multiple_choice', // 题目类型：多选题
    questionText: '以下属于JavaScript异步编程方式的有？',
    options: [
      'A.回调函数',
      'B.Promise',
      'C.async/await',
      'D.for循环'
    ],
    answer: ['回调函数', 'Promise', 'async/await'], // 多选题多个答案
    knowledgePointId: 102,
    isDelete: 0,
    explanation: 'JS异步编程方式包括回调函数、Promise、async/await、Generator等，for循环是同步遍历方式。'
  },
  {
    id: 1003,
    createBy: 'dev02',
    createTime: '2026-03-03T11:00:00',
    updateBy: 'dev02',
    updateTime: '2026-03-03T11:00:00',
    questionType: 'judgment', // 题目类型：判断题
    questionText: 'React Hooks可以在条件语句中调用？',
    options: ['正确', '错误'], // 判断题选项
    answer: ['错误'],
    knowledgePointId: 103,
    isDelete: 0,
    explanation: 'React Hooks的使用规范要求只能在组件顶层调用，不能在循环、条件、嵌套函数中调用，否则会导致Hook执行顺序错乱。'
  },
  {
    id: 1004,
    createBy: 'test01',
    createTime: '2026-02-28T16:00:00',
    updateBy: 'test01',
    updateTime: '2026-02-28T17:00:00',
    questionType: 'short_answer', // 题目类型：简答题（无选项）
    questionText: '简述HTTP 401和403状态码的区别？',
    options: [], // 简答题无选项，为空数组
    answer: ['401表示未授权，用户未进行身份验证；403表示禁止访问，用户已登录但无权限。'],
    knowledgePointId: 104,
    isDelete: 1, // 标记为已删除
    explanation: '401（Unauthorized）：请求需要用户身份验证，服务器返回此状态码并附带WWW-Authenticate头；403（Forbidden）：服务器理解请求但拒绝执行，权限不足。'
  }
])

const visible = ref(false)
const singleSelectedValue = ref('') // 用于辅助单选 UI 绑定

const formData = ref({
  id: null,
  questionType: 'single',
  questionText: '',
  options: ['A. ', 'B. ', 'C. ', 'D. '], // 初始带前缀
  answer: [], // 这里将存储完全一致的字符串，如 ["A. 正确答案"]
  explanation: '',
})

// 工具：生成前缀
const getPrefix = (index) => String.fromCharCode(65 + index) + '. '

// 工具：从 "A. 文本" 中提取 "文本"
const extractContent = (fullStr, index) => {
  const prefix = getPrefix(index)
  return fullStr.startsWith(prefix) ? fullStr.substring(prefix.length) : fullStr
}

// 核心逻辑：当输入框改变时，更新 options 并同步更新 answer
const syncOption = (newText, index) => {
  const oldVal = formData.value.options[index]
  const newVal = getPrefix(index) + newText

  // 1. 更新 options
  formData.value.options[index] = newVal

  // 2. 如果当前项在答案中，同步更新答案里的字符串
  const ansIndex = formData.value.answer.indexOf(oldVal)
  if (ansIndex !== -1) {
    formData.value.answer[ansIndex] = newVal
  }

  // 3. 如果是单选，同步单选绑定值
  if (singleSelectedValue.value === oldVal) {
    singleSelectedValue.value = newVal
  }
}

// 逻辑：处理单选/判断切换
const handleRadioChange = (val) => {
  formData.value.answer = [val]

  console.info(val)
  console.log(formData.value)
  console.info(formData.value.answer)
}

// 逻辑：处理多选切换
const handleCheckChange = (isChecked, index) => {
  const targetValue = formData.value.options[index]
  if (isChecked) {
    if (!formData.value.answer.includes(targetValue)) {
      formData.value.answer.push(targetValue)
    }
  } else {
    formData.value.answer = formData.value.answer.filter(item => item !== targetValue)
  }
  // 重新按字母排序
  formData.value.answer.sort((a, b) => a.localeCompare(b))
}

// 逻辑：题型切换初始化
const handleTypeChange = (type) => {
  formData.value.answer = []
  singleSelectedValue.value = ''
  if (type === 'true-false') {
    formData.value.options = ['true', 'false']
  } else {
    formData.value.options = ['A. ', 'B. ', 'C. ', 'D. ']
  }
}

const addOption = () => {
  formData.value.options.push(getPrefix(formData.value.options.length))
}

const removeOption = (index) => {
  formData.value.options.splice(index, 1)
  // 移除后重新计算所有前缀
  rebuildAll()
}

// 核心逻辑：重新计算所有选项的字母顺序和答案映射
const rebuildAll = () => {
  const oldOptions = [...formData.value.options]
  const oldAnswers = [...formData.value.answer]

  const newOptions = []
  const newAnswers = []

  oldOptions.forEach((oldStr, idx) => {
    const pureText = oldStr.includes('. ') ? oldStr.split('. ')[1] || '' : oldStr
    const newFullStr = getPrefix(idx) + pureText
    newOptions.push(newFullStr)

    // 如果旧的选项在旧的答案里，把新的全称加入新答案
    if (oldAnswers.includes(oldStr)) {
      newAnswers.push(newFullStr)
    }
  })

  formData.value.options = newOptions
  formData.value.answer = newAnswers
  singleSelectedValue.value = newAnswers[0] || ''
}

const submitForm = () => {
  console.log('提交给后端的数据:', formData.value)
  visible.value = false
}

</script>

<style scoped>

</style>