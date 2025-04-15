import request from '@/utils/request'

export const articleList = (data) => {
  return request({
    url: "/admin/article/list",
    method: "post",
    data,
  });
};
export const articleDetail = (params) => {
  return request({
    url: "/admin/article/detail",
    method: "get",
    params,
  });
};
export const articleAdd = (data) => {
  return request({
    url: "/admin/article/add",
    method: "post",
    data,
  });
};
export const articleEdit = (data) => {
  return request({
    url: "/admin/article/update",
    method: "post",
    data,
  });
};
export const articleDel = (data) => {
  return request({
    url: "/admin/article/delete",
    method: "post",
    data,
  });
};
export const articleStatusChange = (data) => {
  return request({
    url: "/admin/article/changeStatus",
    method: "post",
    data,
  });
};

export const articleCategoryList = (data) => {
  return request({
    url: "/admin/articleCategory/list",
    method: "post",
    data,
  });
};
export const articleCategoryAllList = () => {
  return request({
    url: "/admin/articleCategory/allList",
    method: "post",
  });
};

export const uploadImg = (data) => {
  return request({
    url: "/admin/resource/oss/upload",
    method: "post",
    data,
  });
};
export const articleCategoryAdd = (data) => {
  return request({
    url: "/admin/articleCategory/add",
    method: "post",
    data,
  });
};
export const articleCategoryEdit = (data) => {
  return request({
    url: "/admin/articleCategory/update",
    method: "post",
    data,
  });
};
export const articleCategoryDel = (data) => {
  return request({
    url: "/admin/articleCategory/delete",
    method: "post",
    data,
  });
};
