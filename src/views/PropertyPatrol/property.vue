//资产
<template>
  <ContentWrap
    :title="'资产管理'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <!-- :schema="allSchemas.searchSchema" -->
    <!-- <Search :model="queryTable" @search="setSearchParams" @reset="setSearchParams" /> -->
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
    <!-- <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData(null, true)">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div> -->
    <!-- :columns="allSchemas.tableColumns" -->
    <!-- :pagination="{
        total: tableObject.total
      }" -->

    <!-- 表格 -->
    <ElTable
      v-model:pageSize="queryTable.pageSize"
      v-model:currentPage="queryTable.pageNum"
      :data="tableData"
      v-loading="loading"
    >
      <!-- @register="register" -->
      <!-- <template #empty>
        <el-empty description="description" />
      </template> -->
      <ElTableColumn type="selection" />
      <ElTableColumn type="index" label="序号" align="center" width="55" />
      <ElTableColumn property="assetsCode" label="资产编号" align="center" />
      <ElTableColumn property="assetsName" label="资产名称" align="center" />
      <ElTableColumn property="assetsType" label="资产类型" align="center" />
      <ElTableColumn property="userId" label="资产负责人" align="center" />
      <ElTableColumn property="status" label="资产维修状态" align="center">
        <template #default="{ row }">
          <div v-if="row.state">
            <ElTag v-if="row.state == 0">未完成</ElTag>
            <ElTag type="success" v-if="row.state == 1">已完成</ElTag>
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
            <img :src="getQrcode(row)" alt="" />
          </ElPopover>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center">
        <template #default="{ row }">
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
    <!-- <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="tableObject.currentRow" /> -->
    <!-- :form-schema="allSchemas.formSchema" -->
    <!-- <Detail v-if="actionType === 'detail'" :current-row="tableObject.currentRow" /> -->
    <!-- :detail-schema="allSchemas.detailSchema" -->
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
      <!-- <ElFormItem label="资产负责人" prop="count">
        <el-select-v2
          v-model="dialogValue.userId"
          placeholder="Activity count"
          :options="$options"
        />
      </ElFormItem> -->

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
  </Dialog>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
// import { Search } from '@/components/Search'
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
// import { Table } from '@/components/Table'
// import { getTableListApi, delTableListApi } from '@/api/table'
// import { useTable } from '@/hooks/web/useTable'
// import { TableData } from '@/api/table/types'
import { ref, reactive, onMounted, watch } from 'vue'
// import Write from './components/Write.vue'
// import Detail from './components/Detail.vue'
import qrcode from 'qrcode'
// import axios from 'axios'
import { getProperty, AddProperty, deleteProperty, EditProperty } from '@/api/PropertyPatrol'
const loading = ref(false)
const state1 = ref(false)
const state2 = ref(true)
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

const rules = reactive<FormRules>({
  assetsCode: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
  // assetsName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }],
  assetsType: [{ required: true, message: '请输入资产类型', trigger: 'blur' }]
})
const dialogValueRef = ref<FormInstance>()
// import axios from 'axios'
// import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { TableColumn } from '@/types/table'
// const Tabel_loading = ref(true)
// const { register, tableObject, methods } = useTable<TableData>({
//   getListApi: getTableListApi,
//   delListApi: delTableListApi,
//   response: {
//     list: 'list',
//     total: 'total'
//   },
//   defaultParams: {
//     title: 's'
//   }
// })
// const { getList } = methods
// getList()

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
      queryTable.pageSize = 1
      getData()
    }
  }
)

//新增
const Add = async (dialogValueRef) => {
  // const res = await axios.post(
  //   `http://127.0.0.1:8088/Assets/update?assetsName=${dialogValueRef.value.assetsName}&state=${dialogValueRef.value.state}&assetsType=${dialogValue.value.assetsType}`
  // )
  AddProperty(dialogValueRef).then((res) => {
    if (res) {
      ElMessage.success('登记成功')
    } else {
      ElMessage.warning('登记失败')
    }
  })
  getData()
  dialogVisible.value = false
}

