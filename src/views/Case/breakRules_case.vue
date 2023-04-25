//公路违章
<template>
  <ContentWrap
    :title="'巡查排版'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <!-- :schema="allSchemas.searchSchema" -->
    <!-- <Search :model="queryTable" @search="setSearchParams" @reset="setSearchParams" /> -->
    <div class="flex justify-between">
      <div>
        <ElButton>新增巡查</ElButton>
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
      :data="TableData"
    >
      <ElTableColumn type="selection" />
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
      <ElTableColumn property="startTime" label="巡查开始时间" align="center" width="110" />
      <ElTableColumn property="endTime" label="巡查结束时间" align="center" width="110">
        <template #default="{ row }">
          <span v-if="row.endTime">{{ row.endTime }}</span>
          <span v-else style="color: rgb(201 201 201)">巡查还未结束</span>
        </template>
      </ElTableColumn>
      <ElTableColumn property="type" label="排班类型" align="center" />
      <ElTableColumn label="操作" align="center">
        <!-- <template #default="{ row }">
          <Icon icon="ei:pencil" color="#90bb27" class="icon" />
          <Icon icon="ei:trash" color="#f56c6c" class="icon" />
        </template> -->
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
      :total="queryTable.total"
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
// import { Search } from '@/components/Search'
// import { Dialog } from '@/components/Dialog'
import {
  ElButton,
  ElTableColumn,
  ElTable,
  ElTag,
  ElForm,
  ElInput,
  ElFormItem,
  ElOption,
  ElSelect,
  ElPagination
} from 'element-plus'
import { ref, reactive, watch, onMounted } from 'vue'
// import qrcode from 'qrcode'
import axios from 'axios'
import { getCaseData } from '@/api/table'
// const state1 = ref(false)
// const state2 = ref(true)
const loading = ref(true)
const TableData = ref([])
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
const queryTable = reactive<{
  pageSize: number
  pageNum: number
  total: number
  startTime: string
  endTime: string
  type: string
  remark: string
  state: string
  data: string
}>({
  pageSize: 5,
  pageNum: 1,
  total: 10,
  startTime: '',
  endTime: '',
  type: '',
  remark: '',
  state: '',
  data: ''
})
// const rules = reactive<FormRules>({
//   assetsCode: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
//   // assetsName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }],
//   assetsType: [{ required: true, message: '请输入资产类型', trigger: 'blur' }]
// })
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
    getTable()
  }
)

watch(
  () => queryTable.pageSize,
  () => {
    // 当前页不为1时，修改页数后会导致多次调用getTable方法
    if (queryTable.pageNum === 1) {
      getTable()
    } else {
      queryTable.pageNum = 1
      getTable()
    }
  }
)

//获取数据
const getTable = async () => {
  const res = await axios
    .get(
      `http://127.0.0.1:8088/Schedule/selectPageInfo?pageSize=${queryTable.pageSize}&pageNum=${queryTable.pageNum}`
    )
    .finally(() => {
      loading.value = false
    })
  // console.log(res, 'ssss')
  TableData.value = res.data.data.list || {}
  queryTable.total = res.data.data.total || {}
  // console.log(TableData.value, 'aaa')
}
getTable()

const getTable2 = () => {
  loading.value = true
  console.log('ggggggggggggg')

  getCaseData(queryTable)
    .then((res) => {
      console.log(res, 'hahhahahahahahhaahahah')
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getTable2()
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
