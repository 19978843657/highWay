<template>
  <div>
    <ElCard shadow="never">
      <ElSkeleton :loading="loading" animated>
        <ElRow :gutter="20" justify="space-between">
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <img
                src="@/assets/imgs/avatar.png"
                alt=""
                class="w-70px h-70px rounded-[50%] mr-20px"
              />
              <div>
                <div class="text-20px text-700"> 你好，Archer，{{ t('workplace.happyDay') }} </div>
                <div class="mt-10px text-14px text-gray-500"> <vMiniWeather /> ℃ </div>
              </div>
            </div>
          </ElCol>
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex h-70px items-center justify-end <sm:mt-20px">
              <div class="px-8px text-right">
                <div class="text-14px text-gray-400 mb-20px">{{ t('workplace.project') }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="totalSate.project"
                  :duration="2600"
                />
              </div>
              <ElDivider direction="vertical" />
              <div class="px-8px text-right">
                <div class="text-14px text-gray-400 mb-20px">{{ t('workplace.toDo') }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="totalSate.todo"
                  :duration="2600"
                />
              </div>
              <ElDivider direction="vertical" border-style="dashed" />
              <div class="px-8px text-right">
                <div class="text-14px text-gray-400 mb-20px">{{ t('workplace.access') }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="totalSate.access"
                  :duration="2600"
                />
              </div>
            </div>
          </ElCol>
        </ElRow>
      </ElSkeleton>
    </ElCard>
  </div>

  <ElRow class="mt-20px" :gutter="20" justify="space-between">
    <ElCol :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-20px">
      <ElCard shadow="never">
        <template #header>
          <div class="flex justify-between">
            <span>快速跳转</span>
          </div>
        </template>
        <ElSkeleton :loading="loading" animated>
          <ElRow>
            <ElCol
              v-for="(item, index) in projects"
              :key="`card-${index}`"
              :xl="8"
              :lg="8"
              :md="12"
              :sm="24"
              :xs="24"
            >
              <ElCard shadow="hover">
                <div class="flex items-center">
                  <Icon :icon="item.icon" :size="25" class="mr-10px" />
                  <span class="text-16px">{{ item.name }}</span>
                </div>
                <div class="mt-15px text-14px text-gray-400">{{ t(item.message) }}</div>
                <div class="mt-20px text-12px text-gray-400 flex justify-between">
                  <span>{{ item.personal }}</span>
                  <span>{{ formatTime(item.time, 'yyyy-MM-dd') }}</span>
                </div>
              </ElCard>
            </ElCol>
          </ElRow>
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-20px">
      <ElCard shadow="never">
        <div class="mb-10px flex justify-between">
          <span>个人具体信息</span>
          <ElLink :underline="false" style="font-weight: 550; color: #80cd46"> 编辑 </ElLink>
        </div>
        <hr />
        <br />
        <ElSkeleton :loading="loading" animated>
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px">姓　名:</ElCol>
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px">用户名:</ElCol>
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px">密　码:</ElCol>
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px">权　限:</ElCol>
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { ElRow, ElCol, ElSkeleton, ElCard, ElDivider, ElLink } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive } from 'vue'
import { CountTo } from '@/components/CountTo'
import { formatTime } from '@/utils'
import { EChartsOption } from 'echarts'
// import { radarOption } from './echarts-data'
import { getCountApi, getDynamicApi, getRadarApi } from '@/api/dashboard/workplace'
import type { WorkplaceTotal, Project, Dynamic } from '@/api/dashboard/workplace/types'
import { set } from 'lodash-es'
import { radarOption } from '../Dashboard/echarts-data'
// import AMap from '@amap/amap-jsapi-loader'
import axios from 'axios'

import AMapLoader from '@amap/amap-jsapi-loader'

const options = {
  key: '0c51b8a0df1215976f3e9c65add89c0a',
  version: '2.0',
  plugins: ['AMap.Geolocation']
}

AMapLoader.load(options).then((AMap) => {
  const geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, // 是否使用高精度定位，默认为 true
    timeout: 10000, // 超时时间，单位毫秒，默认为 10000
    maximumAge: 0, // 最大定位结果缓存时间，单位毫秒，默认为 0
    convert: true // 是否使用坐标转换， 默认为 true
  })

  geolocation.getCurrentPosition(function (status, result) {
    console.log(status)

    if (status === 'complete') {
      console.log('定位成功：', result)
      const location = result.position // 获取定位的经纬度信息
      const address = result.formattedAddress // 获取定位的详细地址信息
      // 这里可以继续根据经纬度信息获取天气信息
      console.log(location, address, '111')
    } else {
      console.log('定位失败：', result)
    }
  })
})

axios
  .get(
    `https://restapi.amap.com/v3/weather/weatherInfo?city=110101&key=0c51b8a0df1215976f3e9c65add89c0a`
  )
  .then((ret) => {
    console.log(ret.data)
  })

const loading = ref(true)

// let weather: any
// let lower: any
// let higher: any
//获取天气
// const getWeather = () => {
//   // '//'是解决掉指向加上vue里指向的后台地址http://localhost:8080问题
//   axios
//     .get('//' + 'http://www.weather.com.cn/data/cityinfo/101010100.html')
//     .then((res) => {
//       debugger
//       weather = res.data.data.forecast[0].type ? res.data.data.forecast[0].type : ''
//       lower = res.data.data.forecast[0].low.substr(2)
//       higher = res.data.data.forecast[0].high.substr(2)
//       console.log(res.data.data)
//       console.log(weather, lower, higher, '222')
//     })
//     // eslint-disable-next-line prettier/prettier
//     .catch( (error)=>{
//       console.log(error)
//     })
// }

// 获取统计数
let totalSate = reactive<WorkplaceTotal>({
  project: 0,
  access: 0,
  todo: 0
})

const getCount = async () => {
  const res = await getCountApi().catch(() => {})
  if (res) {
    totalSate = Object.assign(totalSate, res.data)
  }
}

let projects = reactive<Project[]>([])

// 获取动态
let dynamics = reactive<Dynamic[]>([])

const getDynamic = async () => {
  const res = await getDynamicApi().catch(() => {})
  if (res) {
    dynamics = Object.assign(dynamics, res.data)
  }
}

// 获取指数
let radarOptionData = reactive<EChartsOption>(radarOption) as EChartsOption

const getRadar = async () => {
  const res = await getRadarApi().catch(() => {})
  if (res) {
    set(
      radarOptionData,
      'radar.indicator',
      res.data.map((v) => {
        return {
          name: t(v.name),
          max: v.max
        }
      })
    )
    set(radarOptionData, 'series', [
      {
        name: `xxx${t('workplace.index')}`,
        type: 'radar',
        data: [
          {
            value: res.data.map((v) => v.personal),
            name: t('workplace.personal')
          },
          {
            value: res.data.map((v) => v.team),
            name: t('workplace.team')
          }
        ]
      }
    ])
  }
}

const getAllApi = async () => {
  await Promise.all([getCount(), getDynamic(), getRadar()])
  loading.value = false
}

getAllApi()
// getWeather()
const { t } = useI18n()
</script>
