<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="comRepColumns"
      :table-data="comRepList"
      @search="getComForAdmin"
      @page-change="getComForAdmin"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      ref="dataTableRef"
  >

    <template #isVisible="{ value }">
      <el-tag :type="value === 0 ? 'success' : 'danger'" effect="light">
        {{ visibleMap[value] }}
      </el-tag>
    </template>

    <template #mulType="{ value }">
      <el-tag  >
        {{ !value || value === '' ? '无': value}}
      </el-tag>
    </template>

    <template #isToxic="{ value }">
      <el-tag  v-if="value !== null" :type="(value === 0) ? 'success' : value === 1? 'warning':'danger' " effect="light">
        {{ toxicMap[value] }}
      </el-tag>
      <el-tag  v-else type="success" effect="light">
        否
      </el-tag>
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="openEditToxic(row, 'comment')">修改</el-button>
      <el-button link type="primary" size="small" @click="openReplyDialog(row)">回复</el-button>
      <el-button v-if="row.isVisible === 1" link type="danger" size="small" @click="changeCommentVisible(row)" > 设置为可见</el-button>
      <el-button v-else-if="row.isVisible === 0" link type="danger" size="small" @click="changeCommentInVisible(row)" >设置不可见</el-button>
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
        @search="getRepForAdmin"
        :total="repTotal"
        @page-change="getRepForAdmin"
        v-model:page-size="repPageSize"
        v-model:current-page="repCurrentPage"
        ref="dataReplyRef"
    >
      <template #isVisible="{ value }">
        <el-tag :type="value === 0 ? 'success' : 'danger'" effect="light">
          {{ visibleMap[value] }}
        </el-tag>
      </template>

      <template #mulType="{ value }">
        <el-tag >
          {{ !value|| value === '' ? '无': value}}
        </el-tag>
      </template>

      <template #isToxic="{ value }">
        <el-tag  v-if="value !== null" :type="(value === 0) ? 'success' : value === 1? 'warning':'danger' " effect="light">
          {{ toxicMap[value] }}
        </el-tag>
        <el-tag  v-else type="success" effect="light">
          否
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="openEditToxic(row,'reply')">修改</el-button>
        <el-button v-if="row.isVisible === 0" link type="danger" size="small" @click="changeReplyInVisible(row)">可见</el-button>
        <el-button v-else-if="row.isVisible === 1" link type="danger" size="small" @click="changeReplyVisible(row)">不可见</el-button>
      </template>
    </DataTable>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button round @click="replyVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import DataTable from "@/components/common/DataTable/index.vue";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {
  getCommentForAdmin,
  getReplyForAdmin,
  updateCommentStatus, updateCommentToxic,
  updateReplyStatus,
  updateReplyToxic
} from "@/api/blog/blog.js";


const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)


const repPageSize = ref(10)
const repCurrentPage = ref(1)
const repTotal = ref(0)

// 2. 定义表格列配置
const comRepColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '内容', prop: 'context' },
  { label: '博客标题', prop: 'blogName' ,width: '200'},
  { label: '是否可见', prop: 'isVisible',width: '80' },
  { label: '攻击类别', prop: 'mulType' },
  { label: '是否具有攻击性', prop: 'isToxic',width: '180' },
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
      { label: '可见', value: 0 },
      { label: '不可见', value: 1 },
    ]
  },
]
const comRepList = ref([]);

const editToxicVisible = ref(false);
const selectedMulTypes = ref([]); // 用于绑定多选框数组
const visibleMap={
  0:'可见',
  1:'不可见'
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
// 2. 增加一个变量来标记当前操作的对象类型
const currentEditType = ref('comment'); // 'comment' 或 'reply'

// 3. 完善打开弹窗的方法 (注意传入 row 和 type)
const openEditToxic = (row, type = 'comment') => {
  currentEditType.value = type; // 记录是评论还是回复
  toxicForm.value.id = row.id;
  toxicForm.value.isToxic = row.isToxic ?? 0;

  // 回显多选框
  selectedMulTypes.value = row.mulType ? row.mulType.split(',') : [];
  editToxicVisible.value = true;
};
const replyVisible = ref(false)

const commentId = ref('')

const openReplyDialog = async(row)=>{

  repList.value = []
  repTotal.value = 0

  replyVisible.value = true
  repCurrentPage.value = 1
  repPageSize.value = 10
  commentId.value = row.id
  const params = {
    currentPage:1,
    pageSize: 10,
    commentId: row.id
  }

  await getRepForAdmin(params)
}

const dataTableRef = ref(null)
const dataReplyRef = ref(null)

// 提交修改
// 4. 补全提交修改逻辑
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

      // 5. 成功后刷新对应列表
      if (currentEditType.value === 'comment') {
        dataTableRef.value?.handleSearch()
      } else {
        const params={
          currentPage: repCurrentPage.value,
          pageSize: pageSize.value,
          commentId: commentId.value
        }
        await getRepForAdmin(params)
      }
    } else {
      ElMessage.error(res.data.msg || '操作失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('系统异常');
  }
};

const changeCommentVisible = async(row) => {
  const res = await updateCommentStatus(row.id,0)
  if(res.data.code === 200){
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
    await getComForAdmin(params)
  }else{
    ElMessage.error('网络繁忙')
  }
}

const changeCommentInVisible = async(row) => {
  const res = await updateCommentStatus(row.id,1)
  if(res.data.code === 200){
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
    await getComForAdmin(params)
  }else{
    ElMessage.error('网络繁忙')
  }
}

const changeReplyVisible = async(row) => {
  const res = await updateReplyStatus(row.id,0)
  if(res.data.code === 200){
    repList.value = []
    repTotal.value = 0
    replyVisible.value = true
    repCurrentPage.value = 1
    repPageSize.value = 10
    const params = {
      currentPage:1,
      pageSize: 10,
      commentId: commentId.value
    }
    await getRepForAdmin(params)
  }else{
    ElMessage.error('网络繁忙')
  }
}

const changeReplyInVisible = async(row) => {
  const res = await updateReplyStatus(row.id,1)
  if(res.data.code === 200){
    repList.value = []
    repTotal.value = 0
    replyVisible.value = true
    repCurrentPage.value = 1
    repPageSize.value = 10
    const params = {
      currentPage:1,
      pageSize: 10,
      commentId: commentId.value
    }
    await getRepForAdmin(params)
  }else{
    ElMessage.error('网络繁忙')
  }
}

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
const repList = ref([]);

const getComForAdmin= async(params)=>{
  const res =  await getCommentForAdmin(params.blogName,
      params.userName,
      params.startTime,
      params.endTime ,
      params.isVisible,
      params.currentPage ,
      params.pageSize
  )

  if(res.data.code === 200){
    comRepList.value = res.data.data.pageList;
    total.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }
}

const getRepForAdmin= async(params)=>{
  const res =  await getReplyForAdmin(params.blogName,
      params.userName,
      params.commentId,
      params.startTime,
      params.endTime ,
      params.isVisible,
      params.currentPage ,
      params.pageSize
  )

  if(res.data.code === 200){
    repList.value = res.data.data.pageList;
    repTotal.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }
}



onMounted(async () => {
  const params = {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  }
  await getComForAdmin(params)
})


</script>

<style scoped>

</style>