import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import router from "./router/router";
import "./permission"; // 权限
import "./error"; // 日志
import store from "./store";
import { loadStyle } from "./util/util";
import * as urls from "@/config/env";
import Element from "element-ui";
import { iconfontUrl, iconfontVersion, baseUrl } from "@/config/env";
import i18n from "./lang"; // Internationalization
import "./styles/common.scss";
import "./config/svgIndex"; // SvgIcon

import basicContainer from "./components/basic-container/main";
import thirdRegister from "./components/third-register/main";

import { formatNum, formatNum2, convertYuanToFen, convertFenToYuan } from "./util/commonUtil";

// 全局接口地址
Vue.prototype.$root1 = baseUrl;
Vue.prototype.$formatNum = formatNum;
Vue.prototype.$formatNum2 = formatNum2;
Vue.prototype.$convertYuanToFen = convertYuanToFen;
Vue.prototype.$convertFenToYuan = convertFenToYuan;

// 全局过滤器
import * as filters from "./filters";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value),
  size: "small",
});
Vue.use(window.AVUE, {
  size: "small",
  tableSize: "small",
  calcHeight: -90,
  i18n: (key, value) => i18n.t(key, value),
});

//注册全局容器
Vue.component("basicContainer", basicContainer);
Vue.component("thirdRegister", thirdRegister);
// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key];
});

// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
