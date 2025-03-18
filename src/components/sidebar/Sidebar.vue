<!-- Sidebar.vue -->
<template>
  <div class="sidebar">
    <ul>
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/blogs">博客</router-link></li>
      <li><router-link to="/comments">评论</router-link></li>
      <li><router-link to="/reports">举报</router-link></li>
    </ul>
  </div>
</template>

<script setup>
// 这里可以添加任何逻辑，比如 props 或 emits
</script>

<style scoped>
.sidebar {
  width: 200px; /* 设置宽度 */
  background-color: #f5f5f5;
  padding: 20px;
  height: 100vh; /* 使其占满整个高度 */
  position: fixed; /* 固定在左侧 */
  float: left;
  top: 0;
  left: 0;
  overflow-y: auto; /* 允许滚动 */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin-top: 100px;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  text-decoration: none;
  color: #333;
}

.sidebar a:hover {
  color: #007BFF;
}
</style>
