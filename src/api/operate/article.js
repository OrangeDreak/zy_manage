import { request } from "@/router/axios";

export const articleList = (data) => {
  return request({
    url: "/article/list",
    method: "post",
    data,
  });
};
export const articleDetail = (params) => {
  return request({
    url: "/article/detail",
    method: "get",
    params,
  });
};
export const articleAdd = (data) => {
  return request({
    url: "/article/add",
    method: "post",
    data,
  });
};
export const articleEdit = (data) => {
  return request({
    url: "/article/update",
    method: "post",
    data,
  });
};
export const articleDel = (data) => {
  return request({
    url: "/article/delete",
    method: "post",
    data,
  });
};
export const articleStatusChange = (data) => {
  return request({
    url: "/article/changeStatus",
    method: "post",
    data,
  });
};

export const articleCategoryList = (data) => {
  return request({
    url: "/articleCategory/list",
    method: "post",
    data,
  });
};
export const articleCategoryAllList = () => {
  return request({
    url: "/articleCategory/allList",
    method: "post",
  });
};

export const uploadImg = (data) => {
  return request({
    url: "/resource/oss/upload",
    method: "post",
    data,
  });
};
export const articleCategoryAdd = (data) => {
  return request({
    url: "/articleCategory/add",
    method: "post",
    data,
  });
};
export const articleCategoryEdit = (data) => {
  return request({
    url: "/articleCategory/update",
    method: "post",
    data,
  });
};
export const articleCategoryDel = (data) => {
  return request({
    url: "/articleCategory/delete",
    method: "post",
    data,
  });
};
