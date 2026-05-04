<template>
  <div class="p-6">
    <DataTable
        :search-schema="mySearchConfig"
        :columns="myTableColumns"
        :table-data="listData"
        @search="getUsersForAdmin"
        @page-change="getUsersForAdmin"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :total="total"
        ref="dataTableRef"
    >

      <template #userHead="{ value }">
        <el-avatar :size="28" :src=" imagePrefix+ value" />
      </template>

      <template #createTime="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #blogCount="{ value }">
        {{ value ?? 0 }}
      </template>

      <template #isUserFreeze="{ value }">
        <el-tag :type="value === 0 ? 'success' : 'danger'" effect="light">
          {{ statusMap[value] }}
        </el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="openDetail(row)">详情</el-button>
        <el-button v-if="row.isUserFreeze === 0" link type="danger" size="small" @click="freezeUserByUserId(row)">冻结</el-button>
        <el-button v-else-if="row.isUserFreeze === 1" link type="danger" size="small" @click="unFreezeUserByUserId(row)" >解冻</el-button>
      </template>
    </DataTable>
  </div>

  <el-dialog
      v-model="userVisible"
      title="用户详情"
      width="70%"
      destroy-on-close
      align-center
      class="glass-dialog"
  >
    <div class="p-4 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">

      <div class="glass-card-inner p-8 flex flex-col md:flex-row gap-8 items-center">
        <div class="relative">
          <el-avatar :size="100" :src=" imagePrefix+ userDetail.userHead" class="shadow-xl border-4 border-white" />
          <div
              v-if="userDetail.isUserFreeze === 1"
              class="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full shadow-lg"
          >
            已封禁
          </div>
        </div>

        <div class="flex-1 text-center md:text-left space-y-2">
          <div class="flex items-center justify-center md:justify-start gap-3">
            <h2 class="text-2xl font-bold text-slate-800">{{ userDetail.userName }}</h2>
            <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {{ userDetail.id }}</span>
          </div>
          <p class="text-slate-500 italic text-sm">“ {{ userDetail.introduction || '这个用户很懒，什么都没有留下' }} ”</p>
          <div class="text-xs text-slate-400">
            注册时间：{{ formatDate(userDetail.createTime) }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card-inner p-5 flex flex-col items-center justify-center border-b-2 border-blue-400">
          <div class="text-blue-500 mb-1"><i class="el-icon-document"></i> 创作总量</div>
          <div class="text-2xl font-bold text-slate-700">{{ userDetail.blogCount??0 }}</div>
        </div>

        <div class="glass-card-inner p-5 flex flex-col items-center justify-center border-b-2 border-indigo-400">
          <div class="text-indigo-500 mb-1">社交互动</div>
          <div class="text-2xl font-bold text-slate-700">{{ userDetail.comRepCount??0 }}</div>
        </div>

        <div class="glass-card-inner p-5 flex flex-col items-center justify-center border-b-2 border-orange-400">
          <div class="text-orange-500 mb-1">违规次数</div>
          <div class="text-2xl font-bold text-slate-700">{{ userDetail.toxicCount??0 }}</div>
        </div>

        <div class="glass-card-inner p-5 flex flex-col items-center justify-center border-b-2"
             :class="userDetail.toxicRate > 5 ? 'border-red-400' : 'border-emerald-400'">
          <div :class="userDetail.toxicRate > 5 ? 'text-red-500' : 'text-emerald-500'" class="mb-1">内容违规率</div>
          <div class="text-2xl font-bold text-slate-700">{{ userDetail.toxicRate??0 }}%</div>
        </div>
      </div>

      <div class="glass-card-inner p-6">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
          <span class="font-bold text-slate-700">近12个月作品发布情况</span>
        </div>
        <div ref="userCreationChartRef" class="w-full h-[320px]"></div>
      </div>

      <div class="glass-card-inner p-6">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
          <span class="font-bold text-slate-700">用户的攻击性评论</span>
        </div>
        <DataTable
            :show-search="false"
            :show-page="false"
            :columns="comRepColumns"
            :table-data="comRepList"
        >

          <template #isVisible="{ value }">
            <el-tag :type="value === 1 ? 'success' : 'danger'" effect="light">
              {{ visibleMap[value] }}
            </el-tag>
          </template>

          <template #isToxic="{ value }">
            <el-tag :type="value === 0 ? 'success' : value === 1? 'warning':'danger' " effect="light">
              {{ toxicMap[value] }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <el-button link type="primary" size="small" @click="openEditToxic(row)">修改</el-button>
            <el-button v-if="row.isVisible === 0" link type="danger" size="small">可见</el-button>
            <el-button v-else-if="row.isVisible === 1" link type="danger" size="small">不可见</el-button>
          </template>
        </DataTable>
      </div>

    </div>

    <template #footer>
      <div class="flex justify-end gap-3 px-4">
        <el-button round @click="userVisible = false">关闭</el-button>
        <el-button
            v-if="userDetail.isUserFreeze === 0"
            type="danger"
            plain
            round
            @click="freezeUserByUserIdForDetail(userDetail)"
        >
          冻结账号
        </el-button>
        <el-button
            v-else
            type="success"
            plain
            round
            @click="unFreezeUserByUserIdForDetail(userDetail)"
        >
          解封账号
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="editToxicVisible"
      title="人工审核：攻击性判定"
      width="450px"
      append-to-body
      class="glass-dialog-inner"
  >
    <div class="p-2">
      <el-form :model="toxicForm" label-position="top">

        <el-form-item label="违规等级判定">
          <el-radio-group v-model="toxicForm.isToxic" class="grid grid-cols-3 gap-2 w-full">
            <el-radio-button :label="0">无风险</el-radio-button>
            <el-radio-button :label="1">冒犯性</el-radio-button>
            <el-radio-button :label="2">攻击性</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-collapse-transition>
          <el-form-item v-if="toxicForm.isToxic > 0" label="违规类别 (可多选)" class="mt-4">
            <div class="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <el-checkbox-group v-model="selectedMulTypes">
                <div class="grid grid-cols-2 gap-y-3">
                  <el-checkbox label="人身攻击" />
                  <el-checkbox label="地域歧视" />
                  <el-checkbox label="种族歧视" />
                  <el-checkbox label="其他" />
                </div>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-collapse-transition>
      </el-form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button round @click="editToxicVisible = false">取消</el-button>
        <el-button type="primary" round class="bg-indigo-500 border-none px-6" @click="submitToxicEdit">
          确认修改
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="freezeDialogVisible"
      title="账号冻结处理"
      width="400px"
      append-to-body
  >
    <div class="p-4">
      <el-form label-position="top">
        <el-form-item label="请选择冻结时长">
          <el-radio-group v-model="freezeDuration" >
            <el-radio :label="1">冻结 1 小时</el-radio>
            <el-radio :label="2">冻结 1 周 (168小时)</el-radio>
            <el-radio :label="3">冻结 1 个月 (720小时)</el-radio>
            <el-radio >永久封禁 (不定时)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="冻结原因" required>
          <el-input
              v-model="freezeReason"
              type="textarea"
              :rows="3"
              placeholder="请输入违规详情（如：发布垃圾广告、言语攻击等）"
              maxlength="200"
              show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="freezeDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmFreeze">确认冻结</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>

import {ref, nextTick, onMounted} from 'vue'
import * as echarts from 'echarts';
import DataTable from "@/components/common/DataTable/index.vue"
import {ElMessage} from "element-plus";
import {freezeUser, getUserDetail, unFreezeUser, usersForAdmin} from "@/api/user/user.js";
import {updateCommentToxic, updateReplyToxic} from "@/api/blog/blog.js";

const currentPage = ref(1);
const pageSize = ref(10)
const total = ref(0)
// 1. 定义搜索框配置
const mySearchConfig = [
  { label: '用户名称', prop: 'userName', type: 'input', placeholder: '搜索关键词...' },
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

// 2. 定义表格列配置
const myTableColumns = [
  { label: '用户名', prop: 'userName' },
  { label: '用户头像', prop: 'userHead' ,width: '80'},
  { label: '用户创建时间', prop: 'createTime',width: '160' },
  { label: '博客数量', prop: 'blogCount' },
  { label: '评论和回复数量', prop: 'comRepCount' },
  { label: '攻击性评论数量', prop: 'toxicCount' },
  { label: '攻击性评论占比', prop: 'toxicRate' },
  { label: '是否冻结', prop: 'isUserFreeze' },
  { label: '操作', prop: 'actions', width: '150' }
]

// 3. 模拟数据
const listData = ref([
  {
    id: "1001",
    userName: "张三",
    userHead: "https://example.com/avatar/1001.jpg", // 示例头像地址
    createTime: "2024-01-15 10:30:25", // 前端常用字符串格式，也可写 new Date('2024-01-15')
    blogCount: 28, // 发布博客数
    comRepCount: 156, // 评论/回复数
    toxicCount: 3, // 违规言论数
    toxicRate: 0.019, // 违规率（3/156≈0.019）
    isUserFreeze: 0 // 0=未冻结
  },
  {
    id: "1002",
    userName: "李四",
    userHead: "https://example.com/avatar/1002.jpg",
    createTime: "2024-02-20 14:18:40",
    blogCount: 12,
    comRepCount: 89,
    toxicCount: 12,
    toxicRate: 0.135, // 违规率（12/89≈0.135）
    isUserFreeze: 1 // 1=已冻结
  },
  {
    id: "1003",
    userName: "王五",
    userHead: "https://example.com/avatar/1003.jpg",
    createTime: "2024-03-05 09:05:12",
    blogCount: 45,
    comRepCount: 210,
    toxicCount: 0,
    toxicRate: 0.0,
    isUserFreeze: 0
  }
])

const imagePrefix = import.meta.env.VITE_API_BASE_URL+'user/getHead/'

const userVisible = ref(false)

const userDetail = ref({});

const statusMap={
  1:'冻结',
  0:'正常'
}

const visibleMap={
  1:'可见',
  0:'不可见'
}

const toxicMap={
  1:'冒犯',
  2:'具有攻击性',
  0:'无攻击性'
}
const currentUserId = ref('')
const openDetail = async(row) => {
  userVisible.value = true
  currentUserId.value = row.id
  const res = await getUserDetail(row.id)
  if(res.data.code === 200 ){
    userDetail.value = res.data.data
    comRepList.value = res.data.data.userComRepVOList
  }else{
    ElMessage.error("网络繁忙")
    return;
  }
  // 2. 关键：等待 DOM 更新
  await nextTick()

  // 3. 此时 ref 已经绑定到真实的 DOM 元素上了
  initUserChart(userDetail.value.blog12MonthDTO)
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

const userCreationChartRef = ref(null);
let myChart = null;

const initUserChart = (data) => {
  if (!userCreationChartRef.value) return;

  // 如果实例已存在则销毁重绘
  if (myChart) {
    myChart.dispose();
  }

  myChart = echarts.init(userCreationChartRef.value);

  const option = {
    // 提示框配置
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#64748b' },
      extraCssText: 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px;',
      formatter: '{b}月 : <b style="color:#6366f1">{c} 篇</b>'
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      // 对应 DTO 中的 monthList (例如: ["2023-01", "2023-02"...])
      data: data.monthList || [],
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [
      {
        name: '创作篇数',
        type: 'line',
        smooth: true, // 开启平滑曲线
        showSymbol: false,
        // 对应 DTO 中的 blogCountList
        data: data.blogCountList || [],
        lineStyle: {
          width: 4,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#818cf8' },
            { offset: 1, color: '#6366f1' }
          ])
        },
        // 面积渐变填充
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#ffffff' }
          ])
        },
        // 数据点样式
        itemStyle: { color: '#6366f1' },
        // 标记最大/最小值
        markPoint: {
          symbol: 'pin',
          symbolSize: 40,
          data: [
            { type: 'max', name: '最高峰' }
          ],
          label: { fontSize: 10, color: '#fff' }
        }
      }
    ]
  };
  myChart.setOption(option);
  // 响应式缩放
  window.addEventListener('resize', () => myChart?.resize());
};

