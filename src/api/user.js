import request from '@/utils/request'


export const getList = (data) => {
  return request({
    url: "/admin/user/customerUserList",
    method: "post",
    data,
  });
};
export const getDetail = (params) => {
  return request({
    url: "/admin/user/detail",
    method: "get",
    params,
  });
};
export const toFreeze = (data) => {
  return request({
    url: "/admin/user/freeze",
    method: "post",
    data,
  });
};
};
