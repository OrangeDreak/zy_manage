import Layout from "@/page/index/";

export default [
  {
    path: "/wel",
    component: Layout,
    redirect: "/wel/index",
    children: [
      {
        path: "index",
        name: "首页",
        meta: {
          i18n: "dashboard",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/wel/index"),
      },
    ],
  },
  {
    path: "/test",
    component: Layout,
    redirect: "/test/index",
    children: [
      {
        path: "index",
        name: "测试页",
        meta: {
          i18n: "test",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/util/test"),
      },
    ],
  },
  {
    path: "/info",
    component: Layout,
    redirect: "/info/index",
    children: [
      {
        path: "index",
        name: "个人信息",
        meta: {
          i18n: "info",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/user/info"),
      },
    ],
  },
  {
    path: "/userDetail",
    component: Layout,
    redirect: "/userDetail/index",
    children: [
      {
        path: "index",
        name: "用户详情",
        meta: {
          parentPath: "/member/userList",
          i18n: "userDetail",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/member/userDetail"),
      },
    ],
  },
  {
    path: "/logisticsCost",
    component: Layout,
    redirect: "/logisticsCost/index",
    children: [
      {
        path: "index",
        name: "物流费用设置",
        meta: {
          parentPath: "/logistics/logisticsList",
          i18n: "logisticsCost",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/logistics/logisticsCost"),
      },
    ],
  },
  {
    path: "/order",
    component: Layout,
    children: [
      {
        path: "detail/:id",
        name: "客户订单详情",
        meta: {
          parentPath: "/order/list",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/order/detail"),
      },
      {
        path: "stash-detail/:id",
        name: "仓库订单详情",
        meta: {
          parentPath: "/order/stash-list",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/order/stash-detail"),
      },
      {
        path: "package-detail/:id",
        name: "包裹订单详情",
        meta: {
          parentPath: "/order/package-list",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/order/package-detail"),
      },
      {
        path: "danger-package-detail/:id",
        name: "风险包裹订单详情",
        meta: {
          parentPath: "/order/danger-package-list",
          i18n: "",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/order/danger-package-detail"),
      },
      {
        path: "forwarding-detail/:id",
        name: "转运订单详情",
        meta: {
          parentPath: "/order/forwarding-list",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/order/forwarding-detail"),
      },
    ],
  },
  {
    path: "/operate",
    component: Layout,
    children: [
      {
        path: "article/detail",
        name: "文章详情",
        meta: {
          parentPath: "/operate/article/index",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/operate/article/detail"),
      },
    ],
  },
  {
    path: "/operate",
    component: Layout,
    children: [
      {
        path: "article/view",
        name: "文章预览",
        meta: {
          parentPath: "/operate/article/index",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/operate/article/view"),
      },
    ],
  },
  // {
  //   path: "/customer",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "recording/chat-detail",
  //       name: "会话记录",
  //       meta: {
  //         i18n: "",
  //       },
  //       component: () =>
  //         import(/* webpackChunkName: "views" */ "@/views/customer/chat-detail"),
  //     },
  //   ],
  // },
  {
    path: "/operate",
    component: Layout,
    children: [
      {
        path: "coupon/addCoupon",
        name: "新增优惠券",
        meta: {
          parentPath: "/operate/coupon",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/operate/coupon/addCoupon"),
      },
    ],
  },
  {
    path: "/operate",
    component: Layout,
    children: [
      {
        path: "coupon/couponDetail",
        name: "优惠券详情",
        meta: {
          parentPath: "/operate/couponDetail",
          i18n: "",
        },
        component: () => import(/* webpackChunkName: "views" */ "@/views/operate/coupon/addCoupon"),
      },
    ],
  },
  {
    path: "/operate",
    component: Layout,
    children: [
      {
        path: "coupon/couponBasic",
        name: "优惠券基础配置",
        meta: {
          parentPath: "/operate/coupon",
          i18n: "",
        },
        component: () =>
          import(/* webpackChunkName: "views" */ "@/views/operate/coupon/couponBasic"),
      },
    ],
  },
];
