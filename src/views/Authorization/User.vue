//用户管理
<template>
  <ContentWrap
    :title="'用户管理'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <!-- :schema="allSchemas.searchSchema" -->
    <!-- <Search :model="queryTable" @search="setSearchParams" @reset="setSearchParams" /> -->
    <div class="flex justify-between">
      <div>
        <ElButton @click="action('', 'add')" type="primary">新增用户</ElButton>
      </div>
      <div>
        <el-form :inline="true" label-width="30px">
          <ElFormItem class="query-form-item">
            <ElInput placeholder="资产编号查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElInput placeholder="资产名称查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElSelect placeholder="资产维修状态查询" width="15" clearable>
              <ElOption
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" class="w-60px">
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
      <!-- <ElTableColumn property="assetsName" label="巡警名称" align="center" /> -->
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
      <ElTableColumn property="phone" label="用户手机" align="center" />
      <ElTableColumn property="addres" label="用户住址" align="center" width="110">
        <!-- <template #default="{ row }">
          <ElTag type="info">{{ row.addres }}</ElTag>
        </template> -->
      </ElTableColumn>
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

  <!-- <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="dialogValueRef"
      :model="dialogValue"
      :rules="rules"
      label-width="120px"
      class="demo-dialogValue"
      status-icon
    >
      <ElFormItem label="资产编号" prop="assetsCode">
        <ElInput v-model="dialogValue.assetsCode" />
      </ElFormItem>
      <ElFormItem label="资产名称" prop="assetsName">
        <ElInput v-model="dialogValue.assetsName" />
      </ElFormItem>

      <ElFormItem label="资产类型" prop="assetsType">
        <ElRadioGroup v-model="dialogValue.assetsType">
          <ElRadio label="IT设备" />
          <ElRadio label="设备维修" />
          <ElRadio label="安全设备" />
          <ElRadio label="财务" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="资产维修状态" prop="state">
        <ElSwitch
          v-model="state2"
          @click="switch_state(dialogValue.state)"
          v-if="dialogValue.state == 0"
        />
        <ElSwitch v-model="state1" @click="switch_state(dialogValue.state)" v-else />
      </ElFormItem>
      <ElFormItem label="备注更多信息" prop="assetsData">
        <el-input v-model="dialogValue.assetsData" type="textarea" />
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
        新增资产
      </ElButton>
      <ElButton @click="dialogVisible = false">关闭弹窗</ElButton>
    </template>
  </Dialog> -->
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
  ElMessageBox
} from 'element-plus'
import { ref, reactive, onMounted, watch } from 'vue'
import { getUser, AddUser, deleteUser, EditUser } from '@/api/Authorization'
const loading = ref(false)

const options = [
  {
    value: '0',
    label: '未完成'
  },
  {
    value: '1',
    label: '已完成'
  }
]
const total = ref(0)
const tableData = ref([])
const queryTable = reactive<{
  assetsCode: any
  createTime: any
  assetsName: any
  state: any
  userId: any
  pageNum: number
  pageSize: number
}>({
  assetsCode: null,
  createTime: null,
  assetsName: null,
  state: null,
  userId: null,
  pageNum: 1,
  pageSize: 5
})

const dialogValue = reactive<{
  id: any
  assetsCode: any
  assetsName: any
  assetsType: any
  state: any
  assetsData: any
  userId: any
}>({
  id: null,
  assetsCode: null,
  assetsName: null,
  assetsType: null,
  state: 'false',
  assetsData: null,
  userId: null
})
const dialogVisible = ref(false)
const dialogTitle = ref('')

// const rules = reactive<FormRules>({
//   assetsCode: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
//   assetsName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }]
// })
// const dialogValueRef = ref<FormInstance>()

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
// const Add = async (dialogValueRef) => {
//   AddUser(dialogValueRef).then((res) => {
//     if (res) {
//       ElMessage.success('登记成功')
//     } else {
//       ElMessage.warning('登记失败')
//     }
//     getData()
//   })
//   dialogVisible.value = false
// }

// //修改
// const Edit = (dialogValue) => {
//   EditUser(dialogValue).then((res) => {
//     if (res) {
//       ElMessage.success('编辑成功')
//     } else {
//       ElMessage.warning('编辑失败')
//     }
//     getData()
//   })
//   dialogVisible.value = false
// }

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
  dialogTitle.value = type === 'edit' ? '编辑资产' : '登记资产'
  actionType.value = type
  dialogVisible.value = true
  try {
    if (row.state === 'true') {
      dialogValue.state = true
    } else {
      dialogValue.state = false
    }
    dialogValue.id = row.id
    dialogValue.assetsCode = row.assetsCode
    dialogValue.assetsName = row.assetsName
    dialogValue.assetsType = row.assetsType
    dialogValue.assetsData = row.assetsData
    dialogValue.userId = row.userId
  } catch (error) {
    dialogValue.assetsCode = ''
    dialogValue.assetsName = ''
    dialogValue.assetsType = ''
    dialogValue.assetsData = ''
    dialogValue.state = ''
    dialogValue.userId = ''
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
