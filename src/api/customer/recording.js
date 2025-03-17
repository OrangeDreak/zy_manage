import { request } from "@/router/axios";

// 获取国家列表
export const getCountry = (params) => {
  return request({
    url: "/backstage/areaLibrary/listByLevel?areaLevel=1",
    method: "get",
    params,
  });
};

// 回话列表
export const dialogueListApi = (data) => {
  return request({
    url: "/staff/dialogueList",
    method: "post",
    data,
  });
};

// 客户信息
export const customerInfoApi = (params) => {
  return request({
    url: "/staff/customerInfo",
    method: "get",
    params,
  });
};

// 服务记录
export const serviceListApi = (data) => {
  return request({
    url: "/staff/serviceList",
    method: "post",
    data,
  });
};

// 详情里面的聊天记录
export const detailMessageListApi = (data) => {
  return request({
    url: "/staff/detailMessageList",
    method: "post",
    data,
  });
};
