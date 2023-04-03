<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { computed } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import dayjs from 'dayjs'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('footer')

const appStore = useAppStore()

const title = computed(() => appStore.getTitle)

let yeardate = dayjs().format('YYYY')
</script>

<template>
  <div
    :class="prefixCls"
    class="text-center text-13px mb-[1px] text-[var(--el-text-color-placeholder)] bg-[var(--app-content-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)]"
  >
    201909601060 郭宇嘉 ©2023-{{ yeardate }} {{ title }}
  </div>
</template>
