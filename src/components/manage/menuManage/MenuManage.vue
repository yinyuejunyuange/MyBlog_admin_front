<template>
  <el-container>
    <el-header>
      <h2>菜单管理</h2>
    </el-header>
    <el-main>
      <el-button type="primary" @click="addMenu">添加菜单</el-button>
      <el-table :data="menuData" style="width: 100%">
        <el-table-column type="expand" >
          <template #default="{ row }">
            <div v-if="row.children && row.children.length">
              <el-table :data="row.children" style="width: 100%">
                <el-table-column prop="name" label="子菜单名称" />
                <el-table-column prop="url" label="路径" />
                <el-table-column prop="adminType" label="可见类型" />
                <el-table-column label="创建日期" width="200">
                  <template #default="{ row }">
                    {{ formatDate(row.createTime) }}
                  </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建者" />
                < <el-table-column label="修改日期" width="200">
                <template #default="{ row }">
                  {{ formatDate(row.updateTime) }}
                </template>
              </el-table-column>
                <el-table-column prop="updateBy" label="修改者" />
                <el-table-column prop="sort" label="排序(越小越靠前)" />
                <el-table-column label="操作">
                  <template #default="{ row: childRow }">
                    <el-button @click="editSonMenu(childRow)" >编辑</el-button>
                    <el-button type="danger" @click="deleteMenu(childRow)" >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="子菜单名称" />
        <el-table-column prop="url" label="路径" />
        <el-table-column prop="adminType" label="可见类型" />
        <el-table-column label="创建日期" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" />
        < <el-table-column label="修改日期" width="200">
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
        <el-table-column prop="updateBy" label="修改者" />
        <el-table-column prop="sort" label="排序(越小越靠前)" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="addSubMenu(row)" >添加子菜单</el-button>
            <el-button @click="editMenu(row)">编辑</el-button>
            <el-button type="danger" @click="deleteMenu(row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="添加" v-model="dialogVisible">
        <el-form :model="currentMenu">
          <el-form-item label="菜单名称">
            <el-input v-model="currentMenu.name" />
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="currentMenu.url" />
          </el-form-item>
          <el-form-item label="可见管理员">
            <el-checkbox-group v-model="currentMenu.adminTypes">
              <el-checkbox label="admin">Admin</el-checkbox>
              <el-checkbox label="super_admin">Super Admin</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="currentMenu.sort" />
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMenu">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="添加子菜单" v-model="dialogSonVisible">
        <el-form :model="currentSonMenu">
          <el-form-item label="菜单名称">
            <el-input v-model="currentSonMenu.name" />
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="currentSonMenu.url" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="currentSonMenu.sort" />
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="dialogSonVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveSonMenu">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="修改菜单" v-model="dialogUpdateVisible">
        <el-form :model="editorMenu">
          <el-form-item label="菜单名称">
            <el-input v-model="editorMenu.name" />
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="editorMenu.url" />
          </el-form-item>
          <el-form-item label="可见管理员">
            <el-checkbox-group v-model="editorMenu.adminTypes">
              <el-checkbox label="admin">Admin</el-checkbox>
              <el-checkbox label="super_admin">Super Admin</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="editorMenu.sort" />
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="dialogUpdateVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateMenu">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="修改子菜单" v-model="dialogSonUpdateVisible">
        <el-form :model="editorSonMenu">
          <el-form-item label="菜单名称">
            <el-input v-model="editorSonMenu.name" />
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="editorSonMenu.url" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="editorSonMenu.sort" />
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="dialogSonUpdateVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateSonMenu">确 定</el-button>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios'

const menuData = ref([]);

const dialogVisible = ref(false);
const dialogSonVisible = ref(false);
const dialogUpdateVisible= ref(false);
const dialogSonUpdateVisible = ref(false);
const currentMenu = ref({
  name: '',
  url: '',
  adminTypes:[],
  sort:null,
});

const currentSonMenu = ref({
  name: '',
  url: '',
  sort:null,
  parentId:''
});

