<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="knowledgeBaseColumns"
      :table-data="knowledgeBaseList"
      :show-add="true"
      @search="pageListBase"
      @page-change="pageListBase"
      @add="openAdd"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
  >
    <template #knowledgeIds="{value}">
      {{value !== null ? value.size(): '0'}}
    </template>

    <template #icon="{value}">
      <img
          v-if="value"
          :src="imagePrefix +value"
          class="absolute inset-0 h-full w-full object-cover"
      />
      <span v-else>-</span>
    </template>

    <template #createTime="{value}">
      {{formatDate(value)}}
    </template>

    <template #updateTime="{value}">
      {{formatDate(value)}}
    </template>

    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="openEdit(row)" >编辑</el-button>
      <el-button link type="danger" size="small"  @click="deleteBaseInfo(row)">删除</el-button>
    </template>
  </DataTable>

  <el-dialog
      v-model="kbVisible"
      :title="kbForm.id ? '编辑知识库' : '创建新知识库'"
      width="1200px"
      destroy-on-close
      align-center
      class="glass-dialog"
  >
    <div class="p-4">
      <el-form :model="kbForm" :rules="kbRules" ref="kbFormRef" label-position="top">

        <el-form-item label="知识库名称" prop="name">
          <el-input
              v-model="kbForm.name"
              placeholder="输入知识库名称，例如：Java全栈成长笔记"
              maxlength="50"
              show-word-limit
          />
        </el-form-item>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="封面图标" prop="icon">
            <div
                class="group relative flex flex-col items-center justify-center w-full h-32 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50 overflow-hidden"
                @click="triggerFileInput"
            >
              <template v-if="kbForm.icon && kbForm.icon !== ''">
                <img
                    :src="imagePrefix +kbForm.icon"
                    class="absolute inset-0 h-full w-full object-cover"
                />
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <el-icon class="text-white text-2xl mb-1"><Edit /></el-icon>
                  <span class="text-white text-xs font-medium">点击更换封面</span>
                </div>
              </template>

              <template v-else>
                <div class="flex flex-col items-center justify-center space-y-2">
                  <div class="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                    <el-icon class="text-gray-400 text-xl group-hover:text-blue-500"><Plus /></el-icon>
                  </div>
                  <span class="text-gray-400 text-xs font-medium group-hover:text-blue-500">点击上传封面</span>
                </div>
              </template>

              <input
                  type="file"
                  ref="fileInputRef"
                  class="hidden"
                  accept="image/*"
                  @change="onFileChange"
              />
            </div>
          </el-form-item>

          <el-form-item label="归属分类" prop="types">
            <el-select
                v-model="kbForm.types"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择分类标签"
            >
              <el-option
                  v-for="item in typeOptions"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="描述介绍" prop="description">
          <el-input
              v-model="kbForm.description"
              type="textarea"
              :rows="4"
              placeholder="请简要描述该知识库的核心内容..."
          />
        </el-form-item>

        <DataTable
            v-if="kbForm.id "
            :columns="rlColumn"
            :table-data="relateList"
            :show-search="false"
            @page-change="getRelatePoints"
            @add="openVisibleToSelect"
            :show-add="true"
            :total="relateTotal"
            v-model:current-page="relateCurrentPage"
            v-model:page-size="relatePageSize"
        >

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
            <el-button link type="danger" size="small" @click="removeBaseAndPoint(row)">删除关联</el-button>
          </template>
        </DataTable>
        <div v-if="kbForm.id" class="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-[10px] text-slate-400">
          <div>创建人: {{ kbForm.createBy || '系统' }} ({{ formatDate(kbForm.createTime) }})</div>
          <div>最后修改: {{ kbForm.updateBy || '-' }} ({{ formatDate(kbForm.updateTime) }})</div>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 px-4">
        <el-button round @click="kbVisible = false">取消</el-button>
        <el-button
            type="primary"
            round
            class="bg-indigo-600 border-none px-8"
            @click="submitKB"
        >
          保存提交
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="rlVisible"
    title="关联知识点"
    width="1200px"
    destroy-on-close
    align-center
  >
    <DataTable
        :search-schema="rlSearchConfig"
        :columns="rlColumn"
        :table-data="rlDataList"
        @search="selectToRelate "
        @page-change="selectToRelate "
        :total="rlTotal"
        v-model:current-page="rlCurrentPage"
        v-model:page-size="rlPageSize"
    >

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
        <el-button link type="danger" size="small" @click="relateBaseAndPoint(row)">关联</el-button>
      </template>
    </DataTable>
  </el-dialog>

