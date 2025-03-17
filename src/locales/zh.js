export default {
  header: {
    search: '请输入商品关键词',
    searchButton: '搜索',
    nav: {
      freightEstimate: '运费估算',
      transfer: '转运',
      help: '帮助中心'
    },
    user: {
      profile: '个人资料',
      logout: '退出登录'
    }
  },
  menu: {
    myAccount: '我的账号',
    transferOrder: '转运订单',
    warehouse: '我的仓库',
    package: '我的包裹',
    assets: '我的资产',
    addTransfer: '添加转运',
    dashboard: '控制台',
    settings: '系统设置',
    help: '帮助中心',
    notification: '消息通知',
    dict: '字典管理',
  },
  assets: {
    balance: {
      title: '可用余额 (USD)',
      frozen: '不可提现',
      withdraw: '提现',
      recharge: '充值',
      help: '查看帮助'
    },
    transaction: {
      dateRange: {
        start: '开始日期',
        end: '结束日期'
      },
      viewStatement: '查看账单',
      table: {
        time: '交易时间',
        type: '类型',
        amount: '收入/支出',
        balance: '账号余额',
        details: {
          orderNo: '订单编号',
          description: '交易说明',
          paymentMethod: '支付方式',
          transactionNo: '交易流水号'
        }
      }
    }
  },
  // ... 其他页面的翻译

  // 仓库相关
  warehouse: {
    title: '我的仓库',
    table: {
      productInfo: '商品信息',
      weight: '重量(g)',
      size: '尺寸(cm)',
      quantity: '数量',
      actions: '操作',
      details: '详情'
    },
    product: {
      color: '颜色',
      size: '尺码'
    },
    bottomBar: {
      selectAll: '全选',
      selected: '选中商品总计',
      items: '个',
      submit: '提交运送'
    }
  },

  // 包裹相关
  package: {
    title: '我的包裹',
    status: {
      all: '全部',
      pending: '待入库',
      inStock: '已入库',
      shipping: '运输中',
      delivered: '已送达',
      cancelled: '已取消'
    },
    search: {
      placeholder: '订单编号',
      button: '搜索'
    },
    table: {
      packageInfo: '包裹信息',
      packageNo: '包裹编号',
      submitTime: '提交时间',
      images: '张',
      weight: '重量(g)',
      size: '尺寸(cm)',
      status: '状态',
      actions: '操作'
    }
  },

  // 转运相关
  transfer: {
    addOrder: {
      title: '添加转运订单',
      backToList: '返回我的订单',
      warehouse: {
        title: 'QC elf仓库地址',
        getAddress: '请联系客服获取仓库地址',
        tip: '温馨提示：如果您想要寄到QC elf仓库，请不要把快递当场签收，快递号要和包裹一一对应。'
      },
      form: {
        customCode: '自定义编码',
        recentAddress: '最近地址',
        addAddress: '新增地址信息',
        expressNo: '快递单号',
        value: '物品价值(CNY)',
        photo: '商品照片',
        addExpress: '添加快递单号',
        submit: '提交转运订单'
      }
    },
    submitTransfer: {
      steps: {
        selectProducts: '选择商品',
        confirmInfo: '确认信息',
        submitOrder: '提交订单'
      },
      productList: '商品清单',
      delivery: {
        title: '收货地址',
        addNew: '添加新地址'
      },
      shipping: {
        title: '运输方式',
        standard: '标准快递',
        express: '特快专递',
        economy: '经济方式'
      },
      packaging: {
        title: '包装服务',
        none: '无需额外包装',
        standard: '标准包装',
        gift: '礼品包装'
      },
      summary: {
        subtotal: '商品小计',
        shipping: '运费',
        packaging: '包装费',
        total: '总计'
      }
    },
    list: {
      search: {
        customerCode: '客户编号',
        orderNo: '订单编号',
        tag: '订单标签',
        status: '订单状态',
        placeholder: {
          customerCode: '请输入客户编号',
          orderNo: '请输入订单编号',
          tag: '请选择',
          status: '请选择'
        },
        reset: '重置',
        search: '搜索'
      },
      table: {
        productDetails: '商品详情',
        customerCode: '客户编号',
        orderNo: '订单编号',
        copy: '复制',
        recipientInfo: {
          name: '姓名',
          address: '地址',
          zipCode: '邮编',
          phone: '手机号',
          email: '邮箱',
          country: '国家'
        },
        productRemark: '商品备注信息',
        editRemark: '编辑备注',
        noRemark: '暂无备注',
        weightSize: '重量(g)/尺寸(cm)',
        orderStatus: '订单状态',
        logisticsStatus: '物流状态',
        trackingNo: '物流单号',
        actions: '操作',
        share: '分享'
      },
      status: {
        pending: '待入库',
        inStock: '已入库',
        shipping: '运输中'
      }
    }
  }
} 