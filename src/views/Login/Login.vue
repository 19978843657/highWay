<template>
  <div
    :class="prefixCls"
    class="h-[100%] relative <xl:bg-v-dark <sm:px-10px <xl:px-10px <md:px-10px"
  >
    <div class="relative h-full flex mx-auto">
      <div
        :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px <xl:hidden`"
      >
        <div class="flex items-center relative text-white">
          <!-- <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" /> -->
          <span class="text-22px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <div class="flex justify-center items-center h-[calc(100%-60px)]">
          <TransitionGroup
            appear
            tag="div"
            enter-active-class="animate__animated animate__bounceInLeft"
          >
            <!-- <img src="@/assets/svgs/数据监测.svg" key="1" alt="" class="w-350px" /> -->
            <img src="@/assets/imgs/3dlogin2.png" key="1" alt="" class="w-305px" />
            <!-- <img src="@/assets/imgs/Line_chart.png" key="1" alt="" class="w-350px" /> -->
            <div class="text-1xl text-white" key="2" style="margin-top: 40px; margin-left: -50px"
              >欢迎使用！让高速路政管理更加高效！</div
            >
          </TransitionGroup>
        </div>
      </div>
      <div class="flex-1 p-30px <sm:p-10px dark:bg-v-dark relative">
        <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <!-- <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div> -->

          <div class="flex justify-end items-center space-x-10px">
            <ThemeSwitch />
            <!-- <LocaleDropdown class="<xl:text-white dark:text-white" /> -->
          </div>
        </div>
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="h-full flex items-center m-auto w-[100%] @2xl:max-w-500px @xl:max-w-500px @md:max-w-500px @lg:max-w-500px"
          >
            <LoginForm
              v-if="isLogin"
              class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              @to-register="toRegister"
            />
            <RegisterForm
              v-else
              class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              @to-login="toLogin"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ThemeSwitch } from '@/components/ThemeSwitch'
// import { LocaleDropdown } from '@/components/LocaleDropdown'
// import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const isLogin = ref(true)

const toRegister = () => {
  isLogin.value = false
}

const toLogin = () => {
  isLogin.value = true
}
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      // background-image: url('@/assets/svgs/login-bg.svg');
      background-image: linear-gradient(to right, #298121, #60a057, #91c08a, #c2dfbe, #f1ffef);
      // background-image: linear-gradient(
      //   to right bottom,
      //   #298121,
      //   #60a057,
      //   #91c08a,
      //   #c2dfbe,
      //   #f5fff4
      // );
      background-position: center;
      background-repeat: no-repeat;
      box-shadow: 3px 15px 13px 1px #adadad;
      // transform-style: preserve-3d;
      // transform: rotateY(30deg);
      content: '';
    }
  }
}
</style>
