//用户管理
<template>
  <ContentWrap
    :title="'用户管理'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <div class="flex justify-between">
      <div>
        <ElButton @click="action('', 'add')" type="primary">新增用户</ElButton>
      </div>
      <div>
        <el-form :inline="true" label-width="20px">
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.id" placeholder="用户ID查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.nickName" placeholder="用户名查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.userName" placeholder="姓名" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElSelect v-model="queryTable.role" placeholder="用户角色" width="15" clearable>
              <ElOption
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" class="w-60px" @click="getData()">
              <Icon icon="ep:search" class="mr-3px" />
              查询
            </ElButton>
          </ElFormItem>
        </el-form>
      </div>
    </div>

    <ElTable
      v-loading="loading"
      v-model:pageSize="queryTable.pageSize"
      v-model:currentPage="queryTable.pageNum"
      :data="tableData"
    >
      <ElTableColumn type="selection" />
      <ElTableColumn type="index" label="序号" align="center" width="55" />
      <ElTableColumn property="id" label="用户ID" align="center" />
      <ElTableColumn property="userName" label="姓名" align="center" />
      <ElTableColumn property="nickName" label="用户名" align="center" />
      <ElTableColumn property="password" label="密码" align="center" />
      <ElTableColumn property="role" label="用户角色" align="center">
        <template #default="{ row }">
          <div v-if="row.role">
            <ElTag type="info" v-if="row.role == '普通用户'">普通用户</ElTag>
            <ElTag type="warning" v-if="row.role == '管理员'">管理员</ElTag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn property="image" label="用户头像" align="center">
        <template #default="{ row }">
          <div v-if="row.image">
            <ElAvatar :size="45" :src="row.image" shape="square" fit="cover" />
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn property="phone" label="用户手机" align="center" />
      <ElTableColumn property="addres" label="用户住址" align="center" width="110" />
      <ElTableColumn property="createTime" label="用户创建时间" align="center" width="110" />
      <ElTableColumn label="操作" align="center">
        <template #default="{ row }">
          <Icon icon="ei:pencil" color="#90bb27" @click="action(row, 'edit')" class="icon" />
          <Icon icon="ei:trash" color="#f56c6c" @click="delData(row.id)" class="icon" />
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      small
      background
      layout=" prev, pager, next,sizes,total"
      v-model:currentPage="queryTable.pageNum"
      v-model:page-size="queryTable.pageSize"
      :page-sizes="[5, 10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
      class="pagination"
    />
  </ContentWrap>
  <ElDialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="dialogValueRef"
      :model="dialogValue"
      :rules="rules"
      label-width="120px"
      class="demo-dialogValue"
      status-icon
    >
      <ElRow>
        <ElCol :span="22">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="uploadUrl"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            accept=".jpg,.png"
            :on-success="handleUploadSuccess"
          >
            <template #trigger>
              <el-button type="primary">选择头像</el-button>
            </template>
            <el-button class="ml-3" type="success" @click="submitUpload"> 更新头像 </el-button>
            <template #tip>
              <div class="el-upload__tip text-red"> 新头像替换旧头像 </div>
            </template>
          </el-upload>
        </ElCol>

        <ElCol :span="1">
          <div class="block">
            <ElAvatar :size="50" :src="dialogValue.image" shape="square" fit="cover" />
          </div>
        </ElCol>
      </ElRow>
      <ElFormItem label="姓名" prop="userName">
        <ElInput v-model="dialogValue.userName" />
      </ElFormItem>
      <ElFormItem label="用户名" prop="nickName">
        <ElInput v-model="dialogValue.nickName" />
      </ElFormItem>
      <ElFormItem label="密码" prop="password">
        <ElInput v-model="dialogValue.password" />
      </ElFormItem>
      <ElFormItem label="手机" prop="phone">
        <ElInput v-model="dialogValue.phone" />
      </ElFormItem>
      <ElFormItem label="用户角色" prop="role">
        <ElRadioGroup v-model="dialogValue.role">
          <ElRadio label="普通用户">普通用户</ElRadio>
          <ElRadio label="管理员">管理员</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="用户地址(只用填写市、区)" prop="addres">
        <el-input v-model="dialogValue.addres" type="textarea" />
      </ElFormItem>
    </el-form>
    <template #footer>
      <ElButton
        v-if="actionType == 'edit'"
        type="primary"
        @click="Edit(dialogValue)"
        :loading="loading"
      >
        保存修改
      </ElButton>
      <ElButton v-else type="primary" @click="Add(dialogValue)" :loading="loading">
        新增用户
      </ElButton>
      <ElButton @click="dialogVisible = false">关闭弹窗</ElButton>
    </template>
  </ElDialog>
