/**
 * 全局配置文件
 */
export default {
  title: "Qcelf",
  indexTitle: "Qcelf Admin",
  clientId: "saber", // 客户端id (后端暂时没改，如果改请注意)
  clientSecret: "saber_secret", // 客户端密钥 (后端暂时没改，如果改请注意)
  captchaMode: true, // 是否开启验证码模式
  logo: "S",
  key: "Qcelf", //配置主键,目前用于存储
  lockPage: "/lock",
  tokenTime: 100, // 秒
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: "dashboard",
    },
    group: [],
    close: false,
  },
  //配置菜单的属性
  menu: {
    iconDefault: "iconfont icon-caidan",
    props: {
      label: "name",
      path: "path",
      icon: "source",
      children: "children",
    },
  },
  // 授权地址
  authUrl: "http://localhost/blade-auth/oauth/render",
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: "http://localhost:8108/ureport",
};
