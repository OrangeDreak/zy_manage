import { request } from "@/router/axios";

export const getList = (data) => {
  return request({
    url: "/member/point/list",
    method: "post",
    data,
  });
};
export const detail = (params) => {
  return request({
    url: "/member/point/detail",
    method: "get",
    params,
  });
};
export const add = (data) => {
  return request({
    url: "/member/point/add",
    method: "post",
    data,
  });
};
export const update = (data) => {
  return request({
    url: "/member/point/update",
    method: "post",
    data,
  });
};
export const remove = (data) => {
  return request({
    url: "/member/point/delete",
    method: "post",
    data,
  });
};