</template>
<script setup>
import DataTable from "@/components/common/DataTable/index.vue";
import {nextTick, onMounted, reactive, ref} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import {
  addBase,
  baseDetail,
  deleteBase,
  getPageList,
  relatePoints, unRelatePoints,
  updateBase
} from "@/api/knowledgebase/knowledgebase.js";
import {uploadBlogImage} from "@/api/admin/admin.js";
import {pointList, pointToSelect} from "@/api/knowledgePoint/knowledgePoint.js";

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fileInputRef = ref(null)

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value.click()
}
const imagePrefix = import.meta.env.VITE_API_BASE_URL+'user/getHead/'
// 处理上传
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const loading = ElLoading.service({
    target: '.custom-upload-box', // 局部加载
    text: '上传中...'
  })

  try {
    const res = await uploadBlogImage(formData)

    // 假设你的接口返回 res.data 或 res.data.url
    const resultUrl = res.data.data || res.data

    // 把结果存进表单
    kbForm.value.icon = resultUrl

    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
    console.error(error)
  } finally {
    loading.close()
    event.target.value = '' // 重置 input
  }
}

// 2. 定义表格列配置
const knowledgeBaseColumns = [
  { label: '图标', prop: 'icon',width: '80' },
  { label: '名称', prop: 'name' ,width: '120'},
  { label: '描述', prop: 'description' ,width: '280'},
  { label: '知识库数量', prop: 'knowledgeIds' ,width: '100'},
  { label: '创建时间', prop: 'createTime',width: '200' },
  { label: '最近修改时间', prop: 'updateTime',width: '200' },
  { label: '操作', prop: 'actions', width: '150' }
]
const mySearchConfig = [
  { label: '知识库名称', prop: 'name', type: 'input', placeholder: '搜索关键词...' },
]
const knowledgeBaseList = ref([]);

const kbVisible = ref(false);
const kbFormRef = ref(null);

// 限制的分类选项
const typeOptions = [
  '前端', '后端', 'java', 'c++', 'C语言', 'python', 'go语言', 'vue', 'html', 'css',
  'JS', '计算机', '操作系统', 'react', 'Umi框架', '微服务', '分布式', '人工智能',
  '计算机网络', 'mysql', 'redis', '数据库', 'git', 'TypeScript', 'Rust', '架构',
  '系统规范', '心得分享', '深度学习', '算法'
];

const kbForm = ref({
  id: '',
  name: '',
  icon: '',
  description: '',
  types: [],
  knowledgeIds: [],
  createBy: '',
  createTime: null,
  updateBy: '',
  updateTime: null
});

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

// TODO 补充上传图片

