<template>
  <div>
    <div>
      <el-form :model="form" label-width="120px" style="max-width: 1000px;">
        <el-row :gutter="20">
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

          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="选择状态">
                <el-option label="执行中" value="执行中"></el-option>
                <el-option label="暂停" value="暂停"></el-option>
                <el-option label="终止" value="删除"></el-option>
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

            <el-button @click="openDialog" type="primary" >新增</el-button>
            <el-button @click="reset" type="warning">暂停</el-button>
            <el-button @click="reset" type="danger">终止</el-button>
            <el-button @click="deleteSelected" type="danger">删除</el-button>
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
      <el-table-column prop="taskName" label="任务名称" width="200" />
      <el-table-column prop="adminName" label="创建者名称" width="200" />
      <el-table-column prop="frequency" label="执行周期" width="200" />
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
      <el-table-column prop="status" label="状态" width="200" />

      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button
              v-if="row.status !=='暂停'"
              size="small"
              type="text"
              @click="pauseTask(row.id)"
              :disabled="row.status === '不存在或者已清除'||row.status === '暂停'">
            暂停
          </el-button>

          <el-button
              v-else
              size="small"
              type="text"
              @click="resumeTask(row.id)"
              :disabled="row.status === '不存在或者已清除'||row.status === '正常'">
            恢复
          </el-button>

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
              @click="deleteUser(row.id)"
              :disabled="row.status === '不存在或者已清除'">
            删除
          </el-button>
          <el-button
              size="small"
              :disabled="row.status === '不存在或者已清除'">
            查看任务详情
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

    <el-dialog title="新增任务" v-model="dialogVisible">
      <el-form :model="newTask" label-width="120px">
        <el-form-item label="任务名称">
          <el-input v-model="newTask.taskName" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="公告标题">
          <el-input v-model="newTask.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="newTask.content" placeholder="公告内容" />
        </el-form-item>

        <el-form-item label="频率">
          <div>
            <el-input v-model="newTask.year" placeholder="选择年份 如果是每年请输入 * " />

            <el-form-item label="选择月份 不选择则默认每月" style="margin: 10px 0;">
              <el-checkbox-group v-model="newTask.months">
                <el-checkbox label="1" name="months">1月</el-checkbox>
                <el-checkbox label="2" name="months">2月</el-checkbox>
                <el-checkbox label="3" name="months">3月</el-checkbox>
                <el-checkbox label="4" name="months">4月</el-checkbox>
                <el-checkbox label="5" name="months">5月</el-checkbox>
                <el-checkbox label="6" name="months">6月</el-checkbox>
                <el-checkbox label="7" name="months">7月</el-checkbox>
                <el-checkbox label="8" name="months">8月</el-checkbox>
                <el-checkbox label="9" name="months">9月</el-checkbox>
                <el-checkbox label="10" name="months">10月</el-checkbox>
                <el-checkbox label="11" name="months">11月</el-checkbox>
                <el-checkbox label="12" name="months">12月</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择日期 不选择则默认每天" style="margin: 10px 0;">
              <el-checkbox-group v-model="newTask.days">
                <el-checkbox label="1" name="days">1</el-checkbox>
                <el-checkbox label="2" name="days">2</el-checkbox>
                <el-checkbox label="3" name="days">3</el-checkbox>
                <el-checkbox label="4" name="days">4</el-checkbox>
                <el-checkbox label="5" name="days">5</el-checkbox>
                <el-checkbox label="6" name="days">6</el-checkbox>
                <el-checkbox label="7" name="days">7</el-checkbox>
                <el-checkbox label="8" name="days">8</el-checkbox>
                <el-checkbox label="9" name="days">9</el-checkbox>
                <el-checkbox label="10" name="days">10</el-checkbox>
                <el-checkbox label="11" name="days">11</el-checkbox>
                <el-checkbox label="12" name="days">12</el-checkbox>
                <el-checkbox label="13" name="days">13</el-checkbox>
                <el-checkbox label="14" name="days">14</el-checkbox>
                <el-checkbox label="15" name="days">15</el-checkbox>
                <el-checkbox label="16" name="days">16</el-checkbox>
                <el-checkbox label="17" name="days">17</el-checkbox>
                <el-checkbox label="18" name="days">18</el-checkbox>
                <el-checkbox label="19" name="days">19</el-checkbox>
                <el-checkbox label="20" name="days">20</el-checkbox>
                <el-checkbox label="21" name="days">21</el-checkbox>
                <el-checkbox label="22" name="days">22</el-checkbox>
                <el-checkbox label="23" name="days">23</el-checkbox>
                <el-checkbox label="24" name="days">24</el-checkbox>
                <el-checkbox label="25" name="days">25</el-checkbox>
                <el-checkbox label="26" name="days">26</el-checkbox>
                <el-checkbox label="27" name="days">27</el-checkbox>
                <el-checkbox label="28" name="days">28</el-checkbox>
                <el-checkbox label="29" name="days">29</el-checkbox>
                <el-checkbox label="30" name="days">30</el-checkbox>
                <el-checkbox label="31" name="days">31</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择星期 不选择则默认每天" style="margin: 10px 0;">
              <el-checkbox-group v-model="newTask.weekdays">
                <el-checkbox label="1" name="weekdays">周一</el-checkbox>
                <el-checkbox label="2" name="weekdays">周二</el-checkbox>
                <el-checkbox label="3" name="weekdays">周三</el-checkbox>
                <el-checkbox label="4" name="weekdays">周四</el-checkbox>
                <el-checkbox label="5" name="weekdays">周五</el-checkbox>
                <el-checkbox label="6" name="weekdays">周六</el-checkbox>
                <el-checkbox label="7" name="weekdays">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-select v-model="newTask.hour" placeholder="选择小时 如果没有请选择 0">
              <el-option label="每小时" value="*"></el-option>
              <el-option label="0" value="0"></el-option>
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>
              <el-option label="6" value="6"></el-option>
              <el-option label="7" value="7"></el-option>
              <el-option label="8" value="8"></el-option>
              <el-option label="9" value="9"></el-option>
              <el-option label="10" value="10"></el-option>
              <el-option label="11" value="11"></el-option>
              <el-option label="12" value="12"></el-option>
              <el-option label="13" value="13"></el-option>
              <el-option label="14" value="14"></el-option>
              <el-option label="15" value="15"></el-option>
              <el-option label="16" value="16"></el-option>
              <el-option label="17" value="17"></el-option>
              <el-option label="18" value="18"></el-option>
              <el-option label="19" value="19"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="21" value="21"></el-option>
              <el-option label="22" value="22"></el-option>
              <el-option label="23" value="23"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTask">确 定</el-button>
        </span>
    </el-dialog>


    <el-dialog title="修改任务" v-model="updateDialogVisible">
      <el-form :model="updateTask" label-width="120px">
        <el-form-item label="任务名称">
          <el-input v-model="updateTask.taskName" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="公告标题">
          <el-input v-model="updateTask.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="updateTask.content" placeholder="公告内容" />
        </el-form-item>

        <el-form-item label="频率">
          <div>
            <el-input v-model="updateTask.year" placeholder="选择年份 如果是每年请输入 * " />

            <el-form-item label="选择月份 不选择则默认每月" style="margin: 10px 0;">
              <el-checkbox-group v-model="updateTask.months">
                <el-checkbox label="1" name="months">1月</el-checkbox>
                <el-checkbox label="2" name="months">2月</el-checkbox>
                <el-checkbox label="3" name="months">3月</el-checkbox>
                <el-checkbox label="4" name="months">4月</el-checkbox>
                <el-checkbox label="5" name="months">5月</el-checkbox>
                <el-checkbox label="6" name="months">6月</el-checkbox>
                <el-checkbox label="7" name="months">7月</el-checkbox>
                <el-checkbox label="8" name="months">8月</el-checkbox>
                <el-checkbox label="9" name="months">9月</el-checkbox>
                <el-checkbox label="10" name="months">10月</el-checkbox>
                <el-checkbox label="11" name="months">11月</el-checkbox>
                <el-checkbox label="12" name="months">12月</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择日期 不选择则默认每天" style="margin: 10px 0;">
              <el-checkbox-group v-model="updateTask.days">
                <el-checkbox label="1" name="days">1</el-checkbox>
                <el-checkbox label="2" name="days">2</el-checkbox>
                <el-checkbox label="3" name="days">3</el-checkbox>
                <el-checkbox label="4" name="days">4</el-checkbox>
                <el-checkbox label="5" name="days">5</el-checkbox>
                <el-checkbox label="6" name="days">6</el-checkbox>
                <el-checkbox label="7" name="days">7</el-checkbox>
                <el-checkbox label="8" name="days">8</el-checkbox>
                <el-checkbox label="9" name="days">9</el-checkbox>
                <el-checkbox label="10" name="days">10</el-checkbox>
                <el-checkbox label="11" name="days">11</el-checkbox>
                <el-checkbox label="12" name="days">12</el-checkbox>
                <el-checkbox label="13" name="days">13</el-checkbox>
                <el-checkbox label="14" name="days">14</el-checkbox>
                <el-checkbox label="15" name="days">15</el-checkbox>
                <el-checkbox label="16" name="days">16</el-checkbox>
                <el-checkbox label="17" name="days">17</el-checkbox>
                <el-checkbox label="18" name="days">18</el-checkbox>
                <el-checkbox label="19" name="days">19</el-checkbox>
                <el-checkbox label="20" name="days">20</el-checkbox>
                <el-checkbox label="21" name="days">21</el-checkbox>
                <el-checkbox label="22" name="days">22</el-checkbox>
                <el-checkbox label="23" name="days">23</el-checkbox>
                <el-checkbox label="24" name="days">24</el-checkbox>
                <el-checkbox label="25" name="days">25</el-checkbox>
                <el-checkbox label="26" name="days">26</el-checkbox>
                <el-checkbox label="27" name="days">27</el-checkbox>
                <el-checkbox label="28" name="days">28</el-checkbox>
                <el-checkbox label="29" name="days">29</el-checkbox>
                <el-checkbox label="30" name="days">30</el-checkbox>
                <el-checkbox label="31" name="days">31</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择星期 不选择则默认每天" style="margin: 10px 0;">
              <el-checkbox-group v-model="updateTask.weekdays">
                <el-checkbox label="1" name="weekdays">周一</el-checkbox>
                <el-checkbox label="2" name="weekdays">周二</el-checkbox>
                <el-checkbox label="3" name="weekdays">周三</el-checkbox>
                <el-checkbox label="4" name="weekdays">周四</el-checkbox>
                <el-checkbox label="5" name="weekdays">周五</el-checkbox>
                <el-checkbox label="6" name="weekdays">周六</el-checkbox>
                <el-checkbox label="7" name="weekdays">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-select v-model="updateTask.hour" placeholder="选择小时 如果没有请选择 0">
              <el-option label="每小时" value="*"></el-option>
              <el-option label="0" value="0"></el-option>
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>
              <el-option label="6" value="6"></el-option>
              <el-option label="7" value="7"></el-option>
              <el-option label="8" value="8"></el-option>
              <el-option label="9" value="9"></el-option>
              <el-option label="10" value="10"></el-option>
              <el-option label="11" value="11"></el-option>
              <el-option label="12" value="12"></el-option>
              <el-option label="13" value="13"></el-option>
              <el-option label="14" value="14"></el-option>
              <el-option label="15" value="15"></el-option>
              <el-option label="16" value="16"></el-option>
              <el-option label="17" value="17"></el-option>
              <el-option label="18" value="18"></el-option>
              <el-option label="19" value="19"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="21" value="21"></el-option>
              <el-option label="22" value="22"></el-option>
              <el-option label="23" value="23"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyTask">确 定</el-button>
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


