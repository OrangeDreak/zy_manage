import request from '@/utils/request'

export const getList = (current, size, params) => {
  return request({
    url: "/tp/admin/dict/list",
    method: "post",
    params: {
      ...params,
      current,
      size,
    },
  });
};
export const remove = (id) => {
  return request({
    url: "/tp/admin/dict/remove?id=" + id,
    method: "post",
    params: {
      ids,
    },
  });
};

export const add = (row) => {
  return request({
    url: "/tp/admin/dict/submit",
    method: "post",
    data: row,
  });
};

export const update = (row) => {
  return request({
    url: "/tp/admin/dict/submit",
    method: "post",
    data: row,
  });
};

export const getDict = (id) => {
  return request({
    url: "/tp/admin/dict/detail",
    method: "get",
    params: {
      id,
    },
  });
};
export const getDictTree = () => {
  return request({
    url: "/tp/admin/dict/tree?code=DICT",
    method: "get",
  });
};