</template>
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import {
  ElButton,
  ElTableColumn,
  ElTable,
  ElTag,
  ElPagination,
  ElForm,
  ElInput,
  FormInstance,
  FormRules,
  ElFormItem,
  ElMessage,
  ElOption,
  ElSelect,
  ElMessageBox,
  ElDialog,
  ElRadioGroup,
  ElRadio,
  ElAvatar,
  ElUpload,
  ElRow,
  ElCol
} from 'element-plus'
import { ref, reactive, onMounted, watch } from 'vue'
import { getUser, AddUser, deleteUser, EditUser } from '@/api/Authorization'
import type { UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
const uploadUrl = ref('http://127.0.0.1:8088/File/UploadFile')
console.log(uploadUrl)
const upload = ref<UploadInstance | null>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
}
const handleUploadSuccess = (response: any) => {
  console.log(response.data)
  dialogValue.image = response.data
  EditUser(dialogValue).then(() => {
    getData()
  })
}
const submitUpload = () => {
  if (upload.value) {
    upload.value.submit()
  }
  console.log(upload, 'upload')
}
const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
})

const loading = ref(false)

const options = [
  {
    value: '普通用户',
    label: '普通用户'
  },
  {
    value: '管理员',
    label: '管理员'
  }
]
const total = ref(0)
const tableData = ref([])
const queryTable = reactive<{
  id: any
  nickName: any
  password: any
  phone: any
  userName: any
  role: any
  createTime: null
  pageNum: number
  pageSize: number
}>({
  id: null,
  nickName: null,
  password: null,
  phone: null,
  userName: null,
  role: null,
  createTime: null,
  pageNum: 1,
  pageSize: 5
})

const dialogValue = reactive<{
  id: any
  nickName: any
  password: any
  phone: any
  userName: any
  role: any
  addres: any
  image: any
}>({
  id: null,
  nickName: null,
  password: null,
  phone: null,
  userName: null,
  role: null,
  addres: null,
  image: state.squareUrl
})
const dialogVisible = ref(false)
const dialogTitle = ref('')

const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  assetsName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }]
})
const dialogValueRef = ref<FormInstance>()

//查询获取数据
const getData = () => {
  loading.value = true
  getUser(queryTable)
    .then((res) => {
      tableData.value = res.data.list || {}
      total.value = res.data.total || 0
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  () => queryTable.pageNum,
  () => {
    getData()
  }
)

watch(
  () => queryTable.pageSize,
  () => {
    // 当前页不为1时，修改页数后会导致多次调用getData方法
    if (queryTable.pageNum === 1) {
      getData()
    } else {
      queryTable.pageNum = 1
      getData()
    }
  }
)

//新增
const Add = async (dialogValueRef) => {
  AddUser(dialogValueRef).then((res) => {
    if (res) {
      ElMessage.success('登记成功')
    } else {
      ElMessage.warning('登记失败')
    }
    getData()
  })
  dialogVisible.value = false
}

//修改
const Edit = (dialogValue) => {
  EditUser(dialogValue).then((res) => {
    if (res) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.warning('编辑失败')
    }
    getData()
  })
  dialogVisible.value = false
}

//删除
const delData = (delId: number) => {
  console.log(delId, 'id')

  ElMessageBox.confirm('该操作将删除该条数据, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteUser({ id: delId }).then((res) => {
      if (res) {
        ElMessage.success('删除成功！')
        getData()
      } else {
        ElMessage.error('删除失败！')
      }
    })
  })
  getData()
}

//分页查询
const handleSizeChange = (val: Number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

//编辑&新增
const actionType = ref('')
const action = (row, type: string) => {
  console.log(row, 'row')

  dialogTitle.value = type === 'edit' ? '编辑用户信息' : '登记用户'
  actionType.value = type
  dialogVisible.value = true
  if (type === 'edit') {
    dialogValue.id = row.id
    dialogValue.nickName = row.nickName
    dialogValue.password = row.password
    dialogValue.phone = row.phone
    dialogValue.userName = row.userName
    dialogValue.role = row.role
    dialogValue.addres = row.addres
    dialogValue.image = row.image
  } else {
    dialogValue.id = ''
    dialogValue.nickName = ''
    dialogValue.password = ''
    dialogValue.phone = ''
    dialogValue.userName = ''
    dialogValue.role = ''
    dialogValue.addres = ''
    dialogValue.image = state.squareUrl
  }
}

onMounted(() => {
  getData()
})
</script>

<style>
.icon {
  margin-left: 10px !important;
  margin-right: 8px !important;
}
.icon span {
  margin-top: 15px !important;
  font-size: 30px !important;
}
.pagination {
  margin-top: 15px;
  margin-right: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
