<template>
    <div>
      <div>
        <el-form :model="form" label-width="120px" style="max-width: 1000px;">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="form.name" placeholder="输入用户名称" />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="用户邮箱">
                <el-input v-model="form.email" placeholder="输入邮箱" />
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

            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="form.status" placeholder="选择状态">
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="冻结" value="冻结"></el-option>
                  <el-option label="禁止" value="禁止"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="handleCurrentChange">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="name" label="姓名" width="200" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="imageUrl" label="头像" width="200" >
          <template #default="{ row }">
            <img :src="row.imageUrl" alt="User Avatar" class="userHead" />
          </template>

        </el-table-column>
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
        <el-table-column label="状态" width="200" >
          <template #default="{ row }">
            <el-select v-model="row.status" placeholder="选择状态" @change="handleStatusChange(row)">
              <el-option label="正常" value="正常"></el-option>
              <el-option label="冻结" value="冻结"></el-option>
              <el-option label="禁止" value="禁止"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="deleteUser(row.id)">删除</el-button>
            <el-button size="small" @click="viewBlogs(row.id)">查看相关博客</el-button>
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


const form = ref({
  name: '',
  email: '',
  startDate: null,
  endDate: null,
  status: ''
});

const currentPage=ref(1)
const pageSize=ref(10)
const totalUsers=ref(10)


const filteredUsers=ref([])

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
  const response= await axios.get("http://localhost:8080/admin/getUserInfoList", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      name: form.value.name,
      email: form.value.email,
      startDate: form.value.startDate!==null?new Date(form.value.startDate):null,
      endDate: form.value.endDate!==null?new Date(form.value.endDate):null,
      status: form.value.status,
      currentPage: currentPage.value
    }
  })

  if(response.data.code===200){
    filteredUsers.value=response.data.data.users
    totalUsers.value=response.data.data.totalPage
    currentPage.value=response.data.data.currentPage
    ElMessage.success(response.data.msg)
  }else{
    ElMessage.error("查询 失败")
  }
}

const handleCurrentChange=async ()=>{
  await getUserInfoList()
}

const search = () => {
  console.log('搜索条件：', form.value);
  // 在这里添加你的搜索逻辑
};

const reset = () => {
  form.value = {
    name: '',
    email: '',
    startDate: null,
    endDate: null,
    status: ''
  };
};

const handleStatusChange=async (row)=>{

  const param={
    userId: row.id,
    status: row.status
  }

  const response=await axios.put("http://localhost:8080/admin/updateUserStatus",param,{
    headers:{
      token: localStorage.getItem("token"),
    }
  })

  if(response.data.code===200){
    ElMessage.success("修改成功")
  }else{
    ElMessage.error("修改失败")
  }

}

const deleteUser= async (userId)=>{
    const response=await axios.delete("http://localhost:8080/admin/deleteUser",{
      headers:{
        token: localStorage.getItem('token')
      },
      params:{
        userId: userId
      }
    })
  if(response.data.code===200){
    ElMessage.success(response.data.msg)
    await getUserInfoList();
  }else{
    ElMessage.error(response.data.msg)
  }
}

</script>

<style scoped>

.userHead{
  width: 50px;
}
</style>
