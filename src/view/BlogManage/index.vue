<template>
  <DataTable
      ref="dataTableRef"
      :search-schema="mySearchConfig"
      :columns="myTableColumns"
      :table-data="listData"
      :total="total"
      @search="getBlogsForAdmin"
      v-model:current-page="currentPage"
      @page-change="getBlogsForAdmin"
      v-model:page-size="pageSize"
  >

    <template #title = "{value}">
      <div class="line-clamp-2 break-words text-slate-700">
        {{value}}
      </div>
    </template>
    <template #authorName = "{value}">
      <div class="line-clamp-2 break-words text-slate-700">
        {{value}}
      </div>
    </template>
    <template #introduce = "{value}">
      <div class="line-clamp-2 break-words text-slate-700">
        {{value}}
      </div>
    </template>

    <template #status="{ value }">
      <el-tag :type="value === 4 ? 'danger' : 'success'" effect="light">
        {{ statusMap[value] }}
      </el-tag>
    </template>
    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="previewBlog(row)">博客预览</el-button>
      <el-button link type="primary" size="small" @click="openDialog(row)">详情</el-button>
      <el-button v-if="row.status === 4" link type="success" size="small" @click="unFreezeBlog(row)">解封</el-button>
      <el-button v-else-if="row.status === 2" link type="danger" size="small" @click="freezeBlog(row)">封禁</el-button>
    </template>
  </DataTable>

  <el-dialog
      v-model="mdPreviewDialogVisible"
      title="博客预览"
      width="1000px"
  >
    <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div class="max-w-5xl mx-auto space-y-6">

        <div class="glass-card p-8">
          <div class="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6">
            <div class="flex items-center gap-2">
              <el-avatar :size="24" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <span class="font-medium text-slate-700">{{ previewRow.userName }}</span>
            </div>
<!--            <div class="flex items-center gap-1">-->
<!--              <el-icon><Calendar /></el-icon>-->
<!--              <span>发布于 {{ blogComment.createTime }}</span>-->
<!--            </div>-->
            <div class="flex items-center gap-1">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ previewRow.commentNum }} 条评论</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-8">
            <el-tag
                v-for="tag in previewRow.typeList"
                :key="tag"
                effect="light"
                round
                class="border-none bg-indigo-50 text-indigo-600 font-medium"
            >
              # {{ tag }}
            </el-tag>
          </div>

          <div v-if="previewRow.introduce" class="relative p-4 bg-slate-50/80 rounded-xl border-l-4 border-indigo-400 italic text-slate-600 mb-8">
            {{ previewRow.introduce }}
          </div>

          <div class="preview-wrapper rounded-2xl overflow-hidden border border-slate-100">
            <MdPreview
                :modelValue="previewContent"
                previewTheme="github"
                codeTheme="atom"
            />
          </div>
        </div>

        <div class="text-center py-8 text-slate-400 text-xs tracking-widest">
          --- 预  览  结  束 ---
        </div>
      </div>
    </div>
  </el-dialog>

  <el-dialog
      v-model="visible"
      title="博客详情数据统计"
      width="80%"
      destroy-on-close
      align-center
      class="glass-dialog"
  >
    <div class="p-2 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

      <div class="glass-card-inner p-6">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          <span class="font-bold text-slate-700">基础信息</span>
        </div>

        <el-form label-position="top" class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          <el-form-item label="文章标题" class="md:col-span-3">
            <div class="text-lg font-semibold text-slate-800 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {{ blogData.title }}
            </div>
          </el-form-item>

          <el-form-item label="作者信息">
            <div class="flex items-center gap-2">
              <el-avatar :size="24" class="bg-indigo-100 text-indigo-600"> {{ blogData.userName?.charAt(0) }} </el-avatar>
              <span class="text-slate-600">{{ blogData.userName }} <small class="text-slate-400">(ID: {{ blogData.userId }})</small></span>
            </div>
          </el-form-item>

          <el-form-item label="发布时间">
            <span class="text-slate-600">{{ formatDate(blogData.publishTime) }}</span>
          </el-form-item>

          <el-form-item label="更新时间">
            <span class="text-slate-400 text-sm">{{ formatDate(blogData.updateTime) }}</span>
          </el-form-item>

          <el-form-item label="文章分类" class="md:col-span-3">
            <div class="flex flex-wrap gap-2">
              <el-tag
                  v-for="type in blogData.typeList"
                  :key="type"
                  effect="light"
                  round
                  class="border-none bg-indigo-50 text-indigo-600"
              >
                {{ type.label }}
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item label="文章简介" class="md:col-span-3">
            <p class="text-slate-500 text-sm leading-relaxed bg-white/40 p-4 rounded-xl italic">
              " {{ blogData.introduce || '暂无简介' }} "
            </p>
          </el-form-item>
        </el-form>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card-inner p-4 text-center">
          <div class="text-xs text-slate-400 mb-1">阅读量</div>
          <div class="text-xl font-bold text-slate-700">{{ blogData.watch }}</div>
        </div>
        <div class="glass-card-inner p-4 text-center">
          <div class="text-xs text-slate-400 mb-1">点赞数</div>
          <div class="text-xl font-bold text-indigo-500">{{ blogData.kudos }}</div>
        </div>
        <div class="glass-card-inner p-4 text-center">
          <div class="text-xs text-slate-400 mb-1">收藏数</div>
          <div class="text-xl font-bold text-amber-500">{{ blogData.star }}</div>
        </div>
        <div class="glass-card-inner p-4 text-center">
          <div class="text-xs text-slate-400 mb-1">评论数</div>
          <div class="text-xl font-bold text-emerald-500">{{ blogData.commentNum }}</div>
        </div>
      </div>

      <div class="glass-card-inner p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            <span class="font-bold text-slate-700">近12个月互动趋势</span>
          </div>
          <div class="text-xs text-slate-400 italic">数据更新至当前月份</div>
        </div>

        <div ref="behaviorChartRef" class="w-full h-[400px]"></div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button round @click="visible = false">关闭窗口</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup>
