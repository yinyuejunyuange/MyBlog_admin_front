<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="knowledgeBaseColumns"
      :table-data="pointList"
      :show-add="true"
      @search="onSearch"
      @add="openAdd"
  >
    <template #relatedQuestions="{value}">
      {{value.size || 0}}
    </template>
    <template #level="{value}">
      <el-tag :type="value === '简单' ? 'success' : value === '中等'? 'warning':'danger' " effect="light">
        {{ value}}
      </el-tag>
    </template>
    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="openDetail(row)">编辑</el-button>
      <el-button link type="danger" size="small" >删除</el-button>
    </template>
  </DataTable>
  <el-dialog v-model="visible" title="知识点详情管理" width="80%" class="glass-dialog">
    <el-tabs v-model="activeTab">

      <el-tab-pane label="核心内容" name="content">
        <el-form :model="formData" label-position="top" class="p-2">
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="知识点标题" class="col-span-2">
              <el-input v-model="formData.title" placeholder="输入标题" />
            </el-form-item>
            <el-form-item label="推荐回答" class="col-span-2">
              <el-input v-model="formData.recommendedAnswer" type="textarea" :rows="3" />
            </el-form-item>
          </div>

          <div class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-bold text-slate-500">常见面试问答 (InterviewQuestionsDTO)</span>
              <el-button type="primary" size="small" @click="addInterviewItem">+ 新增问答</el-button>
            </div>
            <div v-for="(item, index) in formData.relatedQuestions" :key="index"
                 class="mb-4 p-4 rounded-xl border border-dashed border-slate-300 bg-white/30 relative group">
              <el-button type="danger" link class="absolute top-2 right-2 opacity-0 group-hover:opacity-100" @click="formData.relatedQuestions.splice(index,1)">删除</el-button>
              <el-form-item label="问" dense>
                <el-input v-model="item.title" size="small" />
              </el-form-item>
              <el-form-item label="答" dense class="!mb-0">
                <el-input v-model="item.answer" type="textarea" :rows="2" size="small" />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="关联试题管理" name="questions">
        <DataTable
            :columns="questionColumns"
            :table-data="linkedQuestions"
            :show-search="false"
            :show-add="true"
            @add="openSelectQuestionDialog"
        >
          <template #actions="{ row }">
            <el-button type="danger" size="small" link @click="removeQuestion(row.id)">取消关联</el-button>
          </template>
        </DataTable>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="selectDialogVisible" title="选择关联试题" width="60%" append-to-body class="glass-dialog">
      <DataTable
          :columns="questionColumns"
          :table-data="allQuestionPool"
          :search-schema="questionSearchSchema"
          :show-page="true"
          @search="handlePoolSearch"
      >
        <template #id="{ row }">
          <el-checkbox v-model="selectedIds" :label="row.id">{{ '' }}</el-checkbox>
        </template>
      </DataTable>
      <template #footer>
        <el-button @click="selectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确认选择 ({{selectedIds.length}})</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="handleSave">保存全部</el-button>
    </template>
  </el-dialog>


</template>

<script setup>
import DataTable from "@/components/common/DataTable/index.vue";
import {reactive, ref} from "vue";

const mySearchConfig = [
  { label: '知识点名称', prop: 'search', type: 'input', placeholder: '搜索关键词...' },
  {
    label: '知识库来源',
    prop: 'baseId',
    type: 'select',
    options: [
      { label: 'JAVA高频面试题', value: 123123 },
      { label: '后端高频面试题', lue: 123123123 },
    ]
  },
]

const knowledgeBaseColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '题目', prop: 'title' ,width: '160'},
  { label: '推荐回答', prop: 'recommendedAnswer' ,width: '440'},
  { label: '问题数量', prop: 'relatedQuestions' ,width: '100'},
  { label: '难度', prop: 'level' },
  { label: '操作', prop: 'actions', width: '150' }
]