//修改
const Edit = (dialogValue) => {
  // const res = await axios.put(
  //   `http://127.0.0.1:8088/Assets/update?id=${dialogValue.id}&state=${dialogValue.state}&assetsType=${dialogValue.assetsType}`
  // )
  EditProperty(dialogValue.id, dialogValue).then((res) => {
    if (res) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.warning('编辑失败')
    }
  })
  getData()
  dialogVisible.value = false
  getData()
}
//修改switch状态
const switch_state = (state) => {
  if (state == 0) {
    dialogValue.value.state = '1'
  } else {
    dialogValue.value.state = '0'
  }
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

// const propertyData = ref()
// const pageQuery = reactive<any>({
//   // 页数
//   pageSize: 10,
//   // 当前页
//   currentPage: 1,
//   // 总条数
//   total: 10
// })

// const getProperty = async () => {
//   // propertyData.value.loading = true
//   const res = await axios.get(
//     `http://127.0.0.1:8088/Assets/selectPageInfo?pageSize=${pageQuery.pageSize}&pageNum=${pageQuery.currentPage}`
//   )
//   // .finally(() => {
//   //   propertyData.value.loading = false
//   // })
//   console.log(res, '55555555')
//   propertyData.value = res.data.data.list
//   console.log(propertyData.value, 'hahahahaha')
// }
// getProperty()

// const queryTable = reactive<{}>

// const end_time = ref('')
// if (condition) {

// }
// const crudSchemas = reactive<CrudSchema[]>([
//   {
//     field: 'id',
//     label: t('tableDemo.index'),
//     type: 'index',
//     form: {
//       show: false
//     },
//     detail: {
//       show: false
//     }
//   },
//   {
//     field: 'assetsName',
//     label: '资产名称',
//     search: {
//       show: true
//     },
//     form: {
//       colProps: {
//         span: 24
//       }
//     },
//     detail: {
//       span: 24
//     }
//   },
//   {
//     field: 'assetsCode',
//     label: '资产编号'
//   },
//   {
//     field: 'createTime',
//     label: '资产维护时间',
//     form: {
//       component: 'DatePicker',
//       componentProps: {
//         type: 'datetime',
//         valueFormat: 'YYYY-MM-DD HH:mm:ss'
//       }
//     }
//   },
//   {
//     field: 'finishTime',
//     label: '检修完成时间',
//     form: {
//       component: 'DatePicker',
//       componentProps: {
//         type: 'datetime',
//         valueFormat: 'YYYY-MM-DD HH:mm:ss'
//       }
//     }
//   }
//   // {
//   //   field: 'importance',
//   //   label: t('tableDemo.importance'),
//   //   formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
//   //     return h(
//   //       ElTag,
//   //       {
//   //         type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger'
//   //       },
//   //       () =>
//   //         cellValue === 1
//   //           ? t('tableDemo.important')
//   //           : cellValue === 2
//   //           ? t('tableDemo.good')
//   //           : t('tableDemo.commonly')
//   //     )
//   //   },
//   //   form: {
//   //     component: 'Select',
//   //     componentProps: {
//   //       style: {
//   //         width: '100%'
//   //       },
//   //       options: [
//   //         {
//   //           label: '重要',
//   //           value: 3
//   //         },
//   //         {
//   //           label: '良好',
//   //           value: 2
//   //         },
//   //         {
//   //           label: '一般',
//   //           value: 1
//   //         }
//   //       ]
//   //     }
//   //   }
//   // },
//   // {
//   //   field: 'pageviews',
//   //   label: t('tableDemo.pageviews'),
//   //   form: {
//   //     component: 'InputNumber',
//   //     value: 0
//   //   }
//   // },
//   // {
//   //   field: 'content',
//   //   label: t('exampleDemo.content'),
//   //   table: {
//   //     show: false
//   //   },
//   //   form: {
//   //     component: 'Editor',
//   //     colProps: {
//   //       span: 24
//   //     }
//   //   },
//   //   detail: {
//   //     span: 24
//   //   }
//   // },
//   // {
//   //   field: 'action',
//   //   width: '260px',
//   //   label: t('tableDemo.action'),
//   //   form: {
//   //     show: false
//   //   },
//   //   detail: {
//   //     show: false
//   //   }
//   // }
// ])
// const { allSchemas } = useCrudSchemas(crudSchemas)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogValue = ref()
// const AddAction = () => {
//   dialogTitle.value = t('exampleDemo.add')
//   tableObject.currentRow = null
//   dialogVisible.value = true
//   actionType.value = ''
// }
//删除
// const delLoading = ref(false)

//删除
const delData = (id: number) => {
  console.log(id, 'id')

  ElMessageBox.confirm('该操作将删除该条数据, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteProperty(id).then((res) => {
      if (res) {
        ElMessage.success('删除成功！')
        getData()
      } else {
        ElMessage.error('删除失败！')
      }
    })
  })
  // tableObject.currentRow = row
  // const { delList, getSelections } = methods
  // const selections = await getSelections()
  // delLoading.value = true
  // await delList(
  //   multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
  //   multiple
  // ).finally(() => {
  //   delLoading.value = false
  // })
  getData()
}

//编辑&新增
const actionType = ref('')
const action = (row, type: string) => {
  dialogTitle.value = type === 'edit' ? '编辑资产' : '登记资产'
  actionType.value = type
  dialogValue.value = row
  dialogVisible.value = true
}
// const writeRef = ref<ComponentRef<typeof Write>>()
// const save = async () => {
//   const write = unref(writeRef)
//   await write?.elFormRef?.validate(async (isValid) => {
//     if (isValid) {
//       loading.value = true
//       const data = (await write?.getFormData()) as TableData
//       const res = await saveTableApi(data)
//         .catch(() => {})
//         .finally(() => {
//           loading.value = false
//         })
//       if (res) {
//         dialogVisible.value = false
//         tableObject.currentPage = 1
//         getList()
//       }
//     }
//   })
// }

onMounted(() => {
  getData()
  // Add()
  // Edit(dialogValue)
  // delData(id)
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
