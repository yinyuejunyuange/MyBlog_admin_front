<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="myTableColumns"
      :table-data="listData"
      @search="onSearch"
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
      <el-button link type="primary" size="small" @click="openDialog">详情</el-button>
      <el-button v-if="row.status === 4" link type="success" size="small">解封</el-button>
      <el-button v-else-if="row.status === 3" link type="danger" size="small">封禁</el-button>
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
                {{ type }}
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
import {nextTick, ref, watch} from 'vue'
import DataTable from "@/components/common/DataTable/index.vue"
import { MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { ArrowLeft, Calendar, ChatDotRound, Share } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

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
  {
    id: 1,
    title: '2026前端开发趋势深度分析',
    userName: '前端老周',
    userId: 'user_89757',
    introduce: '本文详细解读了2026年前端领域的核心技术趋势，包括AI辅助开发、跨端框架演进、Web性能优化等核心方向',
    commentNum: 128,
    status: 1,
  },
  {
    id: 2,
    title: 'Vue3+Vite企业级项目架构设计',
    userName: 'Vue技术控',
    userId: 'user_78921',
    introduce: '分享大型Vue3项目的架构设计思路，涵盖代码规范、状态管理、路由设计、权限控制等核心要点',
    commentNum: 89,
    status: 1,
  },
  {
    id: 3,
    title: 'JavaScript高级语法实战技巧',
    userName: 'JS编程手札',
    userId: 'user_65432',
    introduce: '从实际开发场景出发，讲解ES6+语法的高效运用，解决日常开发中的异步处理、数据处理等常见痛点',
    commentNum: 205,
    status: 2,
  },
  {
    id: 4,
    title: '前端性能优化的10个实用方法',
    userName: '性能优化师',
    userId: 'user_98765',
    introduce: '结合实战案例，分享可落地的前端性能优化方案，让页面加载速度提升50%以上，提升用户体验',
    commentNum: 156,
    status: 4,
  },
  {
    id: 5,
    title: 'TypeScript类型编程入门到精通',
    userName: 'TS进阶之路',
    userId: 'user_54321',
    introduce: '系统讲解TypeScript类型系统，从基础类型到高级类型编程，提升代码健壮性和可维护性',
    commentNum: 112,
    status: 4,
  },
  {
    id: 6,
    title: 'React Server Components实践指南',
    userName: 'React开发者',
    userId: 'user_45678',
    introduce: '深入解析React服务端组件的原理与使用场景，对比传统客户端组件的优劣，适配大型项目开发',
    commentNum: 97,
    status: 3,
  }
])

const statusMap = {
  1: "保存中",
  2: "发布",
  3: "审核中",
  4: "禁止查看"
}

const mdPreviewDialogVisible = ref(false)

const previewContent = ref(`
# Element Plus 组件使用指南 🚀
## 1. 基础介绍
Element Plus 是基于 Vue 3 的桌面端 UI 组件库，适配 TypeScript 和 Composition API，以下是核心组件的使用示例。

## 2. 常用组件示例
### 2.1 弹窗（Dialog）
\`\`\`vue
<template>
  <el-button type="primary" @click="dialogVisible = true">打开弹窗</el-button>
  <el-dialog v-model="dialogVisible" title="示例弹窗" width="500px">
    <p>这是 Element Plus 弹窗的核心用法</p>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const dialogVisible = ref(false)

\`\`\`

### 2.2 表格（Table）
| 组件名 | 用途 | 难度 |
|--------|------|------|
| ElDialog | 模态弹窗 | ⭐⭐ |
| ElTable | 数据展示 | ⭐⭐⭐ |
| ElForm | 表单提交 | ⭐⭐⭐ |

## 3. 核心特性
- 支持 Vue 3 Composition API
- 全面适配 TypeScript
- 丰富的内置组件（50+）
- 支持按需引入，减小打包体积

## 4. 注意事项
> ⚠️ 注意：Element Plus 仅支持 Vue 3，Vue 2 项目请使用 Element UI。

## 5. 资源链接
- 官方文档：[Element Plus 官网](https://element-plus.org/zh-CN/)
- GitHub 仓库：[element-plus/element-plus](https://github.com/element-plus/element-plus)
## 6. 强调文本
- 这是**加粗文本**
- 这是*斜体文本*
- 这是~~删除线文本~~

## 7. 图片示例（占位图）
![Element Plus 图标](https://element-plus.org/images/element-plus-logo.svg)
`)
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

const previewBlog = (row) => {
  previewRow.value = row
  console.info(previewRow.value)

  mdPreviewDialogVisible.value = true;
}

const openDialog = () => {
  visible.value = true
}

const blogData = ref({
  id: "202049178921",
  userId: "2029371637193",
  userName: "vertin",
  title: "java后端解密",
  introduce: " 后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘后端揭秘",
  typeList: [
      "JAVA",
      "后端",
      "后端",
      "后端",
      "后端",
      "后端",
      "后端"
  ],
  publishTime: '',
  updateTime: ' ',
  star: "12",
  kudos: '132 ',
  watch:'124',
  commentNum:'123'
})
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

const onSearch = (params) => {

}
</script>

<style scoped>

</style>