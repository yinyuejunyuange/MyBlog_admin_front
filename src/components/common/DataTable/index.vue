<template>
  <div class="space-y-4">
    <div  v-if="showSearch" class="bg-white/70 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm flex flex-wrap gap-4 items-end">
      <div  v-for="item in searchSchema" :key="item.prop" class="flex flex-col gap-1.5">
        <label class="text-xs font-bold text-slate-500 ml-1">{{ item.label }}</label>
        <el-input
            v-if="item.type === 'input'"
            v-model="searchData[item.prop]"
            :placeholder="item.placeholder || '请输入'"
            clearable
            class="!w-48"
        />

        <el-select
            v-if="item.type === 'select'"
            v-model="searchData[item.prop]"
            :multiple="item.multiple"
            :placeholder="item.placeholder || '请选择'"
            clearable
            class="!w-48"
        >
          <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>

        <el-date-picker
            v-if="item.type === 'date'"
            v-model="searchData[item.prop]"
            type="date"
            :placeholder="item.placeholder || '选择日期'"
            class="!w-48"
        />
      </div>

      <div class="flex gap-2">
        <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="flex gap-2" v-if="showAdd">
      <el-button type="primary" @click="handleAdd" >+新增</el-button>
    </div>
    <div class="bg-white/70 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column
            v-for="col in columns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :sortable="col.sortable"
        >
          <template #default="scope">
            <slot :name="col.prop" :row="scope.row" :value="scope.row[col.prop]">
              <span class="text-slate-700">{{ scope.row[col.prop] }}</span>
            </slot>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end" v-if="showPage">
        <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  // 搜索配置
  searchSchema: { type: Array, default: () => [] },
  // 表格列配置
  columns: { type: Array, default: () => [] },
  // 表格数据
  tableData: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  showPage: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true },
  showAdd: { type: Boolean, default: false },
})

const emit = defineEmits(['search', 'reset','add'])

// 响应式搜索表单数据
const searchData = reactive({})
// 初始化 searchData 结构
props.searchSchema.forEach(item => {
  searchData[item.prop] = item.defaultValue || (item.multiple ? [] : '')
})

const handleSearch = () => emit('search', { ...searchData })
const handleAdd = () => emit('add')
const resetSearch = () => {
  Object.keys(searchData).forEach(key => {
    const item = props.searchSchema.find(s => s.prop === key)
    searchData[key] = item.multiple ? [] : ''
  })
  emit('reset')
}
</script>

<style scoped>
/* 深度修改 Element 表格样式 呼应你的玻璃拟态风格 */
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: #f8fafc;
}
:deep(.el-table__header) {
  @apply  overflow-hidden;
}
</style>