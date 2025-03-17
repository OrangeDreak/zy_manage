import { request } from "@/router/axios";

// 搜索列表
export const getList = (data) => {
  return request({
    url: "/product/labelConfig/list",
    method: "post",
    data,
  });
};
// 查看详情
export const detail = (params) => {
  return request({
    url: "/product/labelConfig/detail",
    method: "get",
    params,
  });
};
// 新增
export const add = (data) => {
  return request({
    url: "/product/labelConfig/add",
    method: "post",
    data,
  });
};
// 编辑
export const update = (data) => {
  return request({
    url: "/product/labelConfig/update",
    method: "post",
    data,
  });
};
// 删除
export const remove = (data) => {
  return request({
    url: "/product/labelConfig/delete",
    method: "post",
    data,
  });
};
