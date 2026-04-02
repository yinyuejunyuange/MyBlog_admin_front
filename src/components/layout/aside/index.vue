<template>
  <el-scrollbar>
    <el-menu
        :default-active="activeMenu"
        class="border-none bg-transparent pt-4"
    >
      <div class="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">控制台</div>

      <el-menu-item index="Dashboard" @click="goView('Dashboard')">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据看板</span>
      </el-menu-item>

      <el-menu-item index="BlogManage" @click="goView('BlogManage')" >
        <el-icon><EditPen /></el-icon>
        <span>博客管理</span>
      </el-menu-item>

      <el-menu-item index="UserManage" @click="goView('UserManage')">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>

      <el-menu-item index="ComRepManage" @click="goView('ComRepManage')">
        <el-icon><ChatDotRound /></el-icon>
        <span>评论管理</span>
      </el-menu-item>

      <el-menu-item index="KnowledgeBaseManage" @click="goView('KnowledgeBaseManage')">
        <el-icon><Folder /></el-icon>
        <span>知识库管理</span>
      </el-menu-item>

      <el-menu-item index="KnowledgePointManage" @click="goView('KnowledgePointManage')">
        <el-icon><Reading /></el-icon>
        <span>知识点管理</span>
      </el-menu-item>

      <el-menu-item index="QuestionManage" @click="goView('QuestionManage')">
        <el-icon><EditPen /></el-icon>
        <span>题目管理</span>
      </el-menu-item>

      <el-menu-item index="AdminManage" @click="goView('AdminManage')">
        <el-icon><Setting /></el-icon>
        <span>管理员管理</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue' // 引入 computed
import {
  DataAnalysis,
  EditPen,
  User,
  ChatDotRound,
  Setting,
  Folder, Reading
} from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()

// 核心逻辑：监听当前路由的名字
// 这样无论刷新还是跳转，activeMenu 永远等于当前页面的路由 name
const activeMenu = computed(() => {
  return route.name as string
})

const goView = (viewName: string) => {
  router.push({
    name: viewName
  })
}
</script>