// 2. 定义表格列配置
const comRepColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '内容', prop: 'comment' },
  { label: '类型', prop: 'type' ,width: '80'},
  { label: '博客标题', prop: 'blogName' },
  { label: '是否可见', prop: 'isVisible',width: '80' },
  { label: '攻击类别', prop: 'mulType' },
  { label: '是否具有攻击性', prop: 'isToxic',width: '80' },
  { label: '操作', prop: 'actions', width: '150' }
]

const comRepList = ref([
  {
    id: "cr001",
    comment: "这篇文章的观点太片面了，根本没考虑实际场景！",
    type: "评论",
    blogId: "blog001",
    blogName: "2025年前端开发趋势分析",
    isVisible: 1,
    mulType: "",
    isToxic: 0
  },
  {
    id: "cr002",
    comment: "你懂个啥？只会纸上谈兵，建议别乱写误导人",
    type: "回复",
    blogId: "blog001",
    blogName: "2025年前端开发趋势分析",
    isVisible: 0,
    mulType: "人身攻击,言语冒犯",
    isToxic: 1
  },
  {
    id: "cr003",
    comment: "垃圾文章，作者就是个傻子，浪费时间！",
    type: "评论",
    blogId: "blog002",
    blogName: "Vue3+TS实战项目教程",
    isVisible: 0,
    mulType: "辱骂,人身攻击",
    isToxic: 2
  },
  {
    id: "cr004",
    comment: "请问这个API的参数格式有示例吗？没看明白",
    type: "回复",
    blogId: "blog002",
    blogName: "Vue3+TS实战项目教程",
    isVisible: 1,
    mulType: "",
    isToxic: 0
  },
  {
    id: "cr005",
    comment: "就这水平还敢发教程？回家种地去吧",
    type: "评论",
    blogId: "blog003",
    blogName: "React Hooks核心用法详解",
    isVisible: 0,
    mulType: "辱骂,职业攻击",
    isToxic: 2
  }
]);

