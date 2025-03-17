import { request } from "@/router/axios";

// 搜索列表
export const getWarehouseList = (data) => {
  return request({
    url: "/backstage/warehouse/list",
    method: "post",
    data,
  });
};
// 查看详情
export const detail = (params) => {
  return request({
    url: "/backstage/warehouse/detail",
    method: "get",
    params,
  });
};
// 新增/编辑
export const add = (data) => {
  return request({
    url: "/backstage/warehouse/save",
    method: "post",
    data,
  });
};
// 修改状态
export const update = (data) => {
  return request({
    url: "/backstage/warehouse/updateStatus",
    method: "post",
    data,
  });
};
// 删除
export const remove = (params) => {
  return request({
    url: "/backstage/warehouse/delete",
    method: "get",
    params,
  });
};
