//巡查
<template>
  <ContentWrap
    :title="'巡查排班'"
    :message="'高速公路的巡查，对巡查人员的排班的表格，可管理巡查人员的排班信息，跟踪巡查人员动态。'"
  >
    <!-- :schema="allSchemas.searchSchema" -->
    <!-- <Search :model="queryTable" @search="setSearchParams" @reset="setSearchParams" /> -->
    <div class="flex justify-between">
      <div>
        <ElButton @click="action('', 'add')" type="primary">新增巡查</ElButton>
      </div>
      <div>
        <el-form :inline="true" :model="queryTable" label-width="30px">
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.userId" placeholder="人员ID查询" clearable />
          </ElFormItem>

          <ElFormItem class="query-form-item">
            <ElSelect v-model="queryTable.type" placeholder="排班类型查询" width="15" clearable>
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
      <!-- <ElTableColumn type="selection" /> -->
      <ElTableColumn type="index" label="序号" align="center" width="55" />
      <ElTableColumn property="userId" label="巡查人员ID" align="center" />
      <!-- <ElTableColumn property="assetsName" label="巡警名称" align="center" /> -->
      <ElTableColumn property="data" label="巡查信息" align="center" />
      <ElTableColumn property="status" label="巡查状态" align="center">
        <template #default="{ row }">
          <div v-if="row.state">
            <ElTag v-if="row.state == 0">未开始</ElTag>
            <ElTag type="success" v-if="row.state == 1">进行中</ElTag>
            <ElTag type="info" v-if="row.state == 2">已结束</ElTag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn property="startTime" label="巡查开始时间" align="center" width="110">
        <template #default="{ row }">
          <span v-if="row.startTime">{{ row.startTime }}</span>
          <span v-else style="color: rgb(201 201 201)">巡查未开始</span>
        </template>
      </ElTableColumn>
      <ElTableColumn property="endTime" label="巡查结束时间" align="center" width="110">
        <template #default="{ row }">
          <span v-if="row.endTime">{{ row.endTime }}</span>
          <span v-else style="color: rgb(201 201 201)">结束时间暂无</span>
        </template>
      </ElTableColumn>
      <ElTableColumn property="type" label="排班类型" align="center" />
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
      :page-sizes="[5, 8, 10, 20, 50, 100]"
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
      <ElFormItem label="巡查人员id" prop="userId">
        <ElInput v-model="dialogValue.userId" />
      </ElFormItem>
      <ElFormItem label="巡查信息" prop="data">
        <ElInput v-model="dialogValue.data" />
      </ElFormItem>

      <el-form-item label="Activity time">
        <ElCol :span="11">
          <ElTimePicker
            v-model="dialogValue.startTime"
            type="date"
            placeholder="开始时间"
            style="width: 100%"
          />
        </ElCol>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker
            v-model="dialogValue.endTime"
            placeholder="结束时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>

      <ElFormItem label="排班类型" prop="type">
        <ElSelect v-model="dialogValue.type" placeholder="排班类型查询" width="15" clearable>
          <ElOption
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="巡查状态" prop="state">
        <ElRadioGroup v-model="dialogValue.state">
          <ElRadio label="0">未开始</ElRadio>
          <ElRadio label="1">进行中</ElRadio>
          <ElRadio label="2">已结束</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="备注更多信息" prop="remark">
        <el-input v-model="dialogValue.remark" type="textarea" />
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
  </ElDialog>
</template>
<script setup lang="ts">
import { AddPatrol, deletePatrol, EditPatrol, getPatrol } from '@/api/PropertyPatrol'
import { ContentWrap } from '@/components/ContentWrap'
import {
  ElButton,
  ElDialog,
  ElTableColumn,
  ElTable,
  ElTag,
  ElPagination,
  ElForm,
  ElInput,
  FormInstance,
  FormRules,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElMessage,
  ElOption,
  ElSelect,
  ElMessageBox,
  ElTimePicker,
  ElCol
} from 'element-plus'
import { ref, reactive, onMounted, watch } from 'vue'
const dialogVisible = ref(false)
const dialogValueRef = ref<FormInstance>()
const dialogTitle = ref('')
const loading = ref(true)
const options = [
  {
    value: '早班',
    label: '早班'
  },
  {
    value: '晚班',
    label: '晚班'
  }
]
const total = ref(0)
const tableData = ref([])
const queryTable = reactive<{
  pageSize: number
  pageNum: number
  startTime: any
  endTime: any
  type: any
  remark: any
  state: any
  data: any
  userId: any
}>({
  pageSize: 5,
  pageNum: 1,
  startTime: null,
  endTime: null,
  type: null,
  remark: null,
  state: null,
  data: null,
  userId: null
})

const dialogValue = reactive<{
  id: any
  startTime: any
  endTime: any
  type: any
  state: any
  userId: any
  remark: any
  data: any
}>({
  id: null,
  startTime: null,
  endTime: null,
  type: null,
  state: null,
  userId: null,
  remark: null,
  data: null
})
const actionType = ref('')

const rules = reactive<FormRules>({
  userId: [{ required: true, message: '请输入巡查人员ID', trigger: 'blur' }],
  data: [{ required: true, message: '请输入巡查信息', trigger: 'blur' }]
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
  getPatrol(queryTable)
    .then((res) => {
      tableData.value = res.data.list || {}
      total.value = res.data.total || 0
    })
    .finally(() => {
      loading.value = false
    })
}

//编辑&新增
const action = (row, type: string) => {
  dialogTitle.value = type === 'edit' ? '编辑资产' : '登记资产'
  actionType.value = type
  dialogVisible.value = true
  try {
    dialogValue.id = row.id
    dialogValue.type = row.type
    dialogValue.state = row.state
    dialogValue.userId = row.userId
    dialogValue.remark = row.remark
    dialogValue.data = row.data
    dialogValue.state = row.state
  } catch (error) {
    dialogValue.type = ''
    dialogValue.remark = ''
    dialogValue.data = ''
    dialogValue.state = ''
    dialogValue.userId = ''
  }
}

//新增
const Add = async (dialogValueRef) => {
  AddPatrol(dialogValueRef).then((res) => {
    if (res) {
      ElMessage.success('登记成功')
    } else {
      ElMessage.warning('登记失败')
    }
    getData()
  })
  dialogVisible.value = false
  // getData()
}

//修改
const Edit = (dialogValue) => {
  EditPatrol(dialogValue).then((res) => {
    if (res) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.warning('编辑失败')
    }
    getData()
  })
  dialogVisible.value = false
  // getData()
}

//删除
const delData = (delId: number) => {
  console.log(delId, 'id')

  ElMessageBox.confirm('该操作将删除该条数据, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deletePatrol({ id: delId }).then((res) => {
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