const pointList = ref([
  {
    id: 'kp001',
    createBy: 'admin',
    createTime: '2026-03-01T10:15:30',
    updateBy: 'admin',
    updateTime: '2026-03-02T14:20:15',
    title: 'Vue3的响应式原理', // 题目/知识点标题
    recommendedAnswer: 'Vue3通过Proxy实现响应式，相比Vue2的Object.defineProperty，能监听数组变化和新增属性，同时支持嵌套对象的深度响应式。',
    relatedQuestions: [ // 严格匹配InterviewQuestionsDTO（仅title/answer）
      {
        title: 'Vue3响应式和Vue2有什么区别？',
        answer: 'Vue2使用Object.defineProperty，只能监听已有属性的读写，无法监听数组索引变化和新增属性；Vue3使用Proxy代理整个对象，能监听更多场景，且性能更优。'
      },
      {
        title: 'Proxy相比Object.defineProperty的优势？',
        answer: '1. 能监听数组的push/pop等方法；2. 能监听对象新增/删除属性；3. 无需递归遍历嵌套对象（可懒代理）；4. 返回新对象，不修改原对象。'
      }
    ],
    level: '中等',
    type: ['Vue3', '前端框架', '响应式'],
    isDelete: 0
  },
  {
    id: 'kp002',
    createBy: 'dev01',
    createTime: '2026-03-05T09:30:00',
    updateBy: 'dev01',
    updateTime: '2026-03-05T11:45:20',
    title: 'JavaScript异步编程',
    recommendedAnswer: 'JS异步编程方式包括：回调函数、Promise、async/await、Generator，其中async/await是Promise的语法糖，可读性最高。',
    relatedQuestions: [
      {
        title: 'Promise的三种状态是什么？如何转换？',
        answer: 'Pending（进行中）、Fulfilled（已成功）、Rejected（已失败）；状态一旦改变（Pending→Fulfilled/Rejected），就无法再次改变。'
      }
    ],
    level: '简单',
    type: ['JavaScript', '异步', 'Promise'],
    isDelete: 0
  },
  {
    id: 'kp003',
    createBy: 'dev02',
    createTime: '2026-02-20T16:00:00',
    updateBy: 'dev02',
    updateTime: '2026-02-21T10:00:00',
    title: 'React Hooks使用规范',
    recommendedAnswer: '1. 只能在函数组件或自定义Hook中调用；2. 只能在组件顶层调用，不能在循环/条件/嵌套函数中调用；3. 依赖数组要准确，避免遗漏或多余依赖。',
    relatedQuestions: [], // 无关联面试题时为空数组
    level: '困难',
    type: ['React', 'Hooks', '前端框架'],
    isDelete: 1
  },
  {
    id: 'kp004',
    createBy: 'test01',
    createTime: '2026-03-10T11:20:00',
    updateBy: 'test01',
    updateTime: '2026-03-10T11:20:00',
    title: 'HTTP状态码分类及常见场景',
    recommendedAnswer: 'HTTP状态码分为5类：1xx（信息）、2xx（成功）、3xx（重定向）、4xx（客户端错误）、5xx（服务端错误）；常见的如200（成功）、404（资源不存在）、500（服务端异常）。',
    relatedQuestions: [
      {
        title: '301和302状态码的区别？',
        answer: '301是永久重定向，浏览器会缓存重定向地址，后续请求直接访问新地址；302是临时重定向，每次请求都会先访问原地址再跳转。'
      },
      {
        title: '401和403状态码的区别？',
        answer: '401（未授权）：请求需要身份验证，用户未登录；403（禁止访问）：用户已登录，但无权限访问该资源。'
      }
    ],
    level: '简单',
    type: ['HTTP', '网络', '前端基础'],
    isDelete: 0
  }
])

const visible = ref(false)
const activeTab = ref('content')
const selectDialogVisible = ref(false)

// 1. KnowledgePointDTO 数据
const formData = ref({
  title: '',
  recommendedAnswer: '',
  relatedQuestions: [], // InterviewQuestionsDTO 列表
})

// 2. 已关联的 QuestionDTO 列表
const linkedQuestions = ref([])

// 3. 试题选择池 (模拟数据)
const allQuestionPool = ref([
  { id: 1, questionText: 'Java 反射原理是什么？', questionType: '简答题', answer: ['...'] },
  { id: 2, questionText: 'Vue3 生命周期有哪些？', questionType: '多选题', answer: ['...'] }
])
const selectedIds = ref([])

// 表格列定义
const questionColumns = [
  { prop: 'id', label: '选择/ID', width: '80' },
  { prop: 'questionType', label: '类型', width: '100' },
  { prop: 'questionText', label: '试题内容' },
  { prop: 'actions', label: '操作', width: '120' }
]

const questionSearchSchema = [
  { prop: 'questionText', label: '内容关键字', type: 'input' },
  { prop: 'questionType', label: '题目类型', type: 'select', options: [{label: '单选', value: '1'}] }
]

// 逻辑操作
const addInterviewItem = () => formData.relatedQuestions.push({ title: '', answer: '' })

const openSelectQuestionDialog = () => {
  selectedIds.value = linkedQuestions.value.map(q => q.id)
  selectDialogVisible.value = true
}

const confirmSelection = () => {
  // 根据选中的 ID 过滤并同步到关联列表
  linkedQuestions.value = allQuestionPool.value.filter(q => selectedIds.value.includes(q.id))
  selectDialogVisible.value = false
}

const removeQuestion = (id) => {
  linkedQuestions.value = linkedQuestions.value.filter(q => q.id !== id)
}

const handleSave = () => {
  console.log('最终保存的数据：', { ...formData, questions: linkedQuestions.value })
}

const isEdit = ref(false)

const openDetail = (row) => {
  visible.value = true
  isEdit.value = true
  formData.value = row
}

const openAdd = () =>{
  visible.value = true
  isEdit.value = true

  formData.value = {
    title: '',
    recommendedAnswer: '',
    relatedQuestions: [], // InterviewQuestionsDTO 列表
  }
}

</script>

<style scoped>

</style>