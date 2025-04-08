import request from '@/utils/request'

export const getList = (params) => {
  return request({
    url: "/admin/currency/list",
    method: "post",
    data: params,
  });
};

export const saveRate = (row) => {
  return request({
    url: "/admin/currency/save",
    method: "post",
    data: row,
  });
};

export const delRate = (id) => {
  return request({
    url: "/admin/currency/delete?id=" + id,
    method: "post",
  });
};