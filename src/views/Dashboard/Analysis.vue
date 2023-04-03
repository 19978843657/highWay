<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="never" class="mt-20px">
        <template #header>
          <div class="flex justify-between">
            <span>{{ t('workplace.dynamic') }}</span>
            <ElLink type="primary" :underline="false">{{ t('workplace.more') }}</ElLink>
          </div>
        </template>
        <ElSkeleton :loading="loading" animated>
          <div v-for="(item, index) in dynamics" :key="`dynamics-${index}`">
            <div class="flex items-center">
              <img src="@/assets/imgs/avatar.png" alt="" />
              <div>
                <div class="text-14px">
                  <Highlight :keys="item.keys.map((v) => t(v))">
                    {{ t('workplace.pushCode') }}
                  </Highlight>
                </div>
                <div class="mt-15px text-12px text-gray-400">
                  {{ useTimeAgo(item.time) }}
                </div>
              </div>
            </div>
            <ElDivider />
          </div>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
// import { BorderBox1 } from '@dataview/datav-vue3'
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
// import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive } from 'vue'
import {
  getUserAccessSourceApi,
  getWeeklyUserActivityApi,
  getMonthlySalesApi
} from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
// import type { AnalysisTotalTypes } from '@/api/dashboard/analysis/types'
import { getDynamicApi } from '@/api/dashboard/workplace'
import { useTimeAgo } from '@/hooks/web/useTimeAgo'
import { Highlight } from '@/components/Highlight'
import type { Dynamic } from '@/api/dashboard/workplace/types'

const { t } = useI18n()

const loading = ref(true)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

let dynamics = reactive<Dynamic[]>([])

const getDynamic = async () => {
  const res = await getDynamicApi().catch(() => {})
  if (res) {
    dynamics = Object.assign(dynamics, res.data)
  }
}

// 用户来源
const getUserAccessSource = async () => {
  const res = await getUserAccessSourceApi().catch(() => {})
  if (res) {
    set(
      pieOptionsData,
      'legend.data',
      res.data.map((v) => t(v.name))
    )
    pieOptionsData!.series![0].data = res.data.map((v) => {
      return {
        name: t(v.name),
        value: v.value
      }
    })
  }
}

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getWeeklyUserActivity = async () => {
  const res = await getWeeklyUserActivityApi().catch(() => {})
  if (res) {
    set(
      barOptionsData,
      'xAxis.data',
      res.data.map((v) => t(v.name))
    )
    set(barOptionsData, 'series', [
      {
        name: t('analysis.activeQuantity'),
        data: res.data.map((v) => v.value),
        type: 'bar'
      }
    ])
  }
}

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

// 每月销售总额
const getMonthlySales = async () => {
  const res = await getMonthlySalesApi().catch(() => {})
  if (res) {
    set(
      lineOptionsData,
      'xAxis.data',
      res.data.map((v) => t(v.name))
    )
    set(lineOptionsData, 'series', [
      {
        name: t('analysis.estimate'),
        smooth: true,
        type: 'line',
        data: res.data.map((v) => v.estimate),
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: t('analysis.actual'),
        smooth: true,
        type: 'line',
        itemStyle: {},
        data: res.data.map((v) => v.actual),
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ])
  }
}

const getAllApi = async () => {
  await Promise.all([getUserAccessSource(), getWeeklyUserActivity(), getMonthlySales()])
  loading.value = false
}

getAllApi()
getDynamic()
</script>
