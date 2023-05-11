<template>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <div style="width: 100%; height: 300px" ref="proChartRef"> </div>
      </ElCard>
    </ElCol>

    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <div style="width: 100%; height: 300px" ref="caseChartRef"> </div>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="never" class="mt-20px">
        <template #header>
          <div class="flex justify-between">
            <span>排班</span>
          </div>
        </template>
        <ElTable v-loading="loading" :data="tableData">
          <ElTableColumn property="userId" label="巡查人员ID" align="center" />
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
        </ElTable>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
// import { BorderBox1 } from '@dataview/datav-vue3'
import {
  ElRow,
  ElCol,
  ElCard,
  ElTableColumn,
  ElTable,
  ElTag,
  ElPagination,
  ElForm,
  ElInput,
  FormInstance,
  FormRules,
  ElFormItem,
  ElOption,
  ElSelect
} from 'element-plus'
// import { Echart } from '@/components/Echart'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getCountProperty } from '@/api/PropertyPatrol'
import { getCaseCount } from '@/api/case'
import { getPatrol } from '@/api/PropertyPatrol'
import { reactive } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'
import { onMounted } from 'vue'
// import type { AnalysisTotalTypes } from '@/api/dashboard/analysis/types'
// import { getDynamicApi } from '@/api/dashboard/workplace'
// import { useTimeAgo } from '@/hooks/web/useTimeAgo'
// import { Highlight } from '@/components/Highlight'
// import type { Dynamic } from '@/api/dashboard/workplace/types'
const { t } = useI18n()
const loading = ref(true)
const property: any = []
const cases: any = []
//资产
const proChartRef = ref<HTMLDivElement | null>(null)
let proChart: ECharts
const proOption: EChartsOption = {
  title: {
    text: '资产统计',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: property,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

//案件
const caseChartRef = ref<HTMLDivElement | null>(null)
let caseChart: ECharts
const caseOption: EChartsOption = {
  title: {
    text: '资产统计',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: cases,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
//排班
const tableData = ref([])
//查询获取数据
const getData = () => {
  loading.value = true
  getPatrol({ state: 1 })
    .then((res) => {
      tableData.value = res.data.list || {}
    })
    .finally(() => {
      loading.value = false
    })
}
function getCountProper() {
  getCountProperty({ assetsType: 0 })
    .then((res) => {
      for (let i in res.data) {
        const item = reactive({
          name: null,
          value: null
        })
        item.name = res.data[i].name
        item.value = res.data[i].count
        property.push(item)
      }
    })
    .finally(() => {
      loading.value = false
      console.log(property)
      proChart.setOption(proOption)
    })
}
function getCase() {
  getCaseCount({ caseType: 0 })
    .then((res) => {
      for (let i in res.data) {
        const item = reactive({
          name: null,
          value: null
        })
        item.name = res.data[i].name
        item.value = res.data[i].count
        cases.push(item)
      }
    })
    .finally(() => {
      loading.value = false
      caseChart.setOption(caseOption)
    })
}
getCountProper()
getCase()
getData()
onMounted(() => {
  proChart = init(proChartRef.value as HTMLElement)
  caseChart = init(caseChartRef.value as HTMLElement)
})
</script>
