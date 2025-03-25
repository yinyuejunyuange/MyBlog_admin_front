<script setup>
  import Navigation from "@/navigation/Navigation.vue";
  import { onMounted, onBeforeUnmount } from "vue";

  // const clearToken = () => {
  //   localStorage.removeItem("token");
  // };
  //
  // onMounted(() => {
  //   // 添加 beforeunload 事件监听器
  //   window.addEventListener("beforeunload", clearToken);
  // });
  //
  // onBeforeUnmount(() => {
  //   // 移除 beforeunload 事件监听器
  //   window.removeEventListener("beforeunload", clearToken);
  // });
</script>

<template>
  <header>
  </header>
  <main>
    <RouterView></RouterView>
  </main>
</template>

<style scoped>


</style>