const editorMenu = ref({
  id:'',
  name: '',
  url: '',
  adminTypes:[],
  sort:null,
});

const editorSonMenu = ref({
  id:'',
  name: '',
  url: '',
  sort:null,
});




onMounted(async ()=>{
  await getMenuAdmin()
})

const addSubMenu =(row)=>{
  currentSonMenu.value.parentId=row.id
  dialogSonVisible.value=true;
}

const addMenu =(row)=>{
  dialogVisible.value=true;
}

const getMenuAdmin=async ()=>{
  const response=await axios.get('http://localhost:8080/admin/menu/getMenuForManage',{
    headers:{
      token:localStorage.getItem('token')
    }
  })

  if(response.data.code===200){
    menuData.value=response.data.data;
    ElMessage.success(response.data.msg);
  }else{
    ElMessage.error(response.data.msg)
  }

}

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

const editMenu = (menu) => {
  editorMenu.value = { ...menu };
  dialogUpdateVisible.value = true;
};

const editSonMenu = (menu) => {
  editorSonMenu.value = { ...menu };
  dialogSonUpdateVisible.value = true;
};

const updateMenu=async()=>{
  const response = await axios.put('http://localhost:8080/admin/menu/modifyMenu', {
    id:editorMenu.value.id,
    name: editorMenu.value.name,
    url: editorMenu.value.url,
    adminTypes: editorMenu.value.adminTypes,
    sort: editorMenu.value.sort
  },{
    headers: {
      token: localStorage.getItem('token')
    }
  })

  if (response.data.code === 200) {
    ElMessage.success(response.data.msg);
    await getMenuAdmin()
    dialogUpdateVisible.value=false;
  } else {
    ElMessage.error(response.data.msg)
  }
}

const updateSonMenu=async()=>{
  const response = await axios.put('http://localhost:8080/admin/menu/modifySonMenu', {
    id:editorSonMenu.value.id,
    name: editorSonMenu.value.name,
    url: editorSonMenu.value.url,
    sort: editorSonMenu.value.sort
  },{
    headers: {
      token: localStorage.getItem('token')
    }
  })

  if (response.data.code === 200) {
    ElMessage.success(response.data.msg);
    await getMenuAdmin()
    dialogSonUpdateVisible.value=false
  } else {
    ElMessage.error(response.data.msg)
  }
}

const deleteMenu = async (menu) => {
  const response = await axios.delete('http://localhost:8080/admin/menu/deleteMenu', {
    params:{
      id: menu.id
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })

  if (response.data.code === 200) {
    ElMessage.success(response.data.msg);
    await getMenuAdmin()
  } else {
    ElMessage.error(response.data.msg)
  }
};



const saveMenu = async () => {
   const response=await axios.post('http://localhost:8080/admin/menu/addMenu',{
     name:currentMenu.value.name,
     url:currentMenu.value.url,
     adminTypes:currentMenu.value.adminTypes,
     sort:currentMenu.value.sort
   },{
     headers:{
       token:localStorage.getItem('token')
     }
   })
  if(response.data.code===200){
    ElMessage.success("添加成功");
    dialogVisible.value=false;
    await getMenuAdmin()
  }
};

const saveSonMenu=async ()=>{
  const response=await axios.post('http://localhost:8080/admin/menu/addSonMenu',{
    name:currentSonMenu.value.name,
    url:currentSonMenu.value.url,
    adminTypes:currentSonMenu.value.adminTypes,
    sort:currentSonMenu.value.sort,
    parentId:currentSonMenu.value.parentId
  },{
    headers:{
      token:localStorage.getItem('token')
    }
  })
  if(response.data.code===200){
    ElMessage.success("添加成功");
    dialogSonVisible.value=false;
    await getMenuAdmin()
  }
}

</script>

<style>
.el-header {
  background-color: #f5f5f5;
  padding: 10px;
}
.dialog-footer {
  text-align: right;
}
</style>
