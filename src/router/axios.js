/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from "axios";
import store from "@/store/";
import router from "@/router/router";
import { serialize } from "@/util/util";
import { getToken } from "@/util/auth";
import { Message } from "element-ui";
import { baseUrl } from "@/config/env";
import website from "@/config/website";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { Base64 } from "js-base64";
import crypto from "@/util/crypto";
import paramsFormart from "../api/config";

const defaultTime = 10000;
axios.defaults.timeout = defaultTime;
axios.defaults.baseURL = baseUrl;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
// axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false,
});
//HTTPrequest拦截
axios.interceptors.request.use(
  (config) => {
    NProgress.start(); // start progress bar
    const meta = config.meta || {};
    const isToken = meta.isToken === false;
    config.headers["Authorization"] = `Basic ${Base64.encode(
      `${website.clientId}:${website.clientSecret}`,
    )}`;
    //headers传递token是否加密
    const cryptoToken = config.cryptoToken === true;
    const token = getToken();
    if (token && !isToken) {
      config.headers["Blade-Auth"] = cryptoToken
        ? "crypto " + crypto.encrypt(token)
        : "bearer " + token;
    }
    //headers中配置serialize为true开启序列化
    if (config.method === "post" && meta.isSerialize === true) {
      config.data = serialize(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
//HTTPresponse拦截
axios.interceptors.response.use(
  (res) => {
    NProgress.done();
    const status = res.data.code;
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.msg || "未知错误";
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res);
    //如果是401则跳转到登录页面
    if (status === 401) store.dispatch("FedLogOut").then(() => router.push({ path: "/login" }));
    // 如果请求为非200否者默认统一处理

    if (status !== 200) {
      Message({
        message: message,
        type: "error",
      });
      return Promise.reject(new Error(message));
    }
    return Promise.resolve(res);
  },
  (error) => {
    NProgress.done();
    return Promise.reject(new Error(error));
  },
);

export function request({ method, url, data, params, resType, timeout = defaultTime }) {
  return axios({
    method,
    // baseURL: baseUrl,
    url,
    timeout,
    data: method === "post" ? paramsFormart(data) : null,
    params: method === "get" ? paramsFormart(params) : null,
    responseType: resType === "blob" ? "blob" : "json",
  });
}

export default axios;
