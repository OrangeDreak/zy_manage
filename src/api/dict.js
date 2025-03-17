import request from '@/utils/request'

export const getList = (current, size, params) => {
  return request({
    url: "/admin/dict/list",
    method: "post",
    data: params,
  });
};
export const remove = (ids) => {
  return request({
    url: "/admin/dict/remove?id=" + ids,
    method: "post",
    params: {
      ids,
    },
  });
};

export const add = (row) => {
  return request({
    url: "/admin/dict/submit",
    method: "post",
    data: row,
  });
};

export const update = (row) => {
  return request({
    url: "/admin/dict/submit",
    method: "post",
    data: row,
  });
};

export const getDict = (id) => {
  return request({
    url: "/admin/dict/detail",
    method: "get",
    params: {
      id,
    },
  });
};
export const getDictTree = () => {
  return request({
    url: "/admin/dict/tree?code=DICT",
    method: "get",
  });
};
