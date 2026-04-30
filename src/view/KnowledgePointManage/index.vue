<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="knowledgeBaseColumns"
      :table-data="pointList"
      :show-add="true"
      @search="getPageListPoint"
      @page-change="getPageListPoint"
      @add="openAdd"
      :total="total"
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
  >
    <template #relatedQuestions="{value}">
      {{value.length || 0}}
    </template>

    <template #recommendedAnswer="{value}">
      <div class="line-clamp-2">
        {{value}}
      </div>
    </template>

    <template #level="{value}">
      <el-tag :type="value === '简单' ? 'success' : value === '中等'? 'warning':'danger' " effect="light">
        {{ value}}
      </el-tag>
    </template>
    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="openDetail(row)">编辑</el-button>
      <el-button link type="danger" size="small" @click="deleteKnowledgePoint(row)">删除</el-button>
    </template>
  </DataTable>


  <el-dialog v-model="visible" title="知识点详情管理" width="80%" class="glass-dialog">
    <el-tabs v-model="activeTab">

      <el-tab-pane label="核心内容" name="content" class="py-6">
        <el-form :model="formData" label-position="top">
          <div class="grid grid-cols-12 gap-8 mb-8">
            <div class="col-span-12 md:col-span-8">
              <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">知识点标题</label>
              <el-input
                  v-model="formData.title"
                  placeholder="输入一个具有吸引力的标题..."
                  class="!rounded-lg shadow-sm"
                  size="large"
              />
            </div>
            <div class="col-span-12 md:col-span-4">
              <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">难度级别</label>
              <el-select v-model="formData.level" class="w-full" size="large">
                <el-option label="简单" value="简单" />
                <el-option label="中等" value="中等" />
                <el-option label="困难" value="困难" />
              </el-select>
            </div>
          </div>

          <!-- ========= 编辑器 ========= -->
          <div class="flex-1 h-[400px] px-4 pt-4">
            <MdEditor
                v-model="formData.recommendedAnswer"
                :theme="theme"
                :toolbars="toolbars"
                @on-upload-img="onUploadImg"
                style="height: 100%"
            />
          </div>

          <!-- ========= 底部栏 ========= -->
          <!-- 底部固定栏 -->
          <div
              class="flex items-center justify-between h-16 px-6 bg-white border-t border-gray-200 shadow-sm"
          >
            <!-- 左侧：Markdown 提示 -->
            <el-popover
                placement="top-start"
                :width="260"
                trigger="hover"
            >
              <div class="text-xs text-gray-700 space-y-1 leading-relaxed">
                <div><code># 标题</code>：一级标题</div>
                <div><code>## 标题</code>：二级标题</div>
                <div><code>**加粗**</code>：文本加粗</div>
                <div><code>*斜体*</code>：文本斜体</div>
                <div><code>`代码`</code>：行内代码</div>
                <div><code>```</code>：代码块</div>
                <div><code>- 列表</code>：无序列表</div>
                <div><code>[文本](链接)</code>：超链接</div>
                <div class="pt-2 mt-2 border-t text-gray-500">
                  常用标签
                </div>
              </div>

              <template #reference>
                <span class="text-sm text-gray-600 cursor-help select-none">
                  📘 Markdown 语法规则
                </span>
              </template>
            </el-popover>
          </div>

          <div class="border-t border-slate-100 pt-8 mt-4">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-base font-bold text-slate-800">常见面试问答</h3>
                <p class="text-xs text-slate-500 mt-0.5">该知识点下关联的典型面试题库</p>
              </div>
              <el-button
                  type="primary"
                  class="!rounded-full !px-5 !bg-indigo-600 hover:!bg-indigo-700 border-none shadow-md shadow-indigo-100"
                  @click="addInterviewItem"
              >
                + 新增问答
              </el-button>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div
                  v-for="(item, index) in formData.relatedQuestions"
                  :key="index"
                  class="group relative bg-slate-50 rounded-2xl border border-slate-200 p-5 transition-all duration-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div
                    class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    @click="formData.relatedQuestions.splice(index,1)"
                >
                  <div class="bg-red-500 text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>

                <div class="flex flex-col space-y-4">
                  <div class="flex items-center">
                    <span class="flex-none w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">Q</span>
                    <el-input
                        v-model="item.title"
                        placeholder="请输入面试题目"
                        variant="unstyled"
                        class="border-b border-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div class="flex items-start">
                    <span class="flex-none w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs mr-3">A</span>
                    <el-input
                        v-model="item.answer"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入参考回答内容"
                        class="!bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!formData.relatedQuestions?.length" class="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
              暂无面试问答，点击上方按钮开始添加
            </div>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="关联试题管理" name="questions">
        <DataTable
            :ref="questionSelectRef "
            :columns="questionColumns"
            :table-data="linkedQuestions"
            :show-search="false"
            :show-add="true"
            @add="openSelectQuestionDialog"
            :total="questionTotal"
            v-model:current-page="questionCurrentPage"
            v-model:page-size="questionPageSize"
        >
          <template #actions="{ row }">
            <el-button  type="danger"  size="small" link @click="removeQuestion(row.id)">取消关联</el-button>
          </template>
        </DataTable>
      </el-tab-pane>

      <el-tab-pane label="相关评论" name="comment">
        <DataTable
            :columns="commentColumns"
            :table-data="commentList"
            :show-search="false"
            :total="commentTotal"
            @page-change="getCommentsForAdmin"
            v-model:current-page="commentCurrentPage"
            v-model:page-size="commentPageSize"
        >
          <template #isVisible="{ value }">
            <el-tag :type="value === 0 ? 'success' : 'danger'" effect="light">
              {{ visibleMap[value] }}
            </el-tag>
          </template>

          <template #replyUserName = "{value}">
            <div class="line-clamp-2 break-words text-slate-700">
              {{value === null? '无' : value}}
            </div>
          </template>

          <template #actions="{ row }">
            <el-button v-if="row.isVisible === 1" link type="primary" size="small" @click="commentVisibleByAdmin(row)" >可见</el-button>
            <el-button v-else link type="danger" size="small" @click="commentUnVisibleByAdmin(row)" >不可见</el-button>
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
          @search="getAllQuestionForSelect"
          :total="questionSelectTotal"
          v-model:current-page="questionCurrentPage"
          v-model:page-size="questionPageSize"
      >
        <template #id="{ row }">
          <el-checkbox v-model="selectedIds" :label="row.id">{{ '' }}</el-checkbox>
        </template>
        <template #actions="{ row }">

          <el-button type="success" size="small" link @click="relateQ(row.id)">关联</el-button>
        </template>

      </DataTable>
      <template #footer>
        <el-button @click="selectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确认选择 ({{selectedIds.length}})</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="addPoint">保存全部</el-button>
    </template>
  </el-dialog>


</template>

<script setup>
import DataTable from "@/components/common/DataTable/index.vue";
import {onMounted, reactive, ref, watch} from "vue";
import 'md-editor-v3/lib/style.css'
import {
  add, commentsAdmin, commentUnVisible, commentVisible,
  deletePoint,
  getPageList,
  getPointDetail,
  questionList, relateQuestion, unRelateQuestion,
  update
} from "@/api/knowledgePoint/knowledgePoint.js";
import {ElMessage} from "element-plus";
import {getCommentForAdmin} from "@/api/blog/blog.js";
import {questionPageListForSelect} from "@/api/question/question.js";
import { MdEditor } from 'md-editor-v3'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const questionCurrentPage = ref(1)
const questionPageSize = ref(10)
const questionTotal = ref(0)

const questionSelectTotal = ref(0)

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
  { label: '推荐回答', prop: 'recommendedAnswer' ,width: '840'},
  { label: '问题数量', prop: 'relatedQuestions' ,width: '100'},
  { label: '难度', prop: 'level' },
  { label: '操作', prop: 'actions', width: '150' }
]

const commentColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '发布者名称', prop: 'userName' ,width: '100'},
  { label: '评论内容', prop: 'content' ,width: '640'},
  { label: '被回复者名称', prop: 'replyUserName' ,width: '100'},
  { label: '是否可见', prop: 'isVisible' ,width: '100'},
  { label: '操作', prop: 'actions', width: '150' }
]

const commentList = ref([])

const pointList = ref([])

const commentCurrentPage = ref(1)
const commentPageSize = ref(10)
const commentTotal = ref(0)


const visible = ref(false)
const MD_visible = ref(false)
const activeTab = ref('content')
const selectDialogVisible = ref(false)

const questionSelectRef = ref(null)

/**
 * 调用组件中的方法
 */
const questionSelectReset = () => {
  questionSelectRef.value?.resetSearch?.()
}

// 1. KnowledgePointDTO 数据
const formData = ref({
  title: '',
  recommendedAnswer: '',
  level: '',
  relatedQuestions: [], // InterviewQuestionsDTO 列表
})

const isDark = ref(false)

const theme = ref(isDark.value ? 'dark' : 'light')

watch(isDark, () => {
  theme.value = isDark.value ? 'dark' : 'light'
})

// ---------- 5. 工具栏 ----------
const toolbars = ref([
  'revoke',
  'next',
  '-',
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  'codeRow',
  'code',
  '-',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  0,
  1,
  2,
  '=',
  'save',
  'prettier',
  'pageFullscreen',
  'catalog',
  'preview',
  'previewOnly',
  'htmlPreview',
  'github'
])
const onUploadImg = async (files, callback) => {
  const formData = new FormData()
  formData.append('file', files[0])

  const res = await uploadBlogImage(formData)
  if (res.data.code === 200) {
    callback([
      `${import.meta.env.VITE_API_BASE_URL}user/getHead/${res.data.data}`
    ])
  }
}

// 2. 已关联的 QuestionDTO 列表
const linkedQuestions = ref([])

// 3. 试题选择池 (模拟数据)
const allQuestionPool = ref([
  { id: 1, questionText: 'Java 反射原理是什么？', questionType: '简答题', answer: ['...'] },
  { id: 2, questionText: 'Vue3 生命周期有哪些？', questionType: '多选题', answer: ['...'] }
])
const selectedIds = ref([])

const getAllQuestionForSelect = async(params) =>{
  const res = await questionPageListForSelect(
      params.currentPage,
      params.pageSize,
      params.questionType,
      params.keyword
  )
  if(res.data.code === 200 ){
    allQuestionPool.value = res.data.data.records
    questionSelectTotal.value = res.data.data.total
  }
}

// 表格列定义
const questionColumns = [
  { prop: 'id', label: '选择/ID', width: '80' },
  { prop: 'questionType', label: '类型', width: '100' },
  { prop: 'questionText', label: '试题内容' },
  { prop: 'actions', label: '操作', width: '120' }
]

const questionSearchSchema = [
  { prop: 'questionText', label: '内容关键字', type: 'input' },
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

// 逻辑操作
const addInterviewItem = () => formData.value.relatedQuestions.push({ title: '', answer: '' })

const openSelectQuestionDialog = () => {
  selectDialogVisible.value = true
}

const selectPointRow = ref({})

const confirmSelection = async() => {
  // 根据选中的 ID 过滤并同步到关联列表
  const res = await relateQuestion(selectPointRow.value.id,selectedIds.value)
  if(res.data.code === 200){
    questionSelectReset()
    const params = {
      currentPage:questionCurrentPage.value,
      pageSize: questionPageSize.value
    }
    await getAllQuestionForSelect(params)
  }
}

const removeQuestion = async(id) => {
  const res = await unRelateQuestion(id)
  if(res.data.code === 200 ){
    questionSelectReset()
    const params = {
      currentPage:questionCurrentPage.value,
      pageSize: questionPageSize.value
    }
    await getAllQuestionForSelect(params)
    const params2 = {
      knowledgePointId: selectPointRow.value.id,
      currentPage: questionCurrentPage.value,
      pageSize: questionPageSize.value
    }
    const resQ = await questionList(params2.knowledgePointId,params2.currentPage,params2.pageSize)
    if(resQ.data.code === 200){
      linkedQuestions.value = resQ.data.data.records
      questionTotal.value = resQ.data.data.total
    }else{
      ElMessage.error("网络繁忙")
    }
  }else{
    ElMessage.error("网络繁忙")
  }
}

const relateQ = async (id) => {
  console.info(selectPointRow.value)
  const res = await relateQuestion(selectPointRow.value.id,[id])
  if(res.data.code === 200){
    questionSelectReset()
    const params = {
      currentPage:questionCurrentPage.value,
      pageSize: questionPageSize.value
    }
    await getAllQuestionForSelect(params)

    const params2 = {
      knowledgePointId: selectPointRow.value.id,
      currentPage: questionCurrentPage.value,
      pageSize: questionPageSize.value
    }
    const resQ = await questionList(params2.knowledgePointId,params2.currentPage,params2.pageSize)
    if(resQ.data.code === 200){
      linkedQuestions.value = resQ.data.data.records
      questionTotal.value = resQ.data.data.total
    }else{
      ElMessage.error("网络繁忙")
    }
  }
}



const isEdit = ref(false)

const visibleMap={
  0:'可见',
  1:'不可见'
}

const openDetail = async(row) => {
  visible.value = true
  isEdit.value = true

  await getPointDetailInfo(row)
  selectPointRow.value = row
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

const getPageListPoint = async(params) => {
  let res = null
  try {
    res = await getPageList(
        params.currentPage,
        params.pageSize,
        params.baseId,
        params.level,
        params.tags,
        params.search
    )
  } catch (e) {
    ElMessage.error("网络繁忙")
    return
  }
  if(res.data.code === 200){
    total.value = res.data.data.total
    pointList.value = res.data.data.records
  }else{
    ElMessage.error("网络繁忙")
  }
}

const knowledgePointId = ref(0)

const getPointDetailInfo = async(row) => {
  const res = await getPointDetail(row.id)
  if(res.data.code === 200){
    formData.value = res.data.data
  }else{
    ElMessage.error('网络繁忙')
    return
  }
  knowledgePointId.value = row.id
  const params = {
    knowledgePointId: row.id,
    currentPage: questionCurrentPage.value,
    pageSize: questionPageSize.value
  }
  const resQ = await questionList(params.knowledgePointId,params.currentPage,params.pageSize)
  if(resQ.data.code === 200){
    linkedQuestions.value = resQ.data.data.records
    questionTotal.value = resQ.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }

  knowledgePointId.value = row.id
  const commentParams = {
    knowledgePointId: row.id,
    currentPage: commentCurrentPage.value,
    pageSize: commentPageSize.value
  }

  await getCommentsForAdmin(commentParams)

  questionCurrentPage.value = 1;
  questionPageSize.value = 10

  const params2 = {
    currentPage:1,
    pageSize: 10
  }
  await getAllQuestionForSelect(params2)

}

const addPoint = async()=> {
  let res = null;
  if(formData.value.id === null || formData.value.id === undefined){
    res =  await add(formData.value);
  }else{
    res =  await update(formData.value);
  }
  if(res.data.code === 200){
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
    await getPageListPoint(params)
    ElMessage.success("添加成功")
  }else{
    ElMessage.error("网络繁忙")
  }
}




const deleteKnowledgePoint = async (row) => {
  const data = [row.id]
  const res = await deletePoint(data)
  if(res.data.code === 200 ){
    const params = {
      currentPage: 1,
      pageSize: 10
    }
    await getPageListPoint(params)
  }else{
    ElMessage.error("网络繁忙")
  }
}

/**
 * 获取给admin获取评论信息
 * @param params
 * @returns {Promise<void>}
 */
const getCommentsForAdmin = async(params) => {
  const res = await commentsAdmin(
      knowledgePointId.value,
      params.userName,
      params.replyCommentId,
      params.currentPage,
      params.pageSize
  )
  if(res.data.code === 200 ){
    commentList.value = res.data.data.records;
    commentTotal.value = res.data.data.total;
  }else{
    ElMessage.error("网络繁忙")
  }
}

/**
 * 获取给admin获取评论信息
 * @param params
 * @returns {Promise<void>}
 */
const commentVisibleByAdmin = async(row) => {
  const res =  await commentVisible(row.id)
  if(res.data.code === 200 ){
    const commentParams = {
      knowledgePointId: row.id,
      currentPage: commentCurrentPage.value,
      pageSize: commentPageSize.value
    }
    await getCommentsForAdmin(commentParams)
  }else{
    ElMessage.error("网络繁忙")
  }
}

/**
 * 获取给admin获取评论信息
 * @param params
 * @returns {Promise<void>}
 */
const commentUnVisibleByAdmin = async(row) => {
  const res =  await commentUnVisible(row.id)
  if(res.data.code === 200 ){
    const commentParams = {
      knowledgePointId: row.id,
      currentPage: commentCurrentPage.value,
      pageSize: commentPageSize.value
    }
    await getCommentsForAdmin(commentParams)
  }else{
    ElMessage.error("网络繁忙")
  }
}

onMounted(async() => {
  const params = {
    currentPage: 1,
    pageSize: 10
  }
  await getPageListPoint(params)
})

</script>

<style scoped>

</style>