import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' // 导入总的组件库
import 'element-plus/dist/index.css' // 导入样式
import router from './router/router.js'
import Echarts from "vue-echarts"
import * as echarts from "echarts"

createApp(App)
    .component("v-chart",Echarts)  /*全局注册组件*/
    .use(ElementPlus)
    .use(router)
    .mount('#app')

