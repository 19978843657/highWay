//资产
<template>
  <ContentWrap
    :title="'资产管理'"
    :message="'高速公路的资产管理，展示资产编号、名称、类型、负责人等信息，可以扫描二维码查看详细信息。'"
  >
    <!-- :schema="allSchemas.searchSchema" -->
    <Search :model="queryTable" @search="setSearchParams" @reset="setSearchParams" />

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
    <ElTable
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      v-loading="tableObject.loading"
      @register="register"
    >
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
          <Icon icon="ei:trash" color="#f56c6c" @click="delData(row, false)" class="icon" />
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      small
      background
      layout=" prev, pager, next,sizes,total"
      v-model:currentPage="tableObject.currentPage"
      v-model:page-size="tableObject.pageSize"
      :page-sizes="[5, 10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="tableObject.total"
      class="pagination"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <!-- <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="tableObject.currentRow" /> -->
    <!-- :form-schema="allSchemas.formSchema" -->
    <!-- <Detail v-if="actionType === 'detail'" :current-row="tableObject.currentRow" /> -->
    <!-- :detail-schema="allSchemas.detailSchema" -->
    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTableColumn, ElTable, ElTag, ElPopover, ElPagination } from 'element-plus'
// import { Table } from '@/components/Table'
import { getTableListApi, delTableListApi } from '@/api/table'
import { useTable } from '@/hooks/web/useTable'
import { TableData } from '@/api/table/types'
import { ref, reactive } from 'vue'
// import Write from './components/Write.vue'
// import Detail from './components/Detail.vue'
import qrcode from 'qrcode'

// import axios from 'axios'
// import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { TableColumn } from '@/types/table'
// const Tabel_loading = ref(true)
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getTableListApi,
  delListApi: delTableListApi,
  response: {
    list: 'list',
    total: 'total'
  },
  defaultParams: {
    title: 's'
  }
})

const { getList, setSearchParams } = methods

getList()

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

const queryTable = reactive<{}>

const { t } = useI18n()

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
// const AddAction = () => {
//   dialogTitle.value = t('exampleDemo.add')
//   tableObject.currentRow = null
//   dialogVisible.value = true
//   actionType.value = ''
// }
//删除
const delLoading = ref(false)
const delData = async (row, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}
const actionType = ref('')
const action = (row, type: string) => {
  dialogTitle.value = type === 'edit' ? '编辑' : '新增'
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}
// const writeRef = ref<ComponentRef<typeof Write>>()
const loading = ref(false)
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
