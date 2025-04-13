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
    transferOrder: '订单列表',
    warehouse: '我的仓库',
    package: '包裹列表',
    assets: '我的资产',
    addTransfer: '添加转运',
    dashboard: '控制台',
    settings: '系统设置',
    help: '帮助中心',
    notification: '消息通知',
    dict: '字典管理',
    logisticsList: '干线管理',
    userList: '用户管理',
    exchange: '汇率配置',
    recharge: '余额充值'

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
  },


    addService1: "拉伸膜",
    addServiceTip1:
      "增值服务项，CN￥10\n服务描述：在纸箱包裹外表面进行拉伸膜全覆盖。\n使用场景：使用拉伸膜打包包裹，可有效防潮、防水、防偷换。全品类商品都可使用。",
    addService2: "EPE泡沫填充物",
    addServiceTip2:
      "增值服务项，CN￥10\n服务描述：在纸箱四面内壁缝隙中填充EPE泡沫填充物，系统根据商品重量自动计算服务费。\n服务特点：使用泡沫板对包裹内空间进行填充保护，极大地避免商品因颠簸而造成的损坏。适用于小型电器类商品，搭配使用纸护角卡条效果更佳。",
    addService3: "纸护角卡条",
    addServiceTip3:
      "增值服务项，CN￥20\n服务描述：在纸箱包裹外边缘添加四条护角卡条。\n使用场景：多使用于对商品原包装有要求的商品，例如手办外包装，保证八角尖尖，盒控必选。",
    addService4: "真空压缩袋",
    addServiceTip4:
      "增值服务项，CN￥15\n服务描述：使用真空压缩袋对整个包裹内的商品集中进行真空压缩，最大压缩袋容积为80cm*60cm。\n服务特点：可极大程度上压缩体积，节省体积线路的运费；并有一定的防潮、防霉、防尘、防虫作用。推荐在羽绒服、床上用品、家居纺织品等轻抛纺织类商品上使用。",
    addService5: "包装过程视频",
    addServiceTip5:
      "增值服务项，CN￥5\n服务描述：提供包裹的全程打包视频，便于您更直观的感受到整个包装过程，满足您需要查看包裹包装状态的需求。\n包裹打包完成的30分钟后可以在“我的包裹”页面查看打包视频；视频将为您保留30天。如超过24小时仍无法查看视频，请您联系在线客服处理。\n如何购买:提交包裹选择寄送线路后，选择运单增值服务【包装过程视频】购买",
    addService6: "防潮袋",
    addServiceTip6:
      "增值服务项，CN￥6\n服务描述：在纸箱包裹外表面添加套上防潮袋并做好密封。\n服务特点：加厚PE材质，可有效防止包裹在运输途中因天气等因素引发外箱受潮、内件发霉的情况。全品类商品都可使用。",
    addService7: "商品加固-气泡柱包装",
    addServiceTip7:
      "增值服务项，CN￥15\n（1）功能：使用气泡柱卷材对商品进行包裹保护，可较大程度提高商品抗震能力，防止商品因挤压、碰撞、跌落而损坏。\n（2）适用品类：化妆品、电子产品、手办、玻璃罐装、陶瓷制品。",
    addService8: "商品加固-牛皮气泡袋包装",
    addServiceTip8:
      "增值服务项，CN￥10\n（1）功能：使用牛皮气泡袋包装商品，具有缓冲防震作用，防止商品因挤压、碰撞、跌落而损坏。\n（2）适用品类：适用于小件首饰、小件玉器、驾驶证/身份证类小本证件、小型电子产品。",
    addService9: "商品加固-珍珠棉包装",
    addServiceTip9:
      "增值服务项，CN￥10\n（1）功能：使用珍珠棉对商品进行三层包裹，具有缓冲防震作用，防止商品因挤压、碰撞、跌落而损坏。\n（2）适用品类：各种带商品盒子的易折损商品均可使用。",
    addService10: "商品加固-防尘袋包装",
    addServiceTip10:
      "增值服务项，CN￥10\n（1）功能：使用防尘袋包装商品，具有防尘、防剐蹭、防潮、防商品受日光久晒变色等优点。\n（2）适用品类：适用于衣帽鞋包类商品。",
    addService11: "商品加固-充气鞋撑",
    addServiceTip11: "增值服务项，CN￥1\n用于支撑鞋子内部，保护鞋子不变形",
    addService12: "商品加固-环保木浆鞋撑",
    addServiceTip12: "增值服务项，CN￥10\n用于支撑鞋子内部，保护鞋子不变形",
} 