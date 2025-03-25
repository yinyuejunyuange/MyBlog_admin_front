<template>
  <div>
    <div>
      <el-form :model="form" label-width="120px" style="max-width: 1200px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="管理员名称">
              <el-input v-model="form.name" placeholder="管理员名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" placeholder="手机号" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="管理员类型">
              <el-select v-model="form.adminType" placeholder="选择类型">
                <el-option label="admin" value="admin"></el-option>
                <el-option label="super_admin" value="super_admin"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="创建者">
              <el-input v-model="form.createBy" placeholder="创建者" />
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
            <el-select v-model="form.isFreeze" placeholder="选择状态">
              <el-option label="冻结" value="1"></el-option>
              <el-option label="未冻结" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="handleSearchChange">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>

                        <el-button @click="openDialog" type="primary" >新增管理员</el-button>
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
      <el-table-column prop="name" label="管理员姓名" width="200" />
      <el-table-column prop="imageUrl" label="头像" width="200" >
        <template #default="{ row }">
          <img :src="row.imageUrl" alt="User Avatar" class="userHead" />
        </template>

      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="200" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column label="创建日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建者" width="200" />
      <el-table-column label="修改日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="修改者" width="200" />
      <el-table-column  label="状态" width="200" >
        <template #default="{ row }">
          <el-select v-model="row.isFreeze" placeholder="选择状态" @change="handleStatusChange(row)">
            <el-option label="冻结" value="1"></el-option>
            <el-option label="未冻结" value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="adminType" label="管理员类型" width="200" />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">

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



    <el-dialog title="新增管理员" v-model="dialogVisible">
      <el-form :model="newTask" label-width="120px">
        <el-form-item label="姓名">
          <el-input v-model="newTask.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input  v-model="newTask.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input  v-model="newTask.email" placeholder="邮箱" />
        </el-form-item>

        <el-form-item label="管理员类型">
          <el-select v-model="newTask.adminType" placeholder="选择类型">
            <el-option label="admin" value="admin"></el-option>
            <el-option label="super_admin" value="super_admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAnnouncement">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="新管理员的密码" v-model="updateDialogVisible">
      <h3>{{passwords}}</h3>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import {ElMessage} from "element-plus";
import JSEncrypt from 'jsencrypt';


const form = ref({
  name: '',
  phone: '',
  adminType: '',
  createBy: '',
  startDate: null,
  endDate: null,
  isFreeze: ''
});

const currentPage=ref(1)
const pageSize=ref(20)
const totalUsers=ref(10)


const filteredUsers=ref([])
const selectTable=ref([])

const dialogVisible=ref(false)
const updateDialogVisible=ref(false)
const newTask=ref({
  name: '',
  phone: '',
  email: '',
  adminType:''
})

const updateTask=ref({
  context: '',
})

const passwords=ref('')

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
  const response= await axios.put("http://localhost:8080/admin/manager//updateAdmin", null,{
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      adminId:row.id,
      isFreeze:row.isFreeze
    }
  })
  if(response.data.code===200){
    ElMessage.success(response.data.msg)
  }else{
    ElMessage.error("查询 失败")
  }
}

const getUserInfoList=async ()=>{

  const response= await axios.get("http://localhost:8080/admin/manager/getManagers", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      name: form.value.name,
      phone: form.value.phone,
      adminType: form.value.adminType,
      createBy: form.value.createBy,
      startTime: form.value.startDate!==null?new Date(form.value.startDate):null,
      endTime: form.value.endDate!==null?new Date(form.value.endDate):null,
      isFreeze:form.value.isFreeze,
      currentPage: currentPage.value,
    }
  })

  if(response.data.code===200){
    filteredUsers.value=response.data.data.pageList.map(i=>{
      return {
        ...i,
        createBy: i.createBy===null?'无':i.createBy,
        updateBy: i.updateBy===null?'无':i.updateBy,
        isFreeze:i.isFreeze===1?'冻结':'未冻结',
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


const addAnnouncement=async()=>{

  const response=await axios.post("http://localhost:8080/admin/manager/addAdmin",{
    name: newTask.value.name,
    phone: newTask.value.phone,
    email: newTask.value.email,
    adminType: newTask.value.adminType,
  } ,{
    headers:{
      token:localStorage.getItem('token'),
    }
  })

  if(response.data.code===200){
    ElMessage.success("添加成功")

    const privateKey=response.data.data.privateKey;
    const keyWord=response.data.data.keyWord;

    passwords.value=decryptMessage(privateKey,keyWord)

    console.info(passwords.value)

    await getUserInfoList()
    dialogVisible.value=false
    updateDialogVisible.value=true;


  }else{
    ElMessage.error(response.data.msg)
  }
}


const decryptMessage=(privateWords,keyWords)=> {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPrivateKey(privateWords)
  return jsEncrypt.decrypt(keyWords)
}

const deleteComment=async(id)=>{

  const response=await axios.delete("http://localhost:8080/admin/manager/deleteAdmin",{
    headers:{
      token: localStorage.getItem('token')
    },
    params:{
      adminId: id
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

