//资产
<template>
  <ContentWrap
    :title="'资产管理'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <div class="flex justify-between" id="add_search">
      <div>
        <ElButton @click="action('', 'add')" type="primary">登记资产</ElButton>
      </div>
      <div>
        <el-form :inline="true" :model="queryTable" label-width="30px">
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.assetsCode" placeholder="资产编号查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElInput v-model="queryTable.assetsName" placeholder="资产名称查询" clearable />
          </ElFormItem>
          <ElFormItem class="query-form-item">
            <ElSelect
              v-model="queryTable.state"
              placeholder="资产维修状态查询"
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

    <!-- 表格 -->
    <ElTable
      v-model:pageSize="queryTable.pageSize"
      v-model:currentPage="queryTable.pageNum"
      :data="tableData"
      v-loading="loading"
    >
      <ElTableColumn type="selection" />
      <ElTableColumn type="index" label="序号" align="center" width="55" />
      <ElTableColumn property="assetsCode" label="资产编号" align="center" />
      <ElTableColumn property="assetsName" label="资产名称" align="center" />
      <ElTableColumn property="assetsType" label="资产类型" align="center" />
      <ElTableColumn property="userId" label="资产负责人" align="center" />
      <ElTableColumn property="status" label="资产维修状态" align="center">
        <template #default="{ row }">
          <div v-if="row.state">
            <ElTag v-if="row.state == 'true'">未完成</ElTag>
            <ElTag type="success" v-if="row.state == 'false'">已完成</ElTag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn property="createTime" label="资产登记时间" align="center" width="110" />
      <ElTableColumn property="finishTime" label="近期检修时间" align="center" width="110">
        <template #default="{ row }">
          <span v-if="row.finishTime">{{ row.finishTime }}</span>
          <span v-else style="color: rgb(201 201 201)">暂无数据</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="更多详情" align="center" width="80">
        <template #default="{ row }">
          <ElPopover placement="left" :width="100" trigger="hover">
            <template #reference>
              <img :src="getQrcode(row)" alt="" />
            </template>
          </ElPopover>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center">
        <template #default="{ row }">
          <Icon icon="ic:twotone-print" color="#1769aa" @click="Print(row)" class="icon" />
          <Icon icon="ei:pencil" color="#90bb27" @click="action(row, 'edit')" class="icon" />
          <Icon icon="ei:trash" color="#f56c6c" @click="delData(row.id)" class="icon" />
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- 分页 -->
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
  <!-- 弹窗 -->
  <Dialog v-model="dialogVisible" :title="dialogTitle">
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
      <ElFormItem label="资产负责人" prop="userId">
        <ElInput v-model="dialogValue.userId" />
      </ElFormItem>

      <!-- <ElFormItem label="时间 time" required>
        <el-col :span="11">
          <ElFormItem prop="date1">
            <el-date-picker
              v-model="ruleForm.date1"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </ElFormItem>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <ElFormItem prop="date2">
            <el-time-picker
              v-model="ruleForm.date2"
              label="Pick a time"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </ElFormItem>
        </el-col>
      </ElFormItem> -->

      <ElFormItem label="资产类型" prop="assetsType">
        <ElRadioGroup v-model="dialogValue.assetsType">
          <ElRadio label="IT设备" />
          <ElRadio label="设备维修" />
          <ElRadio label="安全设备" />
          <ElRadio label="财务" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="资产维修状态" prop="state">
        <ElSwitch v-model="dialogValue.state" />
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
  </Dialog>

  <PrintData :pVisible="pVisible" :pData="pData" />
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import {
  ElButton,
  ElTableColumn,
  ElTable,
  ElTag,
  ElPopover,
  ElPagination,
  ElForm,
  ElInput,
  FormInstance,
  FormRules,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElSwitch,
  ElMessage,
  ElOption,
  ElSelect,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, onMounted, watch } from 'vue'
import qrcode from 'qrcode'
import PrintData from '@/PrintData.vue'
import { getProperty, AddProperty, deleteProperty, EditProperty } from '@/api/PropertyPatrol'
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

const rules = reactive<FormRules>({
  assetsCode: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
  assetsName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }]
})
const dialogValueRef = ref<FormInstance>()
const pData = ref([])
const pVisible = ref(false)

//打印
const Print = (row) => {
  ElMessageBox.confirm('确定要打印此条数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    pData.value = row
  })
}

//查询获取数据
const getData = () => {
  loading.value = true
  getProperty(queryTable)
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
  AddProperty(dialogValueRef).then((res) => {
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
  EditProperty(dialogValue).then((res) => {
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
  ElMessageBox.confirm('该操作将删除该条数据, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteProperty({ id: delId }).then((res) => {
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
//二维码生成
const getQrcode = (row) => {
  const str =
    '资产编号：' +
    row.assetsCode +
    '\n资产名称：' +
    row.assetsName +
    '\n备注信息：' +
    row.assetsData
  let img = ''
  qrcode.toDataURL(
    str,
    {
      errorCorrectionLevel: 'H'
    },
    function (_error, url) {
      img = url
    }
  )
  return img ? img : ''
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

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
  margin-left: 11px !important;
  margin-right: 5px !important;
}
.icon span {
  margin-top: 15px !important;
  font-size: 28px !important;
}
.pagination {
  margin-top: 15px;
  margin-right: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
