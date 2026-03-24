<template>
  <el-scrollbar>
    <el-menu
        default-active="1"
        class="border-none bg-transparent pt-4"
    >
      <div class="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">控制台</div>
      <el-menu-item index="1" @click="goView('Dashboard')">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据看板</span>
      </el-menu-item>
      <el-menu-item index="2" @click="goView('BlogManage')" >
        <el-icon><EditPen /></el-icon>   <!-- 原为 Key，改为 EditPen 更符合“博客管理” -->
        <span>博客管理</span>
      </el-menu-item>
      <el-menu-item index="3" @click="goView('UserManage')">
        <el-icon><User /></el-icon>      <!-- 原为 Key，改为 User 对应“用户管理” -->
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="4" @click="goView('ComRepManage')">
        <el-icon><ChatDotRound /></el-icon> <!-- 原为 Key，改为 ChatDotRound 对应“评论管理” -->
        <span>评论管理</span>
      </el-menu-item>
      <el-menu-item index="5-1" @click="goView('KnowledgeBaseManage')">
        <el-icon><Folder /></el-icon>
        <span>知识库管理</span>
      </el-menu-item>

      <el-menu-item index="5-2" @click="goView('KnowledgePointManage')">
        <el-icon><Reading /></el-icon>
        <span>知识点管理</span>
      </el-menu-item>

      <el-menu-item index="5-3" @click="goView('QuestionManage')">
        <el-icon><EditPen /></el-icon>
        <span>题目管理</span>
      </el-menu-item>
      <el-menu-item index="6" @click="goView('AdminManage')">
        <el-icon><Setting /></el-icon>
        <span>管理员管理</span>
      </el-menu-item>
      <div class="px-4 py-2 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">个人中心</div>
      <el-menu-item index="7" @click="goView('ChatManage')">
        <el-icon><Bell /></el-icon>       <!-- 原为 Wallet，改为 Bell 更贴合“消息中心” -->
        <span>消息中心</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {
  DataAnalysis,
  EditPen,      // 新增导入
  User,         // 新增导入
  ChatDotRound, // 新增导入
  Message,      // 新增导入
  Setting,
  Bell, Folder, Reading          // 新增导入（替换原 Wallet）
} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const goView= (view) => {
  router.push({
    name: view
  })
}
</script>

<style scoped>

</style>