const editToxicVisible = ref(false);
const selectedMulTypes = ref([]); // 用于绑定多选框数组

const toxicForm = ref({
  id: '',
  isToxic: 0,
  mulType: ''
});

// 打开修改弹窗
const openEditToxic = (row) => {
  toxicForm.value.id = row.id;
  toxicForm.value.isToxic = row.isToxic;

  // 将后端逗号分隔字符串转为数组回显
  selectedMulTypes.value = row.mulType ? row.mulType.split(',') : [];
  if(row.type === '回复'){
    currentEditType.value = 'reply'
  }else{
    currentEditType.value = 'comment'
  }
  editToxicVisible.value = true;
};

// --- 状态变量 ---
const freezeDialogVisible = ref(false);
const freezeDuration = ref(null);
const freezeReason = ref(''); // 新增：冻结原因
const targetFreezeId = ref(null);
const isFromDetail = ref(false);


// 冻结用户
// const freezeUserByUserId =async(row) => {
//   const res = await freezeUser(row.id)
//   if(res.data.code === 200){
//     trigSearch()
//   }else{
//     ElMessage.error("网络繁忙")
//   }
// }

// const freezeUserByUserIdForDetail =async(row) => {
//   const res = await freezeUser(row.id)
//   if(res.data.code === 200){
//     trigSearch()
//     userDetail.value.isUserFreeze =1
//   }else{
//     ElMessage.error("网络繁忙")
//   }
// }
// --- 打开弹窗逻辑 ---
const openFreezeModal = (id, fromDetail = false) => {
  targetFreezeId.value = id;
  isFromDetail.value = fromDetail;
  freezeDuration.value = null;
  freezeReason.value = '';  // 重置理由
  freezeDialogVisible.value = true;
};

