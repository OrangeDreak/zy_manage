import request from "@/router/axios";

export const getList = (current, size, params) => {
  return request({
    url: "/blade-user/list",
    method: "get",
    params: {
      ...params,
      current,
      size,
    },
  });
};
export const remove = (ids) => {
  return request({
    url: "/blade-user/remove",
    method: "post",
    params: {
      ids,
    },
  });
};

export const add = (row) => {
  return request({
    url: "/blade-user/submit",
    method: "post",
    data: row,
  });
};

export const update = (row) => {
  return request({
    url: "/blade-user/update",
    method: "post",
    data: row,
  });
};

export const grant = (userIds, roleIds) => {
  return request({
    url: "/blade-user/grant",
    method: "post",
    params: {
      userIds,
      roleIds,
    },
  });
};

export const getUser = (id) => {
  return request({
    url: "/blade-user/detail",
    method: "get",
    params: {
      id,
    },
  });
};

export const getUserInfo = () => {
  return request({
    url: "/blade-user/info",
    method: "get",
  });
};

export const resetPassword = (userIds) => {
  return request({
    url: "/blade-user/reset-password",
    method: "post",
    params: {
      userIds,
    },
  });
};

export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: "/blade-user/update-password",
    method: "post",
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    },
  });
};

export const exportFile = (url, data) => {
  return request({
    url,
    method: "get",
    params: data,
    responseType: "arraybuffer", // 指定响应数据类型为 arraybuffer
  });
};
