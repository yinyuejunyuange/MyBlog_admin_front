<template>
  <div class="space-y-4">
    <div
        v-if="showSearch"
        class="bg-white/70 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm flex flex-wrap gap-4 items-end"
    >
      <div v-for="item in searchSchema" :key="item.prop" class="flex flex-col gap-1.5">
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
      <el-button type="primary" @click="handleAdd">+新增</el-button>
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
            v-model:current-page="currentPageModel"
            v-model:page-size="pageSizeModel"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="pageSizes"
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, reactive, ref, watch} from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  searchSchema: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  tableData: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  showPage: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true },
  showAdd: { type: Boolean, default: false },
  pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['search',
  'reset',
  'add',
  'page-change',
  'update:currentPage', // 用于修改 分页的值
  'update:pageSize',
])

const searchData = reactive({})
const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val),
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val),
})


const initSearchData = () => {
  props.searchSchema.forEach((item) => {
    if (!(item.prop in searchData)) {
      searchData[item.prop] = item.defaultValue ?? (item.multiple ? [] : '')
    }
  })
}

watch(() => props.searchSchema, initSearchData, { immediate: true, deep: true })

const buildParams = () => ({
  ...searchData,
  currentPage: currentPageModel.value,
  pageSize: pageSizeModel.value,
})

const handleSearch = () => {
  const params = {...buildParams()}
  params.currentPage = 1
  params.pageSize = 10
  emit('search', params)

  currentPageModel.value = 1
  pageSizeModel.value =10
}

const handleAdd = () => emit('add')

const resetSearch = () => {
  Object.keys(searchData).forEach((key) => {
    const item = props.searchSchema.find((s) => s.prop === key)
    searchData[key] = item?.defaultValue ?? (item?.multiple ? [] : '')
  })
  const params = {...buildParams()}
  params.pageSize = 10
  params.currentPage = 1
  emit('reset', params)
  emit('search', params)
  // 异步数据
  currentPageModel.value = 1
  pageSizeModel.value = 10
}

const handleCurrentChange = (page) => {
  const params = buildParams()
  params.currentPage = page
  emit('page-change', params)

  currentPageModel.value = page
}

const handleSizeChange = (size) => {
  const params = { ...buildParams()}
  params.pageSize = size
  params.currentPage = 1
  emit('search', params)

  pageSizeModel.value = size
  currentPageModel.value = 1
}

const getSearchData = () => ({ ...searchData })

/**
 * 暴露部分方法
 */
defineExpose({
  resetSearch,
  handleSearch,
  getSearchData,
})

</script>

<style scoped>
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: #f8fafc;
}
:deep(.el-table__header) {
  @apply overflow-hidden;
}
</style>