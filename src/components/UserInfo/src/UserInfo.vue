<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { loginOutApi } from '@/api/login'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { wsCache } = useCache()

const { replace } = useRouter()

const loginOut = () => {
  ElMessageBox.confirm('是否退出本系统？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await loginOutApi().catch(() => {})
      if (res) {
        wsCache.clear()
        tagsViewStore.delAllViews()
        resetRouter() // 重置静态路由表
        replace('/login')
      }
    })
    .catch(() => {})
}
const userInfo: any = JSON.parse(sessionStorage.getItem('userInfo')) //字符串转换格式
console.log(userInfo)

//个人详细信息
const userObj = JSON.parse(userInfo.v)
console.log(userObj.userName, 'val')
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img :src="userObj.image" alt="" class="w-[calc(var(--logo-height)-25px)] rounded-[50%]" />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">Archer</span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="loginOut">退出登录</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
