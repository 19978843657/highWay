<template>
  <div>
    <ElDialog
      v-model="pVisible"
      title="确认打印信息"
      width="700px"
      top="5vh"
      class="custom-dialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="card-wrap" id="PrintOrders">
        <div class="code-info-wrap info-small">
          <div class="left">
            <div class="item">
              <div class="label">编号:</div>
              <div class="value">{{ pData.id }}</div>
            </div>
            <div class="item">
              <div class="label">名称:</div>
              <div class="value">{{ pData.partName || '' }}</div>
            </div>
            <div class="item">
              <div class="label">类型:</div>
              <div class="value">{{ pData?.partNo || '' }}</div>
            </div>
            <div class="item">
              <div class="label">处理负责人:</div>
              <div class="value">{{ pData?.machineName || '' }}</div>
            </div>
            <div class="item">
              <div class="label">登记时间:</div>
              <div class="value">{{ pData.measureTypeName || '' }}</div>
            </div>
          <div class="right">
            <img :src="getQrcode(pData, 200)" alt="" />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose()">取消</el-button>
          <el-button type="primary" @click="print()"> 确认 </el-button>
        </span>
      </template>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
// import { NOrder } from '@/utils/type'
import qrcode from 'qrcode'
// import { postprint } from '@/api/order'
import { ElMessage,ElDialog } from 'element-plus'
const props = defineProps<{
   pVisible: any
  pData: []
}>()
const emits = defineEmits(['close'])
const getQrcode = (pData, size: number) => {
  const str =
  pData.id +
    '\r' +
    (pData.machineIndex || '') +
    '\r' +
    (pData.measureTypeIndex || '')
  let img = ''
  qrcode.toDataURL(
    str,
    {
      errorCorrectionLevel: 'H',
      width: size
    },
    function (err, url) {
      img = url
    }
  )
  return img ? img : ''
}
const print = () => {
  // const data = props.pData?.map((item) => item.id) || []
  try {
    
    let printHtml = window.document.getElementById('PrintOrders')?.innerHTML || ''
    let iframe: any = document.getElementById('print-order-iframe')
    if (!iframe) {
      iframe = document.createElement('IFRAME')
      iframe.setAttribute('id', 'print-order-iframe')
      iframe.setAttribute('style', 'width:90mm;height:45mm')
      document.body.appendChild(iframe)
      let doc = iframe.contentWindow.document
      doc.write(`<style>
    .code-info-wrap{width:100%;height:100%;display:flex;align-items:center;font-size:10px;}
    .code-info-wrap .left{flex:1;}
    .code-info-wrap .left .item{display:flex;}
    .code-info-wrap .left .item .label{min-width:15mm;}
    .code-info-wrap .left .item .value{}
    .code-info-wrap .right{}
    .code-info-wrap .right img{width:20mm;height:20mm;}
    </style>`)
      doc.write(printHtml)
      doc.close()
      iframe.contentWindow.focus()
    }

    setTimeout(function () {
      iframe.contentWindow.print()
      document.body.removeChild(iframe)
    }, 50)
  } catch (err) {
    ElMessage.error('打印出错，请重试')
  }
}

const handleClose = () => {
  emits('close')
}
</script>
<style lang="scss" scoped>
:deep(.#{$el-prefix}-form-item) {
  flex-direction: column;
}

:deep(.#{$el-prefix}-dialog__body) {
  padding: 10px 20px 0;
}

:deep(.#{$el-prefix}-select) {
  width: 100%;
}

.card-wrap {
  width: 100%;
  max-height: 70vh;
  padding: 5px 10px;
  box-sizing: border-box;
  overflow-y: auto;
}

.code-info-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border-radius: 8px;

  .left {
    flex: 1;
    margin-left: 24px;
    box-sizing: border-box;
  }

  .right {
    width: 180px;
    margin-right: 24px;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 12px 0;

    .label {
      width: 100px;
      font-size: 20px;
    }

    .value {
      font-size: 20px;
      flex: 1;
    }
  }

  &.info-small {
    margin-bottom: 20px;

    .item {
      padding: 3px 0;
    }
  }

  &.column {
    flex-direction: column;

    .value {
      flex: 1;
    }
  }
}
</style>
