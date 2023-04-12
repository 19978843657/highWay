<template>
  <ElPagination
    background
    layout="total, sizes, prev, pager, next"
    v-model:currentPage="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :total="total"
    class="pagination"
  />
</template>
<script lang="ts" setup>
import { ElPagination } from 'element-plus'
import { ref } from 'vue'
const emits = defineEmits(['search'])
defineProps({
  total: {
    type: Number,
    default: 0
  }
})
const currentPage = ref(0)
const pageSize = ref(10)
const handleSizeChange = (val: number) => {
  pageSize.value = val
  emits('search', {
    page: currentPage.value,
    size: pageSize.value
  })
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emits('search', {
    page: currentPage.value,
    size: pageSize.value
  })
  console.log(`current page: ${val}`)
}
</script>
<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
