<template>
  <div>
    <div>
      <el-form :model="form" label-width="120px" style="max-width: 1200px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="博客名称">
              <el-input v-model="form.blogName" placeholder="博客名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="用户名称">
              <el-input v-model="form.userName" placeholder="用户名称" />
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

        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.isVisible" placeholder="选择状态">
              <el-option label="可见" value="0"></el-option>
              <el-option label="不可见" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="handleSearchChange">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>

<!--            <el-button @click="openDialog" type="primary" >新增</el-button>-->
<!--            <el-button @click="deleteBatch" type="danger">删除</el-button>-->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="filteredUsers"
              style="width: 100%"
              @selection-change="handleSelectChange"
    >

<!--      <el-table-column type="selection" width="55" />-->

      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="blogName" label="博客名称" width="200" />
      <el-table-column prop="userName" label="用户名称" width="200" />
      <el-table-column prop="context" label="评论内容" width="200" />
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
      <el-table-column  label="状态" width="200" >
        <template #default="{ row }">
          <el-select v-model="row.isVisible" placeholder="选择状态" @change="handleStatusChange(row)">
            <el-option label="可见" value="0"></el-option>
            <el-option label="不可见" value="1"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">

          <el-button
              size="small"
              type="text"
              @click="modifyVisible(row)">
            查看详情
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="deleteComment(row.id)">
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


    <el-dialog title="查看任务" v-model="updateDialogVisible">
      <el-form :model="updateTask" label-width="120px">
        <el-form-item label="评论内容">
          <el-input type="textarea" v-model="updateTask.context" placeholder="公告内容" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" >确 定</el-button>
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
  blogName: '',
  userName: '',
  startDate: null,
  endDate: null,
  isVisible: ''
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
  context: '',
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

const handleStatusChange= async(row)=>{
  const response= await axios.put("http://localhost:8080/admin/updateCommentStatus", null,{
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      commentId:row.id,
      isVisible:row.isVisible
    }
  })
  if(response.data.code===200){
    ElMessage.success(response.data.msg)
  }else{
    ElMessage.error("查询 失败")
  }
}

const getUserInfoList=async ()=>{

  const response= await axios.get("http://localhost:8080/admin/getCommentList", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      blogName: form.value.blogName,
      userName: form.value.userName,
      startTime: form.value.startDate!==null?new Date(form.value.startDate):null,
      endTime: form.value.endDate!==null?new Date(form.value.endDate):null,
      isVisible:form.value.isVisible,
      currentPage: currentPage.value,
    }
  })

  if(response.data.code===200){
    filteredUsers.value=response.data.data.pageList.map(i=>{
      return {
        ...i,
        isVisible:i.isVisible===1?'不可见':'可见',
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

  updateTask.value.context=row.context

  console.info(row.context)

  updateDialogVisible.value = true
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

// const deleteBatch=async()=>{
//   let params=ref([])
//   selectTable.value.forEach(i=>{
//     params.value.push(i.id)
//   })
//   const response=await axios.delete("http://localhost:8080/admin/task/deleteAnnouncementBatch",{
//     headers:{
//       token: localStorage.getItem('token')
//     },
//     params:{
//       removeIds: params.value
//     },
//     paramsSerializer: params => {
//       return qs.stringify(params, {indices: false})
//     }
//   })
//
//   if(response.data.code===200){
//     ElMessage.success("删除成功")
//     await getUserInfoList()
//   }else{
//     ElMessage.error("删除失败")
//   }
// }

const deleteComment=async(id)=>{

  const response=await axios.delete("http://localhost:8080/admin/deleteComment",{
    headers:{
      token: localStorage.getItem('token')
    },
    params:{
      commentId: id
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
