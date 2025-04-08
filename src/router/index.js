import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/add-transfer',
    name: 'AddTransfer',
    component: () => import('@/views/transfer/AddTransferOrder.vue'),
    meta: { title: '添加转运订单' }
  },
  {
    path: '/share/:id',
    name: 'ShareOrder',
    component: () => import('@/views/transfer/ShareOrder.vue'),
    meta: { title: '订单详情' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/user-list',
    children: [
      {
        path: 'user-list',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户管理', requiresAuth: true }
      },
      {
        path: 'login-logs',
        name: 'LoginLogs',
        component: () => import('@/views/log/LoginLog.vue'),
        meta: { title: '登录日志', requiresAuth: true }
      },
      {
        path: 'transfer-list',
        name: 'TransferList',
        component: () => import('@/views/transfer/TransferList.vue'),
        meta: { title: '我的转运列表', requiresAuth: true }
      },
      {
        path: 'warehouse',
        name: 'MyWarehouse',
        component: () => import('@/views/warehouse/MyWarehouse.vue'),
        meta: { title: '我的仓库', requiresAuth: true }
      },
      {
        path: 'package-list',
        name: 'PackageOrderList',
        component: () => import('@/views/order/PackageOrderList.vue'),
        meta: { title: '包裹列表', requiresAuth: true }
      },
      {
        path: 'package-detail/:id',
        name: 'PackageDetail',
        component: () => import('@/views/order/PackageDetail.vue'),
        meta: { title: '包裹详情', requiresAuth: true }
      },
      {
        path: 'assets',
        name: 'MyAssets',
        component: () => import('@/views/assets/MyAssets.vue'),
        meta: { title: '我的资产', requiresAuth: true }
      },
      {
        path: 'submit-transfer',
        name: 'SubmitTransfer',
        component: () => import('@/views/warehouse/SubmitTransfer.vue'),
        meta: { title: '提交转运', requiresAuth: true }
      },
      {
        path: '/exchange-rate',
        name: 'Exchange-rate',
        component: () => import('@/views/system/exchange-rate.vue'),
        meta: { title: '字典管理' }
      },
      {
          path: '/dict',
          name: 'Dict',
          component: () => import('@/views/system/Dict.vue'),
          meta: { title: '字典管理' }
      },
      {
        path: '/logisticsList',
        name: 'LogisticsList',
        component: () => import('@/views/logistics/logisticsList.vue'),
        meta: { title: '干线管理' }
      },
      {
        path: '/logisticsCost',
        name: 'LogisticsCost',
        component: () => import('@/views/logistics/logisticsCost.vue'),
        meta: { title: '物流费用设置' }
      },
      {
        path: '/order-list',
        name: 'ForwardingOrderList',
        component: () => import('@/views/order/ForwardingOrderList.vue'),
        meta: { title: '订单管理' }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 暂时注释掉登录验证
  // const authStore = useAuthStore()
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 更新页面标题
  document.title = to.meta.title ? `${to.meta.title} - PC Admin` : 'PC Admin'

  // if (requiresAuth && !authStore.token) {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  next() // 直接放行所有路由
})

export default router 