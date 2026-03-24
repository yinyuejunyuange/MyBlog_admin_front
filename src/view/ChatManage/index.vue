<template>
  <div class="chat-container flex h-[85vh] w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/40 shadow-2xl backdrop-blur-xl bg-white/60">

    <div class="w-80 flex flex-col border-r border-slate-200/50 bg-white/30">
      <div class="p-6 border-b border-slate-200/30">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">消息</h2>
        <el-input
            v-model="searchKey"
            placeholder="搜索对话..."
            :prefix-icon="Search"
            class="mt-4 custom-search"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div
            v-for="item in contactList"
            :key="item.id"
            :class="['flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-white/40',
                   activeId === item.id ? 'bg-white/60 shadow-inner' : '']"
            @click="activeId = item.id"
        >
          <el-avatar :size="48" :src="item.avatar" class="border border-white shadow-sm" />
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1">
              <span class="font-bold text-slate-700 truncate text-sm">{{ item.name }}</span>
              <span class="text-[10px] text-slate-400">{{ item.time }}</span>
            </div>
            <p class="text-xs text-slate-500 truncate">{{ item.lastMsg }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-white/10 backdrop-blur-sm">
      <div class="px-6 py-4 border-b border-slate-200/30 flex items-center justify-between bg-white/20">
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-800">{{ currentChatUser?.name }}</span>
          <span class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
        </div>
        <el-icon class="cursor-pointer text-slate-400 hover:text-slate-600"><MoreFilled /></el-icon>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" id="message-box">
        <div v-for="(msg, index) in messages" :key="index"
             :class="['flex w-full', msg.isMe ? 'justify-end' : 'justify-start']">

          <div :class="['flex max-w-[70%] gap-3', msg.isMe ? 'flex-row-reverse' : 'flex-row']">
            <el-avatar :size="36" :src="msg.avatar" />
            <div :class="['flex flex-col', msg.isMe ? 'items-end' : 'items-start']">
              <div :class="['px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed',
                           msg.isMe ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100']">
                {{ msg.content }}
              </div>
              <span class="text-[10px] text-slate-400 mt-1 opacity-60">{{ msg.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-white/40 border-t border-slate-200/30">
        <div class="flex flex-col rounded-2xl bg-white/80 border border-slate-200/50 shadow-lg focus-within:border-slate-400 transition-all p-2">
          <textarea
              v-model="inputValue"
              placeholder="说点什么吧..."
              class="w-full h-24 bg-transparent border-none outline-none p-2 text-sm resize-none text-slate-700"
              @keyup.enter="handleSend"
          ></textarea>
          <div class="flex justify-between items-center px-2 pb-1">
            <div class="flex gap-2 text-slate-400">
            </div>
            <el-button
                type="primary"
                class="!rounded-xl !bg-slate-800 !border-slate-800 px-6"
                @click="handleSend"
            >发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, MoreFilled, Picture, FolderOpened, Microphone } from '@element-plus/icons-vue'

const activeId = ref(1)
const searchKey = ref('')
const inputValue = ref('')

const contactList = ref([
  { id: 1, name: '开发组长 - 老王', lastMsg: '那个 JVM 崩溃的问题修复了吗？', time: '14:20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 2, name: '产品经理 - 丽丽', lastMsg: '新增管理员表单需要加验证', time: '12:05', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: 3, name: '运维 - 小李', lastMsg: '服务器 CPU 占用过高，查一下', time: '昨天', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear' }
])

const messages = ref([
  { content: '我刚才在 IDEA 里写代码，jvm.dll 报错了。', isMe: false, time: '14:15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { content: '应该是 i9-14900HX 的电压问题，我已经尝试更新 BIOS 补丁了。', isMe: true, time: '14:16', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me' },
  { content: '好的，另外前端那个玻璃拟态的对话框逻辑写得不错。', isMe: false, time: '14:17', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
])

const currentChatUser = computed(() => contactList.value.find(u => u.id === activeId.value))

const handleSend = () => {
  if (!inputValue.value.trim()) return
  messages.value.push({
    content: inputValue.value,
    isMe: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'
  })
  inputValue.value = ''
  // 模拟自动滚动
  setTimeout(() => {
    const box = document.getElementById('message-box')
    box.scrollTop = box.scrollHeight
  }, 100)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 10px;
}

/* 玻璃容器的微光效果 */
.chat-container {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

textarea::placeholder {
  color: #cbd5e1;
}
</style>