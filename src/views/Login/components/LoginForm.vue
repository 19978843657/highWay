<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="register"
  >
    <template #title>
      <h2 class="text-2xl font-bold text-center w-[100%]">{{ t('login.login') }}</h2>
    </template>

    <template #tool>
      <div class="flex justify-between items-center w-[100%]">
        <ElCheckbox v-model="remember" :label="t('login.remember')" size="small" />
        <ElLink type="primary" :underline="false">{{ t('login.forgetPassword') }}</ElLink>
      </div>
    </template>

    <template #login>
      <div class="w-[100%]">
        <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
          {{ t('login.login') }}
        </ElButton>
      </div>
      <div class="w-[100%] mt-15px">
        <ElButton class="w-[100%]" @click="toRegister">
          {{ t('login.register') }}
        </ElButton>
      </div>
    </template>

    <template #otherIcon>
      <div class="flex justify-between w-[100%]">
        <Icon
          icon="ant-design:github-filled"
          :size="iconSize"
          class="cursor-pointer anticon"
          :color="iconColor"
        />
        <Icon
          icon="ant-design:wechat-filled"
          :size="iconSize"
          class="cursor-pointer anticon"
          :color="iconColor"
        />
        <Icon
          icon="ant-design:alipay-circle-filled"
          :size="iconSize"
          :color="iconColor"
          class="cursor-pointer anticon"
        />
        <Icon
          icon="ant-design:weibo-circle-filled"
          :size="iconSize"
          :color="iconColor"
          class="cursor-pointer anticon"
        />
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, getTestRoleApi, getAdminRoleApi, getCode } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { wsCache } = useCache()

const { t } = useI18n()

const rules = {
  id: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'id',
    label: t('login.username'),
    value: '10001',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '123456',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  }
])

const iconSize = 30

const remember = ref(false)

const { register, elFormRef, methods } = useForm()

const loading = ref(false)

