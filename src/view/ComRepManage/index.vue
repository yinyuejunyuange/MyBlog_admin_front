<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="comRepColumns"
      :table-data="comRepList"
      @search="onSearch"
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
      <el-button link type="primary" size="small" @click="openEditToxic">修改</el-button>
      <el-button link type="primary" size="small" @click="openReplyDialog">查看回复</el-button>
      <el-button v-if="row.isVisible === 0" link type="danger" size="small">可见</el-button>
      <el-button v-else-if="row.isVisible === 1" link type="danger" size="small">不可见</el-button>
    </template>
  </DataTable>

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

    <el-dialog
        v-model="replyVisible"
        title="相关回复"
        width="800px"
        append-to-body
        class="glass-dialog-inner"
    >
      <DataTable
          :show-search="false"
          :columns="repColumns"
          :table-data="repList"
          @search="onSearch"
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
          <el-button link type="primary" size="small" @click="openEditToxic">修改</el-button>
          <el-button v-if="row.isVisible === 0" link type="danger" size="small">可见</el-button>
          <el-button v-else-if="row.isVisible === 1" link type="danger" size="small">不可见</el-button>
        </template>
      </DataTable>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button round @click="editToxicVisible = false">取消</el-button>
          <el-button type="primary" round class="bg-indigo-500 border-none px-6" @click="submitToxicEdit">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import DataTable from "@/components/common/DataTable/index.vue";
import {ref} from "vue";
import {ElMessage} from "element-plus";


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
const mySearchConfig = [
  { label: '用户名称', prop: 'userName', type: 'input', placeholder: '搜索关键词...' },
  { label: '博客名称', prop: 'blogName', type: 'input', placeholder: '搜索关键词...' },
  { label: '开始时间', prop: 'startTime', type: 'date' },
  { label: '结束时间', prop: 'endTime', type: 'date' },
  {
    label: '是否可见',
    prop: 'isVisible',
    type: 'select',
    options: [
      { label: '可见', value: 1 },
      { label: '不可见', value: 0 },
    ]
  },
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
const visibleMap={
  1:'可见',
  0:'不可见'
}

const toxicMap={
  1:'冒犯',
  2:'具有攻击性',
  0:'无攻击性'
}
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

  editToxicVisible.value = true;
};

const openReplyDialog = ()=>{
  replyVisible.value = true
}

// 提交修改
const submitToxicEdit = () => {
  // 1. 如果选择“无风险”，自动清空类别
  if (toxicForm.value.isToxic === 0) {
    toxicForm.value.mulType = '';
  } else {
    // 2. 将数组转回逗号分隔字符串
    toxicForm.value.mulType = selectedMulTypes.value.join(',');
  }

  console.log('提交给后端的 DTO:', toxicForm.value);

  // TODO: 调用后端接口

  ElMessage.success('审核判定已更新');
  editToxicVisible.value = false;
};

const replyVisible = ref(false)
// 2. 定义表格列配置
const repColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '内容', prop: 'context' },
  { label: '用户名称', prop: 'userName' },
  { label: '是否可见', prop: 'isVisible',width: '80' },
  { label: '攻击类别', prop: 'mulType' },
  { label: '是否具有攻击性', prop: 'isToxic',width: '80' },
  { label: '操作', prop: 'actions', width: '150' }
]
const repList = ref([
  {
    id: "cr001",
    context: "这篇文章的观点太片面了，根本没考虑实际场景！",
    type: "评论",
    blogId: "blog001",
    blogName: "2025年前端开发趋势分析",
    isVisible: 1,
    mulType: "",
    isToxic: 0
  },
  {
    id: "cr002",
    context: "你懂个啥？只会纸上谈兵，建议别乱写误导人",
    type: "回复",
    blogId: "blog001",
    blogName: "2025年前端开发趋势分析",
    isVisible: 0,
    mulType: "人身攻击,言语冒犯",
    isToxic: 1
  },
  {
    id: "cr003",
    context: "垃圾文章，作者就是个傻子，浪费时间！",
    type: "评论",
    blogId: "blog002",
    blogName: "Vue3+TS实战项目教程",
    isVisible: 0,
    mulType: "辱骂,人身攻击",
    isToxic: 2
  },
  {
    id: "cr004",
    context: "请问这个API的参数格式有示例吗？没看明白",
    type: "回复",
    blogId: "blog002",
    blogName: "Vue3+TS实战项目教程",
    isVisible: 1,
    mulType: "",
    isToxic: 0
  },
  {
    id: "cr005",
    context: "就这水平还敢发教程？回家种地去吧",
    type: "评论",
    blogId: "blog003",
    blogName: "React Hooks核心用法详解",
    isVisible: 0,
    mulType: "辱骂,职业攻击",
    isToxic: 2
  }
]);



</script>

<style scoped>

</style>