<template>
  <!-- 弹窗 -->
  <el-dialog
      v-model="showDialog"
      destroy-on-close
  >
    <!-- 头部 -->
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="text-lg font-semibold text-gray-800">上传文件</h2>
    </div>

    <!-- 内容区 -->
    <div class="p-6">
      <!-- 文件选择区域 -->
      <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          @click="triggerFileInput"
      >
        <input
            ref="fileInput"
            type="file"
            class="hidden"
            @change="handleFileSelect"
        />

        <div v-if="!file" class="space-y-3">
          <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-gray-600">点击选择文件</p>
        </div>

        <div v-else class="text-left">
          <div class="flex items-center space-x-3 mb-4">
            <div class="flex-shrink-0">
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
              <p class="text-sm text-gray-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
          </div>
        </div>
      </div>

      <!-- MD5计算进度 -->
      <div v-if="isCalculatingMD5" class="mt-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="font-medium text-gray-700">计算文件MD5中...</span>
          <span class="text-gray-500">{{ calculateProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${calculateProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- 文件信息 -->
      <div v-if="overallMD5 && !isCalculatingMD5" class="mt-6 bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500 mb-1">文件MD5</p>
            <p class="font-mono text-gray-800 truncate text-xs">{{ overallMD5 }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">分片数量</p>
            <p class="font-medium text-gray-800">{{ totalChunks }} 个</p>
          </div>
        </div>
      </div>

      <!-- 上传进度 -->
      <div v-if="isUploading" class="mt-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="font-medium text-gray-700">上传文件中...</span>
          <span class="text-gray-500">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-green-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-2">已上传 {{ uploadedChunks }} / {{ totalChunks }} 个分片</p>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="flex justify-end space-x-3 p-4 border-t">
      <button
          v-if="isUploading"
          @click="cancelUpload"
          class="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
      >
        取消上传
      </button>

      <button
          v-if="isFinish"
          class="px-4 py-2 border border-green-300 text-green-600 rounded"
      >
        上传完成
      </button>

      <button
          v-if="file && !isCalculatingMD5 && !isUploading && !isFinish"
          @click="startUpload"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        开始上传
      </button>

      <button
          @click="closeDialog"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
      >
        关闭
      </button>
    </div>
  </el-dialog>

  <!--  <div  class="fixed inset-0 z-50 flex items-center justify-center  p-4">-->
  <!--    -->
  <!--  </div>-->

</template>

<script setup >
/**
 * 文件上传组件
 * 使用方式 <Upload v-model=showDialog />
 * // 文件组件工具
 * const showDialog = ref(false);
 */
import { ref, computed, watch } from 'vue'

import SparkMD5 from 'spark-md5'
import {testUploadFile,testMergeFile ,getExistFileChunks} from '@/api/blog.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  chunkSize: {
    type: Number,
    default: 1024 * 1024 // 1MB
  }
  ,
  fileInfo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'update:fileInfo']) // 子组件向父组件返回数据

// 状态管理  保证子组件和父组件的状态同步
const showDialog = computed({
  get: () => {
    console.log('modelValue:', props.modelValue) // 打印父组件传入的值
    return props.modelValue
  },
  set: (value) => emit('update:modelValue', value)
})
const file = ref(null)
const fileNo = ref('')
const fileInput = ref(null)
const overallMD5 = ref('')
const chunks = ref([])
const uploadedChunks = ref(0)
const isCalculatingMD5 = ref(false)
const isUploading = ref(false)
const isFinish = ref(false)
const calculateProgress = ref(0)
const uploadProgress = ref(0)
const existFileChunks = ref([])

// 计算分片总数
const totalChunks = computed(() => {
  if (!file.value) return 0
  return Math.ceil(file.value.size / props.chunkSize)
})

// 文件选择
const triggerFileInput = () => {
  fileInput.value.click()

}

const handleFileSelect = async (event) => {
  const selectedFile = event.target.files[0]
  if (!selectedFile) return

  file.value = selectedFile
  await calculateMD5AndPrepareChunks()
}

// 计算MD5和准备分片
const calculateMD5AndPrepareChunks = async () => {
  if (!file.value) return

  isCalculatingMD5.value = true
  calculateProgress.value = 0

  try {
    // 计算整体MD5
    overallMD5.value = await calculateFileMD5(file.value)

    // 准备分片
    await prepareChunks()

    calculateProgress.value = 100
  } catch (error) {
    console.error('MD5计算失败:', error)
    overallMD5.value = '计算失败'
  } finally {
    isCalculatingMD5.value = false
  }
}

// 计算文件整体MD5（流式）
const calculateFileMD5 = (file) => {
  return new Promise((resolve, reject) => {
    const chunkSize = 2 * 1024 * 1024 // 每次读取2MB
    const totalChunks = Math.ceil(file.size / chunkSize)
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()

    let currentChunk = 0

    reader.onload = (e) => {
      spark.append(e.target.result)
      currentChunk++

      // 更新进度
      calculateProgress.value = Math.round((currentChunk / totalChunks) * 100)

      if (currentChunk < totalChunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

// 准备分片
const prepareChunks = async () => {
  if (!file.value) return

  chunks.value = []
  uploadedChunks.value = 0

  for (let i = 0; i < totalChunks.value; i++) {
    const start = i * props.chunkSize
    const end = Math.min(start + props.chunkSize, file.value.size)
    const chunkBlob = file.value.slice(start, end)

    // 计算分片MD5
    const chunkMD5 = await calculateChunkMD5(chunkBlob)

    chunks.value.push({
      index: i,
      start,
      end,
      size: end - start,
      chunk: chunkBlob,
      md5: chunkMD5,
      uploaded: false
    })
  }
}

// 计算分片MD5
const calculateChunkMD5 = (chunk) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer() // sparkmd5的ArrayBuffer 模式专门处理二进制数据
    const reader = new FileReader()

    // 文件读取后的回调函数
    reader.onload = (e) => {
      spark.append(e.target.result)
      resolve(spark.end()) // 将成功后的值作为Promise的成功值返回
    }

    reader.readAsArrayBuffer(chunk)
  })
}

// 开始上传
const startUpload = async () => {
  if (!file.value || chunks.value.length === 0 || isUploading.value) return

  isUploading.value = true
  uploadProgress.value = 0

  // 获取已经上传的文件片段
  await getExistChunks();

  try {
    // 按顺序上传分片
    for (let i = 0; i < chunks.value.length; i++) {
      const chunk = chunks.value[i]
      await uploadChunk(chunk)
    }

    let filePath = ''
    // 所有分片上传完成，合并文件
    await mergeChunks(filePath)

    emit('update:fileInfo', {
      filename: filePath,
      fileSize: file.value.size,
      fileMD5: overallMD5.value
    })

    console.info("完成分片上传和合并")

  } catch (error) {
    console.error('上传失败:', error)
    emit('upload-error', error)
    isUploading.value = false
  }
}

// 获取已经上传的分片信息
const getExistChunks = async() =>{
  await getExistFileChunks(overallMD5.value+file.value.name)
      .then(res=>{
        if(res.data.code ===200){
          existFileChunks.value = res.data.data
        }
      })
}

// 上传单个分片
const uploadChunk = async (chunkData) => {
  if(!existFileChunks.value.includes(chunkData.index)){
    const uploadData={
      fileNo:overallMD5.value+file.value.name,
      chunkNum:chunkData.index,
      fileFullMd5:overallMD5.value,
      md5:chunkData.md5,
      allChunks:totalChunks.value
    }

    // 3. 构造FormData（关键：后端@RequestPart需要FormData传递文件+JSON）
    const formData = new FormData()
    // 3.1 追加分片文件（对应后端@RequestPart("file")）
    formData.append('file', chunkData.chunk)
    // 3.2 追加FileUploadDTO（对应后端@RequestPart("data")，转成JSON字符串）
    formData.append('fileUploadDTO', new Blob([JSON.stringify(uploadData)], { type: 'application/json' }))


    await testUploadFile(formData).then((res)=>{

      console.info(res)
      if (res.data.code!==200) {
        throw new Error(`上传失败: ${res.data.message}`)
      }
    })
  }else{
    console.log("重复上传")
  }

  chunkData.uploaded = true
  uploadedChunks.value = chunks.value.filter(c => c.uploaded).length
  uploadProgress.value = Math.round((uploadedChunks.value / totalChunks.value) * 100)

}

// 合并分片
const mergeChunks = async (filePath) => {
  const mergeData = {
    fileNo: overallMD5.value+file.value.name,
    totalFileChunks: totalChunks.value,
    orgFileName: file.value.name
  }
  await testMergeFile(mergeData).then((res)=>{
    if(res.data.code===200){
      isFinish.value = true
      isUploading.value = false
      filePath= res.data.data
    }
  })

}

// 取消上传
const cancelUpload = () => {
  isUploading.value = false
  resetUploadState()
}

// 重置上传状态
const resetUploadState = () => {
  overallMD5.value = ''
  chunks.value = []
  uploadedChunks.value = 0
  calculateProgress.value = 0
  uploadProgress.value = 0
  file.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 关闭弹窗
const closeDialog = () => {
  if (isUploading.value) {
    if (confirm('上传正在进行中，确定要取消吗？')) {
      cancelUpload()
      showDialog.value = false
    }
  } else {
    showDialog.value = false
  }
}

// 监听弹窗关闭
watch(showDialog, (newValue) => {
  if (!newValue) {
    cancelUpload()
  }
})

</script>


<style scoped>

</style>