<template>

    <div>
      <div class="dashboard">
        <el-row gutter="20">
          <el-card class="card">
            <img src="../../resource/image/人人.png" alt="人" class="card-image" />
            <div class="card-content">
              <h3>总人数:</h3>
            </div>
            <p class="number">{{ userNum }}</p>
          </el-card>
          <el-card class="card">
            <img src="../../resource/image/博客.png" alt="" class="card-image" />
            <div class="card-content">
              <h3> 博客数 :</h3>
            </div>
            <p class="number">{{blogNum}}</p>
          </el-card>
          <el-card class="card">
            <img src="../../resource/image/评论.png" alt="" class="card-image" />
            <div class="card-content">
              <h3> 评论数: </h3>
            </div>
            <p class="number">{{   messageData   }}</p>
          </el-card>
          <el-card class="card">
            <img src="../../resource/image/举报.png" alt="" class="card-image" />
            <div class="card-content">
              <h3> 举报数: </h3>
            </div>
            <p class="number">{{  }}</p>
          </el-card>
        </el-row>
      </div>
    </div>

    <div>
      <div id="myChart" class="chart_component" style="width: 100%; height: 400px;"></div>
      <div id="zhu"  class="chart_component" style="width: 100%; height: 400px;"></div>
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


const messageData=ref();
const increaseBlog=ref({})
const userNum=ref(0);
const blogNum=ref(0);

const typeNums=ref([]);
const typeList=ref([]);


onMounted(async()=>{

  const response=await axios.get('http://localhost:8080/admin/getAllMessage',{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    messageData.value=response.data.data;
  }else{
    ElMessage.error(response.data.msg);
  }

  const increaseBlogResponse=await axios.get('http://localhost:8080/admin/getIncreaseBlog',{
    headers:{
      token:localStorage.getItem('token')
    }
  })
  if(increaseBlogResponse.data.code===200){
    increaseBlog.value=increaseBlogResponse.data.data
  }

  const chartDom = document.getElementById('myChart');
  const myChart = echarts.init(chartDom);

  const optionZhe = {
    title: {
      text: '每日博客增加数'
    },
    tooltip: {
      trigger: 'axis'
    }, /* 鼠标放在上面时 显示数据*/
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: increaseBlog.value.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '博客增加数',
        type: 'line',
        stack: 'Total',
        data: increaseBlog.value.numbers
      }
    ]
  };

  myChart.setOption(optionZhe);


  const chartDomZhu = document.getElementById('zhu');
  const myChartZhu = echarts.init(chartDomZhu);

  const BlogTypeResponse=await axios.get('http://localhost:8080/admin/getAllTypeNum',{
    headers:{
      token:localStorage.getItem('token')
    }
  })
  if(BlogTypeResponse.data.code===200){
    typeNums.value=BlogTypeResponse.data.data.typeNumList
    typeList.value=BlogTypeResponse.data.data.typeList
  }else{
    ElMessage.error(BlogTypeResponse.data.msg)
  }


  const optionZhu = {
    title: {
      text: '各种类博客数量'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: typeList.value,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: typeNums.value
      }
    ]
  };
  myChartZhu.setOption(optionZhu);

  const userResponse=await axios.get('http://localhost:8080/admin/getUserNum',{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(userResponse.data.code===200){
    userNum.value=userResponse.data.data;
  }else{
    ElMessage.error(userResponse.data.msg);
  }

  const blogResponse=await axios.get('http://localhost:8080/admin/getBlogNum',{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(blogResponse.data.code===200){
    blogNum.value=blogResponse.data.data;
  }else{
    ElMessage.error(blogResponse.data.msg);
  }




})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  margin-left: 200px;
}


.card{
  text-align: center;
  width: 20%;
  margin: 10px;
}
.card-image {

  float: left;
  position: relative;
  top:15px;
  width: 50px;
  height: 50px;
  margin-right: 10px;

}

.card-content {
  float: left;
  position: relative;
  left: 20px;
  margin-top: 10px;
}

.number {
  float: left;
  position: relative;
  top:5px;
  left: 40px;
  font-size: 24px;
  font-weight: bold;
}

.chart_component{
  display: inline-block;
}

.sidebar{
  display: flex;
}
</style>
