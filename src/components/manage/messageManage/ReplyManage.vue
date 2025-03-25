<template>
  <div>
    <div>
      <el-form :model="form" label-width="120px" style="max-width: 1000px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="博客名称">
              <el-input v-model="form.blogName" placeholder="输入博客名称" />
            </el-form-item>

            <el-form-item label="作者名称">
              <el-input v-model="form.userName" placeholder="输入作者名称" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="评论内容">
              <el-input v-model="form.comment" placeholder="输入评论内容" />
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
              <el-select v-model="form.isVisible" placeholder="选择状态">
                <el-option label="可见" value="0"></el-option>
                <el-option label="不可见" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="getBlogInfoList">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="filteredBlogs" style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="userName" label="用户名称" width="200" />
      <el-table-column prop="blogName" label="博客名称" width="200" />
      <el-table-column prop="comment" label="被回复的评论" width="200" />
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
          <el-select v-model="row.isVisible" placeholder="选择状态" @change="handleStatusChange(row)">
            <el-option label="不可见" value="1"></el-option>
            <el-option label="可见" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="deleteReply(row.id)">删除</el-button>
          <el-button size="small" type="primary" @click="viewBlogContent(row)">查看相关留言</el-button>
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

    <!-- 弹窗展示博客内容 -->
    <el-dialog v-model="dialogVisible" title="回复内容">
      <div>
        <p><strong>被回复的评论:</strong> {{ selectedBlog.comment }}</p>
        <p><strong>回复:</strong>{{ selectedBlog.context }} </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
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
  blogName: '',
  userName: '',
  comment: '',
  startDate: null,
  endDate: null,
  isVisible: ''
});

const currentPage=ref(1)
const pageSize=ref(10)
const totalUsers=ref(10)
const dialogVisible = ref(false);
const selectedBlog = ref({});

const filteredBlogs=ref([])

const statusMapping= {
  0: '可见',
  1: '不可见',

}

onMounted(async()=>{

  await getBlogInfoList()

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

const getBlogInfoList=async ()=>{
  const response= await axios.get("http://localhost:8080/admin/getReplyList", {
    headers: {
      token: localStorage.getItem("token"),
    },
    params: {
      blogName: form.value.blogName,
      userName: form.value.userName,
      comment: form.value.comment,
      startTime: form.value.startDate!==null?new Date(form.value.startDate):null,
      endTime: form.value.endDate!==null?new Date(form.value.endDate):null,
      isVisible: form.value.isVisible,
      currentPage: currentPage.value
    }
  })

  if(response.data.code===200){
    filteredBlogs.value=response.data.data.pageList.map(item=>{
      return {
        ...item,
        isVisible: statusMapping[item.isVisible] // 转换状态
      };
    })
    totalUsers.value=response.data.data.total
    currentPage.value=response.data.data.pageNow
    ElMessage.success(response.data.msg)
  }else{
    ElMessage.error("查询 失败")
  }
}

const handleCurrentChange = async (newPage) => {
  currentPage.value = newPage; // 更新 currentPage
  await getBlogInfoList(); // 重新获取数据
};

const viewBlogContent = (row) => {
  selectedBlog.value = row; // 设置选中的博客
  dialogVisible.value = true; // 显示对话框
};


const search = () => {
  console.log('搜索条件：', form.value);
  // 在这里添加你的搜索逻辑
};

const deleteReply =async (id)=>{
  const response=await axios.delete("http://localhost:8080/admin/deleteReply",{
    headers:{
      token: localStorage.getItem('token')
    },
    params:{
      replyId: id
    }
  })
  if(response.data.code===200){
    ElMessage.success(response.data.msg)
    await getBlogInfoList();
  }else{
    ElMessage.error(response.data.msg)
  }
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

const handleStatusChange=async (row)=>{

  const param={
    blogId: row.id,
    status: row.status
  }

  const response=await axios.put("http://localhost:8080/admin/updateBlogStatus",param,{
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

</script>

<style scoped>
.userHead{
  width: 50px;
}

.ellipsis {
  display: -webkit-box; /* 创建一个伸缩盒子模型 */
  -webkit-box-orient: vertical; /* 设置盒子的主轴为垂直方向 */
  -webkit-line-clamp: 2; /* 限制显示的行数为 2 行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
}
</style>
