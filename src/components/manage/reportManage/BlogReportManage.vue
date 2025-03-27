<template>
  <div>
    <div>
      <el-form :model="form" label-width="120px" style="max-width: 1200px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="管理员姓名">
              <el-input v-model="form.adminName" placeholder="管理员姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="选择状态">
              <el-option label="未解决" value="0"></el-option>
              <el-option label="已解决" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="handleSearchChange">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="filtered"
              style="width: 100%"
              @selection-change="handleSelectChange"
    >

      <!--      <el-table-column type="selection" width="55" />-->

      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="blogTitle" label="博客名称" width="200" />
      <el-table-column prop="userName" label="举报者名称" width="200" />
      <el-table-column prop="content" label="举报内容" width="200" />
      <el-table-column label="举报日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="解决日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.finishTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="finishName" label="处理人" width="200" />
      <el-table-column  label="状态" width="200" >
        <template #default="{ row }">
          <el-select v-model="row.status" placeholder="选择状态" @change="handleStatusChange(row)">
            <el-option label="未解决" value="0"></el-option>
            <el-option label="已解决" value="1"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">

          <el-button
              size="small"
              type="danger"
              @click="deleteReport(row.id)">
            删除
          </el-button>

        </template>
      </el-table-column>

    </el-table>
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalUsers"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        style="margin-top: 20px;"
    />


  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import Navigation from "@/navigation/Navigation.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import axios from 'axios';
import {ElMessage} from "element-plus";
import Layout from "@/components/layout/Layout.vue";
import qs from 'qs'


const form = ref({
  adminName: '',
  status: ''
});

const currentPage=ref(1)
const pageSize=ref(20)
const totalUsers=ref(10)


const filtered=ref([])
const selectTable=ref([])

const dialogVisible=ref(false)
const updateDialogVisible=ref(false)
const newTask=ref({
  taskName: '',
  title: '',
  content: '',
  type:''
})

const updateTask=ref({
  context: '',
})


onMounted(async()=>{

  await getInfoList()

})

function formatDate(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const handleStatusChange= async(row)=>{
  const response= await axios.put("http://localhost:8080/admin/report/updateBlogReport", {
    reportId:row.id,
    status:row.status,
  },{
    headers: {
      token: localStorage.getItem("token"),
    }
  })
  if(response.data.code===200){
    ElMessage.success(response.data.msg)
    await getInfoList()
  }else{
    ElMessage.error("修改 失败")
  }
}

const getInfoList=async ()=>{

  const response= await axios.get("http://localhost:8080/admin/report/getBlogReport", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      adminName: form.value.adminName,
      status:form.value.status,
      currentPage: currentPage.value,
    }
  })

  if(response.data.code===200){
    filtered.value=response.data.data.pageList.map(i=>{
      return {
        ...i,
        status:i.status===1?'已解决':'未解决',
      }
    })
    totalUsers.value=response.data.data.total
    currentPage.value=response.data.data.pageNow
    pageSize.value=response.data.data.pageSize
    ElMessage.success(response.data.msg)
  }else{
    ElMessage.error("查询 失败")
  }
}

const handleCurrentChange=async (newPage)=>{
  currentPage.value = newPage;
  await getInfoList()
}

const handleSearchChange=async ()=>{
  await getInfoList()
}

const reset = () => {
  form.value = {
    name: '',
    email: '',
    startDate: null,
    endDate: null,
    status: ''
  };
};

const handleSelectChange=(sel)=>{
  selectTable.value=sel;
}



const deleteReport=async(id)=>{

  const response=await axios.delete("http://localhost:8080/admin/report/deleteBlogReport",{
    headers:{
      token: localStorage.getItem('token')
    },
    params:{
      id: id
    }
  })

  if(response.data.code===200){
    ElMessage.success("删除成功")
    await getInfoList()
  }else{
    ElMessage.error("删除失败")
  }
}

</script>

<style scoped>

.userHead{
  width: 50px;
}
</style>
