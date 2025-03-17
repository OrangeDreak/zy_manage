import { request } from "@/router/axios";

// 保存配置信息
export const openImLoginApi = (data) => {
  return request({
    url: "/staff/login",
    method: "post",
    data,
  });
};

// 获取配置信息
export const configListApi = (params) => {
  return request({
    url: "/staffConfig/configList",
    method: "get",
    params,
  });
};
