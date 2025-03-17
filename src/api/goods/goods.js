import { request } from "@/router/axios";

// 搜索列表
export const getList = (data) => {
  return request({
    url: "/backstage/product/list",
    method: "post",
    data,
  });
};
// 查看详情
export const detail = (data) => {
  return request({
    url: "/backstage/product/detail",
    method: "post",
    data,
  });
};
// 编辑
export const update = (data) => {
  return request({
    url: "/backstage/product/save",
    method: "post",
    data,
  });
};
// 删除
export const remove = (data) => {
  return request({
    url: "/backstage/product/delete",
    method: "post",
    data,
  });
};
