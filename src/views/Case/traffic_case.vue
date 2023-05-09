//交通事故
<template>
  <ContentWrap
    :title="'巡查排版'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <div class="flex justify-between">
      <div>
        <ElButton @click="action('', 'add')" type="primary">登记违章</ElButton>
      </div>
      <div>
        <el-form :inline="true" label-width="30px">
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.id" placeholder="案件编号查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.user" placeholder="案件处理人查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElSelect
              v-model="queryTable.state"
              placeholder="案件处理状态查询"
              width="15"
              clearable
            >
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
      <ElTableColumn property="id" label="案件ID" align="center" />
      <ElTableColumn property="caseName" label="案件名" align="center" />
      <ElTableColumn property="user" label="处理人" align="center" />
      <ElTableColumn property="state" label="案件状态" align="center">
        <template #default="{ row }">
          <div v-if="row.state">
            <ElTag v-if="row.state == '0'">处理中</ElTag>
            <ElTag type="success" v-if="row.state == '1'">已完成</ElTag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn property="createTime" label="案件登记时间" align="center" width="110" />
      <ElTableColumn property="finishTime" label="结案时间" align="center" width="110">
        <template #default="{ row }">
          <span v-if="row.finishTime">{{ row.finishTime }}</span>
          <span v-else style="color: rgb(201 201 201)">暂无数据</span>
        </template>
      </ElTableColumn>
      <ElTableColumn property="data" label="案件信息" align="center" width="110" />
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
      <ElFormItem label="案件名" prop="caseName">
        <ElInput v-model="dialogValue.caseName" />
      </ElFormItem>
      <ElFormItem label="处理人" prop="user">
        <ElInput v-model="dialogValue.user" />
      </ElFormItem>
      <ElFormItem label="案件处理状态" prop="state">
        <ElRadioGroup v-model="dialogValue.state">
          <ElRadio label="0">处理中</ElRadio>
          <ElRadio label="1">已结束</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <el-form-item label="案件时间">
        <el-col :span="11">
          <ElDatePicker
            v-model="dialogValue.createTime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="登记时间"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="dialogValue.finishTime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="结束时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <ElFormItem label="案件信息" prop="data">
        <el-input v-model="dialogValue.data" type="textarea" />
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
  FormRules,
  ElFormItem,
  ElMessage,
  ElOption,
  ElSelect,
  ElMessageBox,
  ElDialog,
  ElRadioGroup,
  ElRadio
} from 'element-plus'
import { ref, reactive, watch, onMounted } from 'vue'
import { getCase, AddCase, deleteCase, EditCase } from '@/api/Case'
const actionType = ref('')
const loading = ref(true)
const options = [
  {
    value: '0',
    label: '处理中'
  },
  {
    value: '1',
    label: '已完成'
  }
]
const total = ref(0)
const tableData = ref([])
const queryTable = reactive<{
  pageSize: number
  pageNum: number
  total: number
  user: any
  id: any
  state: any
}>({
  pageSize: 5,
  pageNum: 1,
  total: 10,
  user: null,
  id: null,
  state: null
})
const dialogValue = reactive<{
  id: any
  caseName: any
  createTime: any
  finishTime: any
  data: any
  user: any
  state: any
}>({
  id: null,
  caseName: null,
  createTime: null,
  finishTime: null,
  data: null,
  user: null,
  state: null
})
const dialogVisible = ref(false)
const dialogTitle = ref('')
const rules = reactive<FormRules>({
  assetsCode: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
  assetsType: [{ required: true, message: '请输入资产类型', trigger: 'blur' }]
})
//分页查询
const handleSizeChange = (val: Number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
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

//查询获取数据
const getData = () => {
  loading.value = true
  getCase(queryTable)
    .then((res) => {
      tableData.value = res.data.list || {}
      total.value = res.data.total || 0
    })
    .finally(() => {
      loading.value = false
    })
}
//新增
const Add = async (dialogValueRef) => {
  AddCase(dialogValueRef).then((res) => {
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
  EditCase(dialogValue).then((res) => {
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
    deleteCase({ id: delId }).then((res) => {
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
//编辑&新增
const action = (row, type: string) => {
  dialogTitle.value = type === 'edit' ? '编辑用户信息' : '登记用户'
  actionType.value = type
  dialogVisible.value = true
  try {
    dialogValue.id = row.id
    dialogValue.caseName = row.caseName
    dialogValue.createTime = row.createTime
    dialogValue.finishTime = row.finishTime
    dialogValue.data = row.data
    dialogValue.user = row.user
    dialogValue.state = row.state
  } catch (error) {
    dialogValue.id = ''
    dialogValue.caseName = ''
    dialogValue.createTime = ''
    dialogValue.finishTime = ''
    dialogValue.data = ''
    dialogValue.user = ''
    dialogValue.state = ''
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
