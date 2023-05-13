<template>
  <div>
    <ElCard shadow="never">
      <ElRow :gutter="20" justify="space-between">
        <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <div class="flex items-center">
            <img :src="userObj.image" alt="" class="w-70px h-70px rounded-[50%] mr-20px" />
            <div>
              <div class="text-20px text-700">
                你好，{{ userObj.userName }}，欢迎来到个人中心!
              </div>
              <div class="mt-10px text-14px text-gray-500"> 祝你开心每一天！ </div>
              <!-- {{ weather[0].city }}　{{ weather[0].temperature }}℃　{{ weather[0].weather }} -->
            </div>
          </div>
        </ElCol>
        <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
          <div class="flex h-70px items-center justify-end <sm:mt-18px">
            <div class="px-8px text-right">
              <div class="text-14px text-gray-400 mb-20px text-center">天气</div>
              <div v-if="weather && weather.length > 0">{{ weather[0].weather }}</div>
            </div>
            <ElDivider direction="vertical" />
            <div class="px-8px text-right">
              <div class="text-14px text-gray-400 mb-20px text-center">气温</div>
              <div v-if="weather && weather.length > 0">{{ weather[0].temperature }}℃</div>
            </div>
            <ElDivider direction="vertical" />
            <div class="px-8px text-right">
              <div class="text-14px text-gray-400 mb-20px text-center">城市</div>
              <div style="margin: 0, auto" v-if="weather && weather.length > 0">{{
                weather[0].city
              }}</div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElCard>

    <ElRow class="mt-20px" :gutter="20" justify="space-between">
      <ElCol :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-20px">
        <ElCard shadow="never">
          <template #header>
            <div class="flex justify-between">
              <span>快速跳转</span>
            </div>
          </template>

          <ElRow :gutter="10">
            <RouterLink to="/dashboard/analysis"
              ><ElButton style="margin-right: 10px">首页</ElButton></RouterLink
            >
            <RouterLink to="/components/trafficCase"
              ><ElButton style="margin-right: 10px">交通事故案件页面</ElButton></RouterLink
            >
            <RouterLink to="/components/trafficCase"
              ><ElButton style="margin-right: 10px">公路违章案件页面</ElButton></RouterLink
            >

            <RouterLink to="/road/property"
              ><ElButton style="margin-right: 10px">公路资产页面</ElButton></RouterLink
            >

            <RouterLink to="/road/patrol"><ElButton>巡查排班页面</ElButton></RouterLink>
          </ElRow>

          <!-- <br />
          <ElCol>ssss</ElCol>
          <br />
          <ElCol>ssss</ElCol> -->
        </ElCard>
      </ElCol>
      <ElCol :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-20px">
        <ElCard shadow="never">
          <div class="mb-10px flex justify-between">
            <span>个人具体信息</span>
            <ElLink :underline="false" style="font-weight: 550; color: #80cd46" @click="Edit()">
              编辑
            </ElLink>
          </div>
          <hr />
          <br />
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px"
            >姓　名: {{ queryTable.userName }}</ElCol
          >
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px"
            >用户名: {{ queryTable.nickName }}</ElCol
          >
          <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="mb-10px"
            >手　机:{{ queryTable.phone }}</ElCol
          >
          <ElCol :xl="12" :lg="12" :md="12" :sm="24" :xs="24" class="mb-10px"
            >权　限: {{ queryTable.role }}</ElCol
          >
          <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="mb-10px"
            >时　间: {{ queryTable.createTime }}</ElCol
          >
        </ElCard>
      </ElCol>
    </ElRow>

    <ElDialog v-model="dialogVisible" title="个人信息编辑" width="30%" draggable>
      <el-form :rules="rules">
        <ElFormItem label="姓　名:" prop="name">
          <ElInput placeholder="请输入内容" clearable v-model="queryTable.userName" />
        </ElFormItem>
        <ElFormItem label="用户名:" prop="userName">
          <el-input placeholder="请输入内容" clearable v-model="queryTable.nickName" />
        </ElFormItem>
        <ElFormItem label="手　机:" prop="phone">
          <el-input placeholder="请输入内容" clearable v-model="queryTable.phone" />
        </ElFormItem>
        <ElFormItem label="密　码:" prop="password">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryTable.password"
            :show-password="queryTable.password"
          />
        </ElFormItem>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reset()">取消</el-button>
          <el-button type="primary" @click="Save(queryTable)">确定</el-button>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElCard,
  ElDivider,
  ElLink,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  FormRules,
  ElMessage
} from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
// import { EChartsOption } from 'echarts'
// import { radarOption } from './echarts-data'
// import { getCountApi, getDynamicApi } from '@/api/dashboard/workplace'
// import type { WorkplaceTotal, Project, Dynamic } from '@/api/dashboard/workplace/types'
// import { set } from 'lodash-es'
// import { radarOption } from '../Dashboard/echarts-data'
// import AMap from '@amap/amap-jsapi-loader'

