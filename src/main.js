import { createApp } from 'vue'

import App from './App.vue'
import ElementPlus from 'element-plus' // 导入总的组件库
import router from './router/router.js'
import Echarts from "vue-echarts"
import { createPinia } from 'pinia'
import { registerIcons} from "@/plugins/index.js";

import 'element-plus/dist/index.css' // 导入样式
import "@/common/css/index.css" // 打入 tailwind

const pinia = createPinia()

createApp(App)
    .component("v-chart",Echarts)  /*全局注册组件*/
    .use(ElementPlus)
    .use(router)
    .use(pinia)
    .use(registerIcons)
    .mount('#app')

