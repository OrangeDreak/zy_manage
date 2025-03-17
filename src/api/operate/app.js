import { request } from "@/router/axios";

export const getCancelReason = (params) => {
  return request({
    url: "/blade-system/dict/dictionary?code=cancel_reason",
    method: "get",
    params,
  });
};
export const bannerList = (data) => {
  return request({
    url: "/banner/list",
    method: "post",
    data,
  });
};
export const bannerAdd = (data) => {
  return request({
    url: "/banner/add",
    method: "post",
    data,
  });
};
export const bannerEdit = (data) => {
  return request({
    url: "/banner/update",
    method: "post",
    data,
  });
};
export const bannerDel = (data) => {
  return request({
    url: "/banner/delete",
    method: "post",
    data,
  });
};
export const bannerStatusChange = (data) => {
  return request({
    url: "/banner/changeStatus",
    method: "post",
    data,
  });
};

export const screenList = (data) => {
  return request({
    url: "/actionAds/list",
    method: "post",
    data,
  });
};
export const screenDetail = (params) => {
  return request({
    url: "/actionAds/detail",
    method: "get",
    params,
  });
};
export const screenAdd = (data) => {
  return request({
    url: "/actionAds/add",
    method: "post",
    data,
  });
};
export const screenEdit = (data) => {
  return request({
    url: "/actionAds/update",
    method: "post",
    data,
  });
};
export const screenDel = (data) => {
  return request({
    url: "/actionAds/delete",
    method: "post",
    data,
  });
};
export const screenChangeStatus = (data) => {
  return request({
    url: "/actionAds/changeStatus",
    method: "post",
    data,
  });
};
