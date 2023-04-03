import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {},
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: '首页',
          icon: 'noto:pushpin',
          alwaysShow: true
        }
      }
    ]
  },

  {
    path: '/components',
    component: Layout,
    name: 'ComponentsDemo',
    meta: {
      title: '案件管理',
      icon: 'noto:card-file-box',
      alwaysShow: true
    },
    children: [
      // {
      //   path: 'form',
      //   component: getParentLayout(),
      //   redirect: '/components/form/default-form',
      //   name: 'Form',
      //   meta: {
      //     title: t('router.form'),
      //     alwaysShow: true
      //   },
      //   children: [
      //     {
      //       path: 'default-form',
      //       component: () => import('@/views/Components/Form/DefaultForm.vue'),
      //       name: 'DefaultForm',
      //       meta: {
      //         title: t('router.defaultForm')
      //       }
      //     },
      //     {
      //       path: 'use-form',
      //       component: () => import('@/views/Components/Form/UseFormDemo.vue'),
      //       name: 'UseForm',
      //       meta: {
      //         title: 'UseForm'
      //       }
      //     },
      //     {
      //       path: 'ref-form',
      //       component: () => import('@/views/Components/Form/RefForm.vue'),
      //       name: 'RefForm',
      //       meta: {
      //         title: 'RefForm'
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'table',
      //   component: getParentLayout(),
      //   redirect: '/components/table/default-table',
      //   name: 'TableDemo',
      //   meta: {
      //     title: t('router.table'),
      //     alwaysShow: true
      //   },
      //   children: [
      //     {
      //       path: 'use-table',
      //       component: () => import('@/views/Components/Table/UseTableDemo.vue'),
      //       name: 'UseTable',
      //       meta: {
      //         title: 'UseTable'
      //       }
      //     },
      //     {
      //       path: 'ref-table',
      //       component: () => import('@/views/Components/Table/RefTable.vue'),
      //       name: 'RefTable',
      //       meta: {
      //         title: 'RefTable'
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'editor-demo',
      //   component: getParentLayout(),
      //   redirect: '/components/editor-demo/editor',
      //   name: 'EditorDemo',
      //   meta: {
      //     title: t('router.editor'),
      //     alwaysShow: true
      //   },
      //   children: [
      //     {
      //       path: 'editor',
      //       component: () => import('@/views/Components/Editor/Editor.vue'),
      //       name: 'Editor',
      //       meta: {
      //         title: t('router.richText')
      //       }
      //     }
      //   ]
      // },

      {
        path: 'count-to',
        component: () => import('@/views/Components/CountTo.vue'),
        name: 'CountTo',
        meta: {
          title: t('router.countTo')
        }
      },
      {
        path: 'trafficCase',
        component: () => import('@/views/Case/traffic_case.vue'),
        name: 'TrafficCase',
        meta: {
          title: '交通事故案件'
        }
      },
      {
        path: 'breakRulesCase',
        component: () => import('@/views/Case/breakRules_case.vue'),
        name: 'breakRulesCase',
        meta: {
          title: '公路违章案件'
        }
      }
    ]
  },
  // {
  //   path: '/hooks',
  //   component: Layout,
  //   redirect: '/hooks/useWatermark',
  //   name: 'Hooks',
  //   meta: {
  //     title: 'hooks',
  //     icon: 'ic:outline-webhook',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: 'useWatermark',
  //       component: () => import('@/views/hooks/useWatermark.vue'),
  //       name: 'UseWatermark',
  //       meta: {
  //         title: 'useWatermark'
  //       }
  //     },
  //     {
  //       path: 'useCrudSchemas',
  //       component: () => import('@/views/hooks/useCrudSchemas.vue'),
  //       name: 'UseCrudSchemas',
  //       meta: {
  //         title: 'useCrudSchemas'
  //       }
  //     }
  //   ]
  // },

  {
    path: '/road',
    component: Layout,
    redirect: '/road/property',
    name: 'Road',
    meta: {
      title: '路政资产与巡查',
      icon: 'noto:bank',
      alwaysShow: true
    },
    children: [
      {
        path: 'property',
        component: () => import('@/views/PropertyPatrol/property.vue'),
        name: 'Property',
        meta: {
          title: '公路资产管理'
        }
      },
      {
        path: 'patrol',
        component: () => import('@/views/PropertyPatrol/patrol.vue'),
        name: 'Patrol',
        meta: {
          title: '巡查排班管理'
        }
      }
      // {
      //   path: 'example-page',
      //   component: () => import('@/views/Example/Page/ExamplePage.vue'),
      //   name: 'ExamplePage',
      //   meta: {
      //     title: t('router.examplePage')
      //   }
      // },
      // {
      //   path: 'example-add',
      //   component: () => import('@/views/Example/Page/ExampleAdd.vue'),
      //   name: 'ExampleAdd',
      //   meta: {
      //     title: t('router.exampleAdd'),
      //     noTagsView: true,
      //     noCache: true,
      //     hidden: true,
      //     canTo: true,
      //     activeMenu: '/example/example-page'
      //   }
      // },
      // {
      //   path: 'example-edit',
      //   component: () => import('@/views/Example/Page/ExampleEdit.vue'),
      //   name: 'ExampleEdit',
      //   meta: {
      //     title: t('router.exampleEdit'),
      //     noTagsView: true,
      //     noCache: true,
      //     hidden: true,
      //     canTo: true,
      //     activeMenu: '/example/example-page'
      //   }
      // },
      // {
      //   path: 'example-detail',
      //   component: () => import('@/views/Example/Page/ExampleDetail.vue'),
      //   name: 'ExampleDetail',
      //   meta: {
      //     title: t('router.exampleDetail'),
      //     noTagsView: true,
      //     noCache: true,
      //     hidden: true,
      //     canTo: true,
      //     activeMenu: '/example/example-page'
      //   }
      // }
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: '/error/404',
  //   name: 'Error',
  //   meta: {
  //     title: t('router.errorPage'),
  //     icon: 'ci:error',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: '404-demo',
  //       component: () => import('@/views/Error/404.vue'),
  //       name: '404Demo',
  //       meta: {
  //         title: '404'
  //       }
  //     },
  //     {
  //       path: '403-demo',
  //       component: () => import('@/views/Error/403.vue'),
  //       name: '403Demo',
  //       meta: {
  //         title: '403'
  //       }
  //     },
  //     {
  //       path: '500-demo',
  //       component: () => import('@/views/Error/500.vue'),
  //       name: '500Demo',
  //       meta: {
  //         title: '500'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: '用户权限管理',
      icon: 'noto:old-key',
      alwaysShow: true
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/Authorization/User.vue'),
        name: 'User',
        meta: {
          title: '人员管理'
        }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/roles',
    name: 'Role',
    meta: {},
    children: [
      {
        path: 'roles',
        component: () => import('@/views/Authorization/Role.vue'),
        name: 'Roles',
        meta: {
          title: '个人中心',
          icon: 'noto:technologist'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
