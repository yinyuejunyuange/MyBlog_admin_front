<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside class="m-aside">
      <div class="m-sysName">
        <img  src="../../resource/image/TuBiao.jpg" alt="" width="10%">
        <span class="m-nameText">书易博客管理平台</span>
      </div>
      <el-menu class="el-menu">

        <div>
          <el-menu-item
              @click="toggleSubMenu(null)"
              :style="{ color: activeMenu === ''  ? '#11cfd2' : '#e9e9e9' }"
              index="/dashboard"
          >
            <i class="el-icon-user"></i> 仪表盘
          </el-menu-item>
        </div>
        <div v-for="(item,index) in menuList " :key="item.id">
          <el-menu-item
              @click="toggleSubMenu(item)"
              :style="{ color: activeMenu === item.menuName  ? '#11cfd2' : '#e9e9e9' }"
              :index="item.url"
          >
            <i class="el-icon-user"></i> {{item.menuName}}
          </el-menu-item>
          <el-collapse v-if="activeMenu=== item.menuName ">
            <el-menu-item v-for="(items,index_s) in item.children"
                          :index="items.url"
                          @click="toggleChrMenu(items)"
            >{{items.menuName}}</el-menu-item>
          </el-collapse>
        </div>
      </el-menu>
    </el-aside>

    <!-- 右侧 -->
    <el-container class="right-container">
      <!-- 顶部菜单栏 -->
      <el-header class="top-header">
<!--        <img  alt="" style="width: 40px; border-radius: 50%; margin-right: 10px;">-->
        <span style="color: #4c5a73; font-weight: bold; font-size: 14px; margin-right: 20px">王小虎</span>
        <el-dropdown>
          <template  >
            <i class="el-icon-setting" style="margin-right: 15px"></i>
          </template>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <!-- 表单 -->
      <el-main>
<!--        <slot></slot>--> <!-- 用于插入其他内容 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from "axios";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
const router = useRouter()



const item = {
  date: '2016-05-02',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄'
};

const menuList=ref([])

onMounted(async ()=>{
  // 获取管理员对应的菜单
  const response=await axios.get('http://localhost:8080/admin/menu/getMenu',{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    menuList.value=response.data.data;
  }else{
    ElMessage.error(response.data.msg);
  }
})

const isSubMenuOpen = ref({
  userManagement: false,
  systemSettings: false,
  infoManagement: false,
});



const activeMenu = ref();

const isActive = (menu) => {
  return activeMenu.value === menu;
};

const toggleSubMenu = (menu) => {

  if(menu===null){
    activeMenu.value='';
    router.push("/");
    return
  }else{
    activeMenu.value = menu.menuName;
  }
  if(menu.menuUrl!==null){
    console.info(menu.menuUrl);
    router.push(menu.menuUrl);
  }
};

const toggleChrMenu =(menu)=>{
  // if(menu===null){
  //   activeMenu.value='';
  //   router.push("/");
  //   return
  // }else{
  //   activeMenu.value = menu.menuName;
  // }
  if(menu.menuUrl!==null){
    console.info(menu.menuUrl);
    router.push(menu.menuUrl);
  }
}

</script>

<style scoped>
.m-aside {
  /* 侧边栏样式 */
}

.m-sysName {
  display: flex;
  align-items: center;
  margin: 20px;
}

.m-sysName img{
  width: 60px;
  border-radius: 20%;
}

.m-nameText {
  margin-left: 10px;
  font-size: 20px;
}

/*左侧边栏*/
.m-aside{
  width:270px;
  background-color: #39465C;
  overflow: hidden;
  min-height: 100vh;
}
/*侧边栏上面logo*/
.m-sysName{
  height:70px;
  display:flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid #4c5a73;
}
/*侧边栏上面的文字*/
.m-nameText{
  color: #e4e7e6;
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}
/*侧边栏菜单栏*/
.el-menu{
  background-color: #39465C;
  border-right:none !important;
}
/*头部栏样式*/
.el-header {
  background-color: #ffffff;
  border-bottom: 1px solid gainsboro;
  color: #333;
  height: 70px !important;
  line-height: 70px;
}
/* 右侧背景颜色*/
.right-container{
  background-color: #EFF3F6;
  height: 100vh;
}
/*顶部居中*/
.top-header{
  font-size: 12px;
  /*设置垂直居中 先display:flex;在设置垂直居中，水平居右*/
  display: flex;
  align-items: center;
  justify-content: right;
}
/*侧边栏菜单一级字体颜色*/
.el-submenu__title{
  color: #e9e9e9;
}
/*侧边栏菜单悬浮背景颜色*/
.el-menu-item:hover, .el-submenu__title:hover {
  background: rgba(92, 113, 147, 0.24);

}
/*侧边栏二级字体颜色*/
.el-menu-item {
  color: #e9e9e9;
}

</style>