const iconColor = '#999'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
const getcode = () => {
  const { getFormData } = methods
  const formData = getFormData<UserType>()
  const res = getCode({ id: formData.username })
}
// 登录
const signIn = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const formData = await getFormData<UserType>()

      formData.username = 'admin'
      try {
        const res = await loginApi(formData)

        if (res) {
          wsCache.set(appStore.getUserInfo, res.data)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            console.log('getRole')

            getRole()
          } else {
            await permissionStore.generateRoutes('none').catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
            push({ path: redirect.value || permissionStore.addRouters[0].path })
          }
        }
      } finally {
        console.log('sssss')

        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRole = async () => {
  const { getFormData } = methods
  const formData = await getFormData<UserType>()
  formData.username = 'admin'
  const params = {
    roleName: formData.username
  }
  // admin - 模拟后端过滤菜单
  // test - 模拟前端过滤菜单
  const adminList = [
    {
      path: '/dashboard',
      component: '#',
      redirect: '/dashboard/analysis',
      name: 'Dashboard',
      meta: {
        title: 'router.dashboard',
        icon: 'ant-design:dashboard-filled',
        alwaysShow: true
      },
      children: [
        {
          path: 'analysis',
          component: 'views/Dashboard/Analysis',
          name: 'Analysis',
          meta: {
            title: 'router.analysis',
            noCache: true
          }
        },
        {
          path: 'workplace',
          component: 'views/Dashboard/Workplace',
          name: 'Workplace',
          meta: {
            title: 'router.workplace',
            noCache: true
          }
        }
      ]
    },
    {
      path: '/external-link',
      component: '#',
      meta: {},
      name: 'ExternalLink',
      children: [
        {
          path: 'https://element-plus-admin-doc.cn/',
          name: 'DocumentLink',
          meta: {
            title: 'router.document',
            icon: 'clarity:document-solid'
          }
        }
      ]
    },
    {
      path: '/guide',
      component: '#',
      name: 'Guide',
      meta: {},
      children: [
        {
          path: 'index',
          component: 'views/Guide/Guide',
          name: 'GuideDemo',
          meta: {
            title: 'router.guide',
            icon: 'cib:telegram-plane'
          }
        }
      ]
    },
    {
      path: '/components',
      component: '#',
      redirect: '/components/form/default-form',
      name: 'ComponentsDemo',
      meta: {
        title: 'router.component',
        icon: 'bx:bxs-component',
        alwaysShow: true
      },
      children: [
        {
          path: 'form',
          component: '##',
          name: 'Form',
          meta: {
            title: 'router.form',
            alwaysShow: true
          },
          children: [
            {
              path: 'default-form',
              component: 'views/Components/Form/DefaultForm',
              name: 'DefaultForm',
              meta: {
                title: 'router.defaultForm'
              }
            },
            {
              path: 'use-form',
              component: 'views/Components/Form/UseFormDemo',
              name: 'UseForm',
              meta: {
                title: 'UseForm'
              }
            },
            {
              path: 'ref-form',
              component: 'views/Components/Form/RefForm',
              name: 'RefForm',
              meta: {
                title: 'RefForm'
              }
            }
          ]
        },
        {
          path: 'table',
          component: '##',
          redirect: '/components/table/default-table',
          name: 'TableDemo',
          meta: {
            title: 'router.table',
            alwaysShow: true
          },
          children: [
            {
              path: 'default-table',
              component: 'views/Components/Table/DefaultTable',
              name: 'DefaultTable',
              meta: {
                title: 'router.defaultTable'
              }
            },
            {
              path: 'use-table',
              component: 'views/Components/Table/UseTableDemo',
              name: 'UseTable',
              meta: {
                title: 'UseTable'
              }
            },
            {
              path: 'ref-table',
              component: 'views/Components/Table/RefTable',
              name: 'RefTable',
              meta: {
                title: 'RefTable'
              }
            }
          ]
        },
        {
          path: 'editor-demo',
          component: '##',
          redirect: '/components/editor-demo/editor',
          name: 'EditorDemo',
          meta: {
            title: 'router.editor',
            alwaysShow: true
          },
          children: [
            {
              path: 'editor',
              component: 'views/Components/Editor/Editor',
              name: 'Editor',
              meta: {
                title: 'router.richText'
              }
            }
          ]
        },
        {
          path: 'search',
          component: 'views/Components/Search',
          name: 'Search',
          meta: {
            title: 'router.search'
          }
        },
        {
          path: 'descriptions',
          component: 'views/Components/Descriptions',
          name: 'Descriptions',
          meta: {
            title: 'router.descriptions'
          }
        },
        {
          path: 'image-viewer',
          component: 'views/Components/ImageViewer',
          name: 'ImageViewer',
          meta: {
            title: 'router.imageViewer'
          }
        },
        {
          path: 'dialog',
          component: 'views/Components/Dialog',
          name: 'Dialog',
          meta: {
            title: 'router.dialog'
          }
        },
        {
          path: 'icon',
          component: 'views/Components/Icon',
          name: 'Icon',
          meta: {
            title: 'router.icon'
          }
        },
        {
          path: 'echart',
          component: 'views/Components/Echart',
          name: 'Echart',
          meta: {
            title: 'router.echart'
          }
        },
        {
          path: 'count-to',
          component: 'views/Components/CountTo',
          name: 'CountTo',
          meta: {
            title: 'router.countTo'
          }
        },
        {
          path: 'qrcode',
          component: 'views/Components/Qrcode',
          name: 'Qrcode',
          meta: {
            title: 'router.qrcode'
          }
        },
        {
          path: 'highlight',
          component: 'views/Components/Highlight',
          name: 'Highlight',
          meta: {
            title: 'router.highlight'
          }
        },
        {
          path: 'infotip',
          component: 'views/Components/Infotip',
          name: 'Infotip',
          meta: {
            title: 'router.infotip'
          }
        },
        {
          path: 'input-password',
          component: 'views/Components/InputPassword',
          name: 'InputPassword',
          meta: {
            title: 'router.inputPassword'
          }
        },
        {
          path: 'sticky',
          component: 'views/Components/Sticky',
          name: 'Sticky',
          meta: {
            title: 'router.sticky'
          }
        }
      ]
    },
    {
      path: '/hooks',
      component: '#',
      redirect: '/hooks/useWatermark',
      name: 'Hooks',
      meta: {
        title: 'hooks',
        icon: 'ic:outline-webhook',
        alwaysShow: true
      },
      children: [
        {
          path: 'useWatermark',
          component: 'views/hooks/useWatermark',
          name: 'UseWatermark',
          meta: {
            title: 'useWatermark'
          }
        },
        {
          path: 'useCrudSchemas',
          component: 'views/hooks/useCrudSchemas',
          name: 'UseCrudSchemas',
          meta: {
            title: 'useCrudSchemas'
          }
        }
      ]
    },
    {
      path: '/level',
      component: '#',
      redirect: '/level/menu1/menu1-1/menu1-1-1',
      name: 'Level',
      meta: {
        title: 'router.level',
        icon: 'carbon:skill-level-advanced'
      },
      children: [
        {
          path: 'menu1',
          name: 'Menu1',
          component: '##',
          redirect: '/level/menu1/menu1-1/menu1-1-1',
          meta: {
            title: 'router.menu1'
          },
          children: [
            {
              path: 'menu1-1',
              name: 'Menu11',
              component: '##',
              redirect: '/level/menu1/menu1-1/menu1-1-1',
              meta: {
                title: 'router.menu11',
                alwaysShow: true
              },
              children: [
                {
                  path: 'menu1-1-1',
                  name: 'Menu111',
                  component: 'views/Level/Menu111',
                  meta: {
                    title: 'router.menu111'
                  }
                }
              ]
            },
            {
              path: 'menu1-2',
              name: 'Menu12',
              component: 'views/Level/Menu12',
              meta: {
                title: 'router.menu12'
              }
            }
          ]
        },
        {
          path: 'menu2',
          name: 'Menu2Demo',
          component: 'views/Level/Menu2',
          meta: {
            title: 'router.menu2'
          }
        }
      ]
    },
    {
      path: '/example',
      component: '#',
      redirect: '/example/example-dialog',
      name: 'Example',
      meta: {
        title: 'router.example',
        icon: 'ep:management',
        alwaysShow: true
      },
      children: [
        {
          path: 'example-dialog',
          component: 'views/Example/Dialog/ExampleDialog',
          name: 'ExampleDialog',
          meta: {
            title: 'router.exampleDialog'
          }
        },
        {
          path: 'example-page',
          component: 'views/Example/Page/ExamplePage',
          name: 'ExamplePage',
          meta: {
            title: 'router.examplePage'
          }
        },
        {
          path: 'example-add',
          component: 'views/Example/Page/ExampleAdd',
          name: 'ExampleAdd',
          meta: {
            title: 'router.exampleAdd',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page'
          }
        },
        {
          path: 'example-edit',
          component: 'views/Example/Page/ExampleEdit',
          name: 'ExampleEdit',
          meta: {
            title: 'router.exampleEdit',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page'
          }
        },
        {
          path: 'example-detail',
          component: 'views/Example/Page/ExampleDetail',
          name: 'ExampleDetail',
          meta: {
            title: 'router.exampleDetail',
            noTagsView: true,
            noCache: true,
            hidden: true,
            showMainRoute: true,
            activeMenu: '/example/example-page'
          }
        }
      ]
    },
    {
      path: '/error',
      component: '#',
      redirect: '/error/404',
      name: 'Error',
      meta: {
        title: 'router.errorPage',
        icon: 'ci:error',
        alwaysShow: true
      },
      children: [
        {
          path: '404-demo',
          component: 'views/Error/404',
          name: '404Demo',
          meta: {
            title: '404'
          }
        },
        {
          path: '403-demo',
          component: 'views/Error/403',
          name: '403Demo',
          meta: {
            title: '403'
          }
        },
        {
          path: '500-demo',
          component: 'views/Error/500',
          name: '500Demo',
          meta: {
            title: '500'
          }
        }
      ]
    }
  ]

  const res = formData.username === 'admin' ? await adminList : await getTestRoleApi(params)
  if (res) {
    const { wsCache } = useCache()
    const routers = res
    wsCache.set('roleRouters', routers)

    formData.username === 'admin'
      ? await permissionStore.generateRoutes('admin', routers).catch(() => {})
      : await permissionStore.generateRoutes('test', routers).catch(() => {})
    console.log('routers')

    // permissionStore.generateRoutes('admin', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
