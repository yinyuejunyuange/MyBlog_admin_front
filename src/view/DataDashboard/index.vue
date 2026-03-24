<template>
  <div class="h-full overflow-y-auto custom-scrollbar pr-2 ">
    <div class="text-xl font-bold text-slate-800 flex items-center gap-2">
      👋 中午好，xbbroot
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      <div class="glass-card p-5 relative overflow-hidden">
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-xs font-medium text-slate-500 tracking-wider">博客数量</p>
            <h3 class="text-2xl font-bold mt-2 text-slate-800">{{ statData.blogs ?? 0 }}</h3>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <el-icon :size="20"><Document /></el-icon>
          </div>
        </div>
        <div class="mt-6 h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
          <div class="bg-blue-500 h-full w-3/4 rounded-full"></div>
        </div>
      </div>

      <div class="glass-card p-5 relative overflow-hidden">
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-xs font-medium text-slate-500 tracking-wider">用户数量</p>
            <h3 class="text-2xl font-bold mt-2 text-slate-800">{{ statData.users ?? 0 }}</h3>
          </div>
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
            <el-icon :size="20"><User /></el-icon>
          </div>
        </div>
        <div class="mt-6 h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
          <div class="bg-indigo-500 h-full w-1/2 rounded-full"></div>
        </div>
      </div>

      <div class="glass-card p-5 relative overflow-hidden">
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-xs font-medium text-slate-500 tracking-wider">评论数量</p>
            <h3 class="text-2xl font-bold mt-2 text-slate-800">{{ statData.comments ?? 0 }}</h3>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <el-icon :size="20"><ChatDotRound /></el-icon>
          </div>
        </div>
        <div class="mt-6 h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
          <div class="bg-emerald-500 h-full w-2/3 rounded-full"></div>
        </div>
      </div>

      <div class="glass-card p-5 relative overflow-hidden">
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-xs font-medium text-slate-500 tracking-wider">知识点数量</p>
            <h3 class="text-2xl font-bold mt-2 text-slate-800">{{ statData.knowledgePoints ?? 0 }}</h3>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
            <el-icon :size="20"><CollectionTag /></el-icon>
          </div>
        </div>
        <div class="mt-6 h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full w-2/5 rounded-full"></div>
        </div>
      </div>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-2  gap-6">

      <div class="glass-card p-6 h-80 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-blue-500 rounded-full"></div>
            <span class="font-bold text-slate-700">博客新增趋势</span>
          </div>
          <span class="text-xs text-slate-400">近12个月</span>
        </div>
        <div ref="blogChartRef" class="w-full flex-1 min-h-0"></div>
      </div>

      <div class="glass-card p-6 h-80 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
            <span class="font-bold text-slate-700">用户新增趋势</span>
          </div>
          <span class="text-xs text-slate-400">近12个月</span>
        </div>
        <div ref="userChartRef" class="w-full flex-1 min-h-0"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div class="lg:col-span-2 glass-card p-6 flex flex-col min-h-[400px]">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
          <span class="font-bold text-slate-700 text-lg">数据概览列表</span>
        </div>

        <div class="grid grid-cols-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/50">
          <div>项目名称</div>
          <div class="text-center">知识点数</div>
          <div class="text-center">题目数量</div>
          <div class="text-right">模拟面试</div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar mt-2 max-h-[400px]">
          <div
              v-for="(item, index) in baseList"
              :key="index"
              class="grid grid-cols-4 px-4 py-4 items-center hover:bg-white/40 transition-colors rounded-xl mb-1 group"
          >
            <div class="font-medium text-slate-700 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors"></span>
              {{ item.baseName ?? 0 }}
            </div>
            <div class="text-center text-slate-600 font-mono">{{ item.pointsNum ?? 0 }}</div>
            <div class="text-center text-slate-600 font-mono">{{ item.questions ?? 0 }}</div>
            <div class="text-right">
            <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold shadow-sm">
              {{ item.interviewNum ?? 0 }} 次
            </span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card p-6 flex flex-col min-h-[400px]">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
          <span class="font-bold text-slate-700 text-lg">博客类别分布</span>
        </div>
        <div ref="pieChartRef" class="w-full flex-1 min-h-0"></div>
      </div>

    </div>
  </div>
</template>
<script setup >
import {Wallet} from "@element-plus/icons-vue";
import {onMounted, reactive, ref} from 'vue'
import { Document, User, ChatDotRound, CollectionTag } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {blog12Month, blogTypeDashboard, getDashboard, knowledgeDashboard, user12Month} from "@/api/admin/admin.js";
import {ElMessage} from "element-plus";