import {nextTick, onMounted, ref, watch} from 'vue'
import DataTable from "@/components/common/DataTable/index.vue"
import { MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { ArrowLeft, Calendar, ChatDotRound, Share } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {blogsForAdmin, monthlyBehaviorTrend, readBlog, updateBlogStatus} from "@/api/blog/blog.js";
import {ElMessage} from "element-plus";

// 1. 定义搜索框配置
const mySearchConfig = [
  { label: '博客名称', prop: 'blogName', type: 'input', placeholder: '搜索关键词...' },
  {
    label: '作者名称',
    prop: 'authorName',
    type: 'input',
    placeholder: '搜索关键词...'
  },
  { label: '开始日期', prop: 'startDate', type: 'date' },
  { label: '结束日期', prop: 'endDate', type: 'date' },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '保存中', value: 1 },
      { label: '已发布', value: 3 },
      { label: '封禁', value: 4 },
    ]
  },
]

// 2. 定义表格列配置
const myTableColumns = [
  { label: '标题', prop: 'title', width: '150' },
  { label: '作者名称', prop: 'userName', width: '100' },
  { label: '简介', prop: 'introduce',width: '750' },
  { label: '评论数量', prop: 'commentNum' }, // 对应插槽 #status
  { label: '状态', prop: 'status' }, // 对应插槽 #status
  { label: '操作', prop: 'actions', width: '150' } // 对应插槽 #actions
]

// 3. 模拟数据
const listData = ref([
])

const total = ref(0)

const statusMap = {
  1: "保存中",
  2: "发布",
  3: "审核中",
  4: "禁止查看"
}

const mdPreviewDialogVisible = ref(false)

const previewContent = ref("")
const previewRow = ref({})

const behaviorData = ref([
  {
    month: '2026-01',
    viewCount: 15890,
    likeCount: 2350,
    commentCount: 489,
    collectCount: 890,
    shareCount: 320
  },
  {
    month: '2026-02',
    viewCount: 18920,
    likeCount: 2870,
    commentCount: 567,
    collectCount: 987,
    shareCount: 450
  },
  {
    month: '2026-03',
    viewCount: 21560,
    likeCount: 3210,
    commentCount: 689,
    collectCount: 1250,
    shareCount: 580
  },
  {
    month: '2026-04',
    viewCount: 19870,
    likeCount: 2980,
    commentCount: 612,
    collectCount: 1120,
    shareCount: 490
  },
  {
    month: '2026-05',
    viewCount: 23450,
    likeCount: 3560,
    commentCount: 789,
    collectCount: 1450,
    shareCount: 670
  },
  {
    month: '2026-06',
    viewCount: 25680,
    likeCount: 4120,
    commentCount: 890,
    collectCount: 1680,
    shareCount: 780
  }
])