// 表格中的冻结按钮
const freezeUserByUserId = (row) => openFreezeModal(row.id, false);

// 详情页中的冻结按钮
const freezeUserByUserIdForDetail = (row) => openFreezeModal(row.id, true);

// --- 提交冻结 ---
const confirmFreeze = async () => {
  // 校验
  if (!freezeReason.value.trim()) {
    return ElMessage.warning('请输入冻结原因');
  }

  try {
    // 调用接口，传入 ID、时长和原因
    const res = await freezeUser(
        targetFreezeId.value,
        freezeDuration.value,
        freezeReason.value
    );

    if (res.data.code === 200) {
      ElMessage.success('该账号已被成功冻结');
      freezeDialogVisible.value = false;

      trigSearch(); // 刷新主表

      if (isFromDetail.value) {
        userDetail.value.isUserFreeze = 1; // 同步详情页状态
      }
    } else {
      ElMessage.error(res.data.msg || "操作失败");
    }
  } catch (error) {
    ElMessage.error("系统异常");
  }
};
const unFreezeUserByUserId =async(row) => {
  const res = await unFreezeUser(row.id)
  if(res.data.code === 200){
    trigSearch()
  }else{
    ElMessage.error("网络繁忙")
  }
}

const unFreezeUserByUserIdForDetail =async(row) => {
  const res = await unFreezeUser(row.id)
  if(res.data.code === 200){
    trigSearch()
    userDetail.value.isUserFreeze = 0
  }else{
    ElMessage.error("网络繁忙")
  }
}

const currentEditType = ref('comment')

const submitToxicEdit = async () => {
  // 转换数据格式
  const mulTypeStr = toxicForm.value.isToxic === 0 ? '' : selectedMulTypes.value.join(',');

  const payload = {
    id: toxicForm.value.id,
    isToxic: toxicForm.value.isToxic,
    mulType: mulTypeStr
  };

  try {
    let res;
    if (currentEditType.value === 'comment') {
      res = await updateCommentToxic(payload);
    } else {
      res = await updateReplyToxic(payload);
    }

    if (res.data.code === 200) {
      ElMessage.success('审核判定已更新');
      editToxicVisible.value = false;

      const res = await getUserDetail(currentUserId.value)
      if(res.data.code === 200 ){
        userDetail.value = res.data.data
        comRepList.value = res.data.data.userComRepVOList
      }else{
        ElMessage.error("网络繁忙")
        return;
      }
      // 2. 关键：等待 DOM 更新
      await nextTick()

      // 3. 此时 ref 已经绑定到真实的 DOM 元素上了
      initUserChart(userDetail.value.blog12MonthDTO)
    } else {
      ElMessage.error(res.data.msg || '操作失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('系统异常');
  }
};

const getUsersForAdmin = async (params) => {
  console.log(params)
  const res =  await usersForAdmin(params.userName,
      params.startTime,
      params.endTime,
      params.isUserFreeze,
      params.currentPage,
      params.pageSize
  )

  if(res.data.code === 200){
    listData.value = res.data.data.records;
    total.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }

};

const trigSearch=()=> {
  dataTableRef.value?.handleSearch()
}

const dataTableRef = ref(null)

onMounted(async() => {
  const params = {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  }
  await getUsersForAdmin(params)
})

</script>

<style scoped>

</style>