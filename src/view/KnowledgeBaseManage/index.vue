<template>
  <DataTable
      :search-schema="mySearchConfig"
      :columns="knowledgeBaseColumns"
      :table-data="knowledgeBaseList"
      :show-add="true"
      @search="onSearch"
      @add="openAdd"
  >
    <template #knowledgeIds="{value}">
      {{value.size || 0}}
    </template>
    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="openEdit" >编辑</el-button>
      <el-button link type="danger" size="small" >删除</el-button>
    </template>
  </DataTable>

  <el-dialog
      v-model="kbVisible"
      :title="kbForm.id ? '编辑知识库' : '创建新知识库'"
      width="600px"
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
          <el-form-item label="封面图标 (URL / Element-Icon)" prop="icon">
            <el-input v-model="kbForm.icon" placeholder="输入图片链接或图标名">
              <template #prefix>
                <el-icon v-if="kbForm.icon"><component :is="kbForm.icon" /></el-icon>
              </template>
            </el-input>
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

        <el-form-item label="关联知识点 ID (选填)">
          <el-select
              v-model="kbForm.knowledgeIds"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="输入或选择知识点 ID"
          >
            <el-option label="示例知识点1" value="K001" />
          </el-select>
        </el-form-item>

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
</template>
<script setup>
import DataTable from "@/components/common/DataTable/index.vue";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";

// 2. 定义表格列配置
const knowledgeBaseColumns = [
  { label: 'ID', prop: 'id', width: '80' },
  { label: '图标', prop: 'icon',width: '120' },
  { label: '名称', prop: 'name' ,width: '140'},
  { label: '描述', prop: 'description' ,width: '480'},
  { label: '知识库数量', prop: 'knowledgeIds' ,width: '100'},
  { label: '创建时间', prop: 'createTime',width: '200' },
  { label: '最近修改时间', prop: 'updateTime',width: '200' },
  { label: '操作', prop: 'actions', width: '150' }
]
const mySearchConfig = [
  { label: '知识库名称', prop: 'name', type: 'input', placeholder: '搜索关键词...' },
]
const knowledgeBaseList = ref([
  {
    id: "kb001",
    createBy: "admin",
    createTime: "2024-01-10 09:15:30",
    updateBy: "admin",
    updateTime: "2024-03-05 14:20:18",
    name: "前端开发知识库",
    icon: "https://example.com/icons/frontend.png",
    description: "包含HTML、CSS、JavaScript、Vue、React等前端技术的核心知识点、最佳实践和常见问题解决方案",
    types: ["前端开发", "Web开发", "框架使用"],
    knowledgeIds: ["k001", "k002", "k003", "k004", "k005"]
  },
  {
    id: "kb002",
    createBy: "dev_zhang",
    createTime: "2024-02-18 11:25:45",
    updateBy: "dev_li",
    updateTime: "2024-04-12 16:40:22",
    name: "后端Java知识库",
    icon: "https://example.com/icons/java.png",
    description: "覆盖Java基础、SpringBoot、MyBatis、微服务等后端技术栈的知识点和实战案例",
    types: ["后端开发", "Java", "微服务"],
    knowledgeIds: ["k006", "k007", "k008", "k009"]
  },
  {
    id: "kb003",
    createBy: "test_wang",
    createTime: "2024-03-22 15:10:05",
    updateBy: "test_wang",
    updateTime: "2024-03-22 15:10:05",
    name: "软件测试知识库",
    icon: "https://example.com/icons/test.png",
    description: "包含功能测试、接口测试、自动化测试、性能测试等测试领域的核心方法论和工具使用教程",
    types: ["软件测试", "自动化测试", "接口测试"],
    knowledgeIds: ["k010", "k011", "k012"]
  },
  {
    id: "kb004",
    createBy: "ops_chen",
    createTime: "2024-04-05 10:30:20",
    updateBy: "admin",
    updateTime: "2024-04-20 09:50:15",
    name: "运维部署知识库",
    icon: "https://example.com/icons/ops.png",
    description: "讲解Linux运维、Docker容器、K8s编排、CI/CD流水线等运维相关知识点",
    types: ["运维", "容器化", "自动化部署"],
    knowledgeIds: ["k013", "k014", "k015", "k016", "k017"]
  }
]);

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

// 表单验证规则
const kbRules = reactive({
  name: [{ required: true, message: '请输入知识库名称', trigger: 'blur' }],
  types: [{ required: true, message: '请至少选择一个分类', trigger: 'change' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
});

// 提交方法
const submitKB = async () => {
  if (!kbFormRef.value) return;

  await kbFormRef.value.validate((valid) => {
    if (valid) {
      const isEdit = !!kbForm.value.id;
      console.log('提交的数据:', kbForm.value);

      // TODO: 调用后端接口
      // isEdit ? updateKB(kbForm.value) : createKB(kbForm.value);

      ElMessage.success(isEdit ? '更新成功' : '创建成功');
      kbVisible.value = false;
    }
  });
};

// 模拟打开新增
const openAdd = () => {
  kbForm.value = { id: '', name: '', icon: 'Folder', types: [], knowledgeIds: [] };
  kbVisible.value = true;
};

// 模拟打开编辑
const openEdit = (row) => {
  kbForm.value = { ...row }; // 浅拷贝回显数据
  kbVisible.value = true;
};

</script>
<style scoped>



</style>