const behaviorChartRef = ref(null)
let myChart = null

// 初始化图表逻辑
const initChart = () => {
  if (!behaviorChartRef.value) return
  if (myChart) myChart.dispose()

  myChart = echarts.init(behaviorChartRef.value)

  const months = behaviorData.value.map(item => item.month)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.1)',
      textStyle: { color: '#64748b' }
    },
    legend: {
      data: ['阅读量', '点赞量', '收藏量', '评论量'],
      bottom: 0,
      icon: 'circle'
    },
    grid: { top: '10%', left: '3%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }
    },
    series: [
      {
        name: '阅读量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: behaviorData.value.map(item => item.viewCount),
        lineStyle: { width: 3, color: '#3b82f6' },
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59, 130, 246, 0.1)' }, { offset: 1, color: 'transparent' }]) }
      },
      {
        name: '点赞量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: behaviorData.value.map(item => item.likeCount),
        lineStyle: { width: 3, color: '#f43f5e' },
        itemStyle: { color: '#f43f5e' }
      },
      {
        name: '收藏量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: behaviorData.value.map(item => item.collectCount),
        lineStyle: { width: 3, color: '#f59e0b' },
        itemStyle: { color: '#f59e0b' }
      },
      {
        name: '评论量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: behaviorData.value.map(item => item.commentCount),
        lineStyle: { width: 3, color: '#10b981' },
        itemStyle: { color: '#10b981' }
      }
    ]
  }

  myChart.setOption(option)
}

const visible = ref(false)

// 监听弹窗打开，初始化图表
watch(visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initChart()
    })
  }
})

const previewBlog = async(row) => {
  previewRow.value = row
  console.info(previewRow.value)
  await readBlogById(row)
  mdPreviewDialogVisible.value = true;
}

const openDialog = async(row) => {
  await getBlogDetailById(row)
  await getMonthlyBehaviorTrend(row)
  visible.value = true
}

const blogData = ref({})

const currentPage = ref(1)

const pageSize = ref(10)

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

const getBlogsForAdmin= async(params) =>{

  console.info(params)

  const res=  await blogsForAdmin(params.blogName, params.authorName,params.startDate, params.endDate , params.status, params.currentPage, params.pageSize);
  if(res.data.code === 200){
    listData.value = res.data.data.pageList
    total.value = res.data.data.total
  }
}

const readBlogById = async(row) => {
  const res = await readBlog(row.id)
  if(res.data.code === 200){
    previewContent.value = res.data.data.context
  }else{
    ElMessage.error("网络繁忙")
  }
}

const getBlogDetailById = async(row) =>{
  const res = await readBlog(row.id)
  if(res.data.code === 200){
    blogData.value = res.data.data
  }else{
    ElMessage.error("网络繁忙")
  }
}

const getMonthlyBehaviorTrend = async(row) => {
  const res = await monthlyBehaviorTrend(row.id)
  if(res.data.code === 200){
    behaviorData.value = res.data.data
  }else{
    ElMessage.error("网络繁忙")
  }
}

const freezeBlog = async(row) => {
  const res = await updateBlogStatus(row.id,4)
  if(res.data.code === 200 ){
    await onSearch()
   //await getBlogsForAdmin({currentPage:currentPage.value, pageSize: pageSize.value})
  }else{
    ElMessage.error("网络繁忙")
  }
}

const unFreezeBlog = async(row) => {
  const res = await updateBlogStatus(row.id,2)
  if(res.data.code === 200 ){
    await onSearch()
    // await getBlogsForAdmin({currentPage: currentPage.value, pageSize: pageSize.value})
  }else{
    ElMessage.error("网络繁忙")
  }
}

const onSearch = async() => {
  await dataTableRef.value?.handleSearch()
}

const dataTableRef = ref(null)



onMounted(async() => {
  const params= {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  }
  await getBlogsForAdmin(params)
})

</script>

<style scoped>

</style>