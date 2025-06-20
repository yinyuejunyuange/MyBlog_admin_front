<template>
  <div>
    <div>
      <el-form :model="form" label-width="120px" style="max-width: 1200px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="公告标题">
              <el-input v-model="form.title" placeholder="公告标题" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="任务名称">
              <el-input v-model="form.taskName" placeholder="任务名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="创建者名称或手机号">
              <el-input v-model="form.adminName" placeholder="创建者名称或手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="起始日期">
              <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="选择起始日期"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="终止日期">
              <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  placeholder="选择终止日期"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="handleSearchChange">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>

            <el-button @click="openDialog" type="primary" >新增</el-button>
            <el-button @click="deleteBatch" type="danger">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="filteredUsers"
              style="width: 100%"
              @selection-change="handleSelectChange"
    >

      <el-table-column type="selection" width="55" />

      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="公告名称" width="200" />
      <el-table-column prop="adminName" label="创建者名称" width="200" />
      <el-table-column prop="taskName" label="关联任务名称" width="200" />
      <el-table-column label="创建日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="修改日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">

          <el-button
              size="small"
              type="text"
              @click="modifyVisible(row)"
              :disabled="row.status === '不存在或者已清除'||row.status === '正常'">
            修改
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="deleteAnnounce(row.id)"
              :disabled="row.status === '不存在或者已清除'">
            删除
          </el-button>
          <el-button
              size="small"
              :disabled="row.status === '不存在或者已清除'">
            查看公告详情
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

    <el-dialog title="新增公告" v-model="dialogVisible">
      <el-form :model="newTask" label-width="120px">
        <el-form-item label="公告标题">
          <el-input v-model="newTask.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="newTask.content" placeholder="公告内容" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAnnouncement">确 定</el-button>
        </span>
    </el-dialog>


    <el-dialog title="修改任务" v-model="updateDialogVisible">
      <el-form :model="updateTask" label-width="120px">
        <el-form-item label="公告标题">
          <el-input v-model="updateTask.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="updateTask.content" placeholder="公告内容" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyAnnouncement">确 定</el-button>
        </span>
    </el-dialog>


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
  title: '',
  adminName: '',
  taskName:'',
  startDate: null,
  endDate: null,
  status: ''
});

const currentPage=ref(1)
const pageSize=ref(20)
const totalUsers=ref(10)


const filteredUsers=ref([])
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
  announcementId:'',
  taskName: '',
  title: '',
  content: '',
  type:''
})


onMounted(async()=>{

  await getUserInfoList()

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

const getUserInfoList=async ()=>{

  const response= await axios.get("http://localhost:8080/admin/task/getAnnouncementAdmin", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      adminName: form.value.adminName,
      title: form.value.title,
      taskName: form.value.taskName,
      startTime: form.value.startDate!==null?new Date(form.value.startDate):null,
      endTime: form.value.endDate!==null?new Date(form.value.endDate):null,

      currentPage: currentPage.value,
    }
  })

  if(response.data.code===200){
    filteredUsers.value=response.data.data.pageList
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
  await getUserInfoList()
}

const handleSearchChange=async ()=>{
  await getUserInfoList()
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


const openDialog=()=> {
  dialogVisible.value = true;
}
const deleteTaskRecord=async (id)=>{
  const response= await axios.delete("http://localhost:8080/admin/task/deleteTaskRecord",{
    params: {
      taskId: id
    },
    headers:{
      token: localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    await getUserInfoList()
  }else{
    ElMessage.error(response.data.msg)
  }
}




let rows=ref({})

const modifyVisible=(row)=>{
  updateDialogVisible.value = true

  updateTask.value.announcementId=row.id
  updateTask.value.taskName=row.taskName
  updateTask.value.title=row.title
  updateTask.value.content=row.content

  rows=row

}

const addAnnouncement=async()=>{

  const response=await axios.post("http://localhost:8080/admin/task/addAnnouncement",{
    title: newTask.value.title,
    content: newTask.value.content,
  } ,{
    headers:{
      token:localStorage.getItem('token'),
    }
  })

  if(response.data.code===200){
    ElMessage.success("添加成功")
    await getUserInfoList()
    dialogVisible.value=false

  }else{
    ElMessage.error(response.data.msg)
  }
}

const modifyAnnouncement=async()=>{
  const response=await axios.post("http://localhost:8080/admin/task/updateAnnouncement",{
    announcementId: updateTask.value.announcementId,
    title: updateTask.value.title,
    content: updateTask.value.content
  },{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    ElMessage.success("修改成功")
    updateDialogVisible.value=false;
    await getUserInfoList()
  }else{
    ElMessage.error("修改失败")
  }

}

const deleteBatch=async()=>{
  let params=ref([])
  selectTable.value.forEach(i=>{
    params.value.push(i.id)
  })
  const response=await axios.delete("http://localhost:8080/admin/task/deleteAnnouncementBatch",{
    headers:{
      token: localStorage.getItem('token')
    },
    params:{
      removeIds: params.value
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })

  if(response.data.code===200){
    ElMessage.success("删除成功")
    await getUserInfoList()
  }else{
    ElMessage.error("删除失败")
  }
}

const deleteAnnounce=async(id)=>{

  const response=await axios.delete("http://localhost:8080/admin/task/deleteAnnouncement",{
    headers:{
      token: localStorage.getItem('token')
    },
    params:{
      removeId: id
    }
  })

  if(response.data.code===200){
    ElMessage.success("删除成功")
    await getUserInfoList()
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