// 表单验证规则
const kbRules = reactive({
  name: [{ required: true, message: '请输入知识库名称', trigger: 'blur' }],
  types: [{ required: true, message: '请至少选择一个分类', trigger: 'change' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
});

// 提交方法
const submitKB = async () => {
  if (!kbFormRef.value) return;

  await kbFormRef.value.validate(async (valid) => {
    if (valid) {
      const isEdit = !!kbForm.value.id;
      console.log('提交的数据:', kbForm.value);
      let res=null
      if(kbForm.value.id !== null && kbForm.value.id !==''){
        res = await updateBase(kbForm.value)
      }else{
        res =  await addBase(kbForm.value)
      }

      if(res.data.code === 200){
        const params = {
          currentPage: currentPage.value,
          pageSize: pageSize.value
        }
        await pageListBase(params)
      }else{
        ElMessage.error("网络繁忙")
        return
      }

      ElMessage.success(isEdit ? '更新成功' : '创建成功');
      kbVisible.value = false;
    }
  });
};

// 模拟打开新增
const openAdd = () => {
  kbForm.value = { id: '', name: '', icon: '', types: [], knowledgeIds: [] };
  kbVisible.value = true;
};

// 模拟打开编辑
const openEdit = async(row) => {
  // kbForm.value = { ...row }; // 浅拷贝回显数据
  selectBaseId.value = row.id
  await nextTick()
  await getBaseDetail(row)

  kbVisible.value = true;
};

const pageListBase = async(params) => {
  const res = await getPageList(params.currentPage, params.pageSize, params.name)
  if(res.data.code === 200){
    knowledgeBaseList.value = res.data.data.records
    console.log(knowledgeBaseList.value)
    total.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }
}


/**
 * 获取知识库详情
 * @param row
 * @returns {Promise<void>}
 */
const getBaseDetail = async (row) => {
  const res = await baseDetail(row.id)
  if(res.data.code === 200){
    kbForm.value = res.data.data

    relateCurrentPage.value = 1;
    relatePageSize.value = 10;

    const paramRelate={
      currentPage: 1,
      pageSize: 10,
    }
    await getRelatePoints(paramRelate)

  }else{
    ElMessage.error("网络繁忙")
  }
}

/**
 *
 * @returns {Promise<void>}
 */
const deleteBaseInfo = async(row) => {
  const res = await deleteBase(row.id)
  if(res.data.code === 200){
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
    await pageListBase(params)
  }else{
    ElMessage.error("网络繁忙")
  }
}

const rlVisible = ref(false)
const rlCurrentPage = ref(1)
const rlPageSize = ref(10)
const rlTotal = ref(0)

const rlSearchConfig = [
  { label: '知识点名称', prop: 'keywords', type: 'input', placeholder: '搜索关键词...' },
]

const rlColumn = [
  { label: '题目', prop: 'title' ,width: '160'},
  { label: '推荐回答', prop: 'recommendedAnswer' ,width: '840'},
  { label: '难度', prop: 'level' },
  { label: '操作', prop: 'actions', width: '150' }
]

const rlDataList = ref([])

const relateList = ref([]);
const relateCurrentPage = ref(1)
const relatePageSize = ref(10)
const relateTotal = ref(0)
const selectBaseId = ref('')

const getRelatePoints = async(params) => {
  const param = {
    page: params.currentPage,
    pageSize: params.pageSize,
    baseId: selectBaseId.value
  }
  const res = await pointList(param)
  if(res.data.code === 200){
    relateList.value = res.data.data.records
    relateTotal.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }
}

const selectToRelate = async(params) => {
  const res = await pointToSelect(params.currentPage, params.pageSize, params.keywords, selectBaseId.value)
  if(res.data.code === 200){
    rlDataList.value = res.data.data.records
    rlTotal.value = res.data.data.total
  }else{
    ElMessage.error("网络繁忙")
  }
}

const openVisibleToSelect = async() =>{
  rlVisible.value = true
  rlCurrentPage.value = 1
  rlPageSize.value = 10
  const params = {
    currentPage:1,
    pageSize: 10,
  }

  await selectToRelate(params)


}

const relateBaseAndPoint = async(row) => {
  const res = await relatePoints(selectBaseId.value,[row.id])
  if(res.data.code === 200){
    const paramRelate={
      currentPage: relateCurrentPage.value,
      pageSize: relatePageSize.value,
    }
    await getRelatePoints(paramRelate)

    const paramRl={
      currentPage: rlCurrentPage.value,
      pageSize: rlPageSize.value,
    }
    await selectToRelate(paramRl)

  }else{
    ElMessage.error("网络繁忙")
  }
}

const removeBaseAndPoint = async(row) => {
  const res = await unRelatePoints(selectBaseId.value,[row.id])
  if(res.data.code === 200){
    const paramRelate={
      currentPage: relateCurrentPage.value,
      pageSize: relatePageSize.value,
    }
    await getRelatePoints(paramRelate)

    const paramRl={
      currentPage: rlCurrentPage.value,
      pageSize: rlPageSize.value,
    }
    await selectToRelate(paramRl)

  }else{
    ElMessage.error("网络繁忙")
  }
}

onMounted( async() => {
  const params = {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  }
  await pageListBase(params)
})

</script>
<style scoped>



</style>