import axios from 'axios'
import AMapLoader from '@amap/amap-jsapi-loader'
import { EditUser } from '@/api/Authorization'
// import { testApi } from '@/api/table'
const dialogVisible = ref(false)
const rules = reactive<FormRules>({})

const Edit = () => {
  dialogVisible.value = true
}
//修改
const Save = (queryTable) => {
  EditUser(queryTable).then((res) => {
    if (res) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.warning('编辑失败')
    }
  })
  dialogVisible.value = false
}

// 个人信息

const userInfo: any = JSON.parse(sessionStorage.getItem('userInfo')) //字符串转换格式
console.log(userInfo)

//个人详细信息
const userObj = JSON.parse(userInfo.v)
console.log(userObj.userName, 'val')

function reset() {
  queryTable.id = userObj.id
  queryTable.nickName = userObj.nickName
  queryTable.password = userObj.password
  queryTable.phone = userObj.phone
  queryTable.userName = userObj.userName
  queryTable.role = userObj.role
  queryTable.createTime = userObj.createTime
  dialogVisible.value = false
}

const queryTable = reactive<{
  id: any
  nickName: any
  password: any
  phone: any
  userName: any
  role: any
  createTime: null
}>({
  id: userObj.id,
  nickName: userObj.nickName,
  password: userObj.password,
  phone: userObj.phone,
  userName: userObj.userName,
  role: userObj.role,
  createTime: userObj.createTime
})

console.log(queryTable, 'quer')

const options = {
  key: '0c51b8a0df1215976f3e9c65add89c0a',
  version: '2.0',
  plugins: ['AMap.Geolocation']
}
let city = ref('')

onMounted(() => {
  AMapLoader.load(options).then((AMap) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, // 是否使用高精度定位，默认为 true
      timeout: 10000, // 超时时间，单位毫秒，默认为 10000
      maximumAge: 0, // 最大定位结果缓存时间，单位毫秒，默认为 0
      convert: true // 是否使用坐标转换， 默认为 true
    })
    geolocation.getCityInfo(function (status, result) {
      console.log('1111111')

      if (status === 'complete') {
        city.value = result.city
        console.log('城市查询成功：', city.value)
        getWeather(city.value)
      } else {
        console.log('城市查询失败：', result)
      }
    })
  })
})
//查询天气
function getWeather(city) {
  axios
    .get(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=0c51b8a0df1215976f3e9c65add89c0a`
    )
    .then((res) => {
      weather.value = res.data.lives
      console.log(weather.value, '天气')
      loading.value = false
    })
}
const weather = ref('')
const loading = ref(true)

// 获取统计数
// let totalSate = reactive<WorkplaceTotal>({
//   project: 0,
//   access: 0,
//   todo: 0
// })

// const getCount = async () => {
//   const res = await getCountApi().catch(() => {})
//   if (res) {
//     totalSate = Object.assign(totalSate, res.data)
//   }
// }

// let projects = reactive<Project[]>([])

// 获取动态
// let dynamics = reactive<Dynamic[]>([])

// const getDynamic = async () => {
//   const res = await getDynamicApi().catch(() => {})
//   if (res) {
//     dynamics = Object.assign(dynamics, res.data)
//   }
// }

// 获取指数
// let radarOptionData = reactive<EChartsOption>(radarOption) as EChartsOption

// const getRadar = async () => {
//   const res = await getRadarApi().catch(() => {})
//   if (res) {
//     set(
//       radarOptionData,
//       'radar.indicator',
//       res.data.map((v) => {
//         return {
//           name: t(v.name),
//           max: v.max
//         }
//       })
//     )
//     set(radarOptionData, 'series', [
//       {
//         name: `xxx${t('workplace.index')}`,
//         type: 'radar',
//         data: [
//           {
//             value: res.data.map((v) => v.personal),
//             name: t('workplace.personal')
//           },
//           {
//             value: res.data.map((v) => v.team),
//             name: t('workplace.team')
//           }
//         ]
//       }
//     ])
//   }
// }

// const getAllApi = async () => {
//   await Promise.all([getCount(), getDynamic()])
//   loading.value = false
// }

// getAllApi()
</script>