const form = ref({
  taskName: '',
  adminName: '',
  startDate: null,
  endDate: null,
  status: ''
});

const currentPage=ref(1)
const pageSize=ref(10)
const totalUsers=ref(10)


const filteredUsers=ref([])
const selectTable=ref([])

const dialogVisible=ref(false)
const updateDialogVisible=ref(false)
const newTask=ref({
  taskName: '',
  title: '',
  content: '',
  year: '',
  months: [],
  days: [],
  weekdays: [],
  hour: '',
  minute:'*',
  second:'*',
  status: '',
  type:''
})

const updateTask=ref({
  taskName: '',
  title: '',
  content: '',
  year: '',
  months: [],
  days: [],
  weekdays: [],
  hour: '',
  minute:'*',
  second:'*',
  status: '',
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
  const response= await axios.get("http://localhost:8080/admin/task/getInfoList", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      adminName: form.value.adminName,
      taskName: form.value.taskName,
      startDate: form.value.startDate!==null?new Date(form.value.startDate):null,
      endDate: form.value.endDate!==null?new Date(form.value.endDate):null,
      status: form.value.status,
      currentPage: currentPage.value,
    }
  })

  if(response.data.code===200){
    filteredUsers.value=response.data.data.pageList
    totalUsers.value=response.data.data.total
    currentPage.value=response.data.data.pageNow
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

const handleSelectChange=(sel)=>{
  selectTable.value=sel;
}

const deleteSelected = () => {
  const selectedRows = selectTable.value; // 获取选中的行数据
  if (selectedRows.length === 0) {
    this.$message.warning('请至少选择一行');
    return;
  }

  console.info(selectedRows);

  // // 批量删除逻辑
  // selectedRows.forEach(row => {
  //   deleteUser(row.id); // 调用删除方法
  // });
  //
  // // 这里可以添加进一步的处理，比如更新数据源
  // this.$message.success('已删除选中用户');
};

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

const openDialog=()=> {
  dialogVisible.value = true;
}

const addTask= async ()=>{
  console.info(newTask.value)


  let year=newTask.value.year
  if(!year.toString().replace(/[^0-9*]/g,'')){
    ElMessage.error("年份输入不正确")
    return
  }
  let month=newTask.value.months.join(',')
  if(newTask.value.months.length===0){
    month="*"
  }
  if(!newTask.value.hour){
    ElMessage.error("时 需要选择")
  }
  let hour=newTask.value.hour

  let week;
  let day;

  if(newTask.value.weekdays.length>0&&newTask.value.days.length>0){
    ElMessage.error("周数和日期只能选择一个 否则会出现异常")
    return
  }else{
    if(newTask.value.weekdays.length>0){
      week=newTask.value.weekdays.join(",")
      day="?"
    }else if(newTask.value.days.length>0){
      day=newTask.value.days.join(",")
      week="?"
    }else{
      week="*"
      day="*"
    }
  }


  let corn=newTask.value.second+" "+newTask.value.minute+" "+
      hour+" "+day+" "+month+" "+week+" "+year


  console.info(corn)

  const param ={
    title: newTask.value.title,
    content: newTask.value.content,
    taskName: newTask.value.taskName,
    frequency:corn,
    static: 1 /*默认运行中*/,
    adminId: localStorage.getItem('id')
  }


  const response=await axios.post("http://localhost:8080/admin/task/setNewTask",param,{
    headers:{
      token: localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    ElMessage.success('任务添加成功')
  }else{
    ElMessage.error("任务添加失败")
  }

  console.info(corn)

}

const pauseTask=async (id)=>{
  const response=await axios.put("http://localhost:8080/admin/task/stopTask",{},{
    headers:{
      token:localStorage.getItem('token'),
    },
    params:{
      taskId:id,
    }
  })

  if(response.data.code===200){
    ElMessage.success(response.data.msg)
  }else{
    ElMessage.error(response.data.msg)
  }

  await getUserInfoList()
}

const resumeTask=async (id)=>{
  const response=await axios.put("http://localhost:8080/admin/task/resumeTask",{},{
    headers:{
      token:localStorage.getItem('token'),
    },
    params:{
      taskId:id,
    }
  })

  if(response.data.code===200){
    ElMessage.success(response.data.msg)

  }else{
    ElMessage.error(response.data.msg)
  }

  await getUserInfoList()
}


let rows=ref({})

const modifyVisible=(row)=>{
  updateDialogVisible.value = true

  updateTask.value.taskName=row.taskName
  updateTask.value.title=row.title
  updateTask.value.content=row.content

  rows=row

}

const modifyTask=async()=>{


  let year=updateTask.value.year
  console.info(year)
  if(!year.toString().replace(/[^0-9*]/g,'')){
    ElMessage.error("年份输入不正确")
    return
  }
  let month=updateTask.value.months.join(',')
  if(updateTask.value.months.length===0){
    month="*"
  }
  if(!updateTask.value.hour){
    ElMessage.error("时 需要选择")
  }
  let hour=updateTask.value.hour

  let week;
  let day;

  if(updateTask.value.weekdays.length>0&&updateTask.value.days.length>0){
    ElMessage.error("周数和日期只能选择一个 否则会出现异常")
    return
  }else{
    if(updateTask.value.weekdays.length>0){
      week=updateTask.value.weekdays.join(",")
      day="?"
    }else if(updateTask.value.days.length>0){
      day=updateTask.value.days.join(",")
      week="?"
    }else{
      week="*"
      day="*"
    }
  }


  let corn=updateTask.value.second+" "+updateTask.value.minute+" "+
      hour+" "+day+" "+month+" "+week+" "+year


  const param ={
    taskId: rows.id,
    title: updateTask.value.title,
    content: updateTask.value.content,
    taskName: updateTask.value.taskName,
    frequency:corn,
    adminId: localStorage.getItem('id')
  }

  console.info(rows.id)

  const response=await axios.post("http://localhost:8080/admin/task/updateTask",param,{
    headers:{
      token: localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    ElMessage.success('任务修改成功')
  }else{
    ElMessage.error("任务修改失败")
  }

  console.info(corn)

  await getUserInfoList()


}

</script>

<style scoped>

.userHead{
  width: 50px;
}
</style>