// 这里的结构对应你后端的 Java 实体类
const statData = ref({
  blogs: 0,
  users: 0,
  comments: 0,
  knowledgePoints: 0
})

const blogChartRef = ref(null)
const userChartRef = ref(null)
const pieChartRef = ref(null)


const getLineChartOption = (dataX, dataY, color, areaColor) => ({
  grid: {
    top: '10%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true // 包含坐标轴标签在内
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e2e8f0',
    textStyle: { color: '#64748b' }
  },
  xAxis: {
    type: 'category',
    data: dataX,
    axisLine: { lineStyle: { color: '#e2e8f0' } }, // 轴线颜色
    axisLabel: { color: '#94a3b8', fontSize: 11 } // 标签颜色
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, // 网格线
    axisLabel: { color: '#94a3b8' }
  },
  series: [{
    data: dataY,
    type: 'line',
    smooth: true, // 平滑曲线
    symbol: 'none', // 不显示数据点
    lineStyle: { width: 3, color: color }, // 折线样式
    areaStyle: { // 区域填充渐变色
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: areaColor },
        { offset: 1, color: 'rgba(255, 255, 255, 0)' }
      ])
    }
  }]
})

const blogData  = ref({

})

const userData = ref({

})

const baseList =  ref([

])

const blogTypeData  = ref ([])

onMounted(async() => {

  await loadDashboardInfo()

  await getBlog12Month()

  await getUser12Month()

  await getKnowledgeDashboard()

  await getBlogTypeDashboard()

  // 初始化博客图表
  const blogChart = echarts.init(blogChartRef.value)
  blogChart.setOption(getLineChartOption(
      blogData.value.monthList,
      blogData.value.blogCountList,
      '#3b82f6', // 蓝色
      'rgba(59, 130, 246, 0.2)'
  ))

  // 初始化用户图表
  const userChart = echarts.init(userChartRef.value)
  userChart.setOption(getLineChartOption(
      userData.value.monthList,
      userData.value.userCountList,
      '#6366f1', // 靛蓝色
      'rgba(99, 102, 241, 0.2)'
  ))

  const pieChart = echarts.init(pieChartRef.value)

  // 将 BlogTypeVO 转换为 ECharts 需要的格式
  const formattedData = blogTypeData.value.map(item => ({
    name: item.blogType,
    value: item.num
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      textStyle: { color: '#64748b' }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#94a3b8', fontSize: 11 }
    },
    series: [
      {
        name: '博客类别',
        type: 'pie',
        radius: ['45%', '70%'], // 环形图效果
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'rgba(255,255,255,0.5)',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: formattedData,
        // 使用你喜欢的淡雅配色方案
        color: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#94a3b8']
      }
    ]
  }

  pieChart.setOption(option)

  // 监听窗口大小变化，自动重绘
  window.addEventListener('resize', () => {
    blogChart.resize()
    userChart.resize()
    pieChart.resize()
  })
})


const loadDashboardInfo= async() => {
  const res =  await getDashboard()
  if(res.data.code === 200){
    statData.value = res.data.data
  }else{
    ElMessage.error("网络异常")
  }
}

const getBlog12Month =async () => {
  const res = await blog12Month()
  if(res.data.code === 200){
    blogData.value = res.data.data
  }else{
    ElMessage.error("网络异常")
  }
}

const getUser12Month =async () => {
  const res = await user12Month()
  if(res.data.code === 200){
    userData.value = res.data.data
  }else{
    ElMessage.error("网络异常")
  }
}

const getKnowledgeDashboard =async () => {
  const res = await knowledgeDashboard()
  if(res.data.code === 200){
    baseList.value = res.data.data
  }else{
    ElMessage.error("网络异常")
  }
}

const getBlogTypeDashboard =async () => {
  const res = await blogTypeDashboard()
  if(res.data.code === 200){
    blogTypeData.value = res.data.data
  }else{
    ElMessage.error("网络异常")
  }
}


</script>

<style scoped>
/* 玻璃拟态核心样式 */
.glass-card {
  /* 半透明背景 */
  background: rgba(255, 255, 255, 0.6);
  /* 模糊滤镜 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  /* 柔和边框线 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.25rem;
  /* 深度感阴影 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* 鼠标悬停时的微互动 */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>