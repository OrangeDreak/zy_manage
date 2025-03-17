import request from "@/router/axios";

export const getList = (data) => {
  return request({
    url: "/backend/currency/list",
    method: "post",
    data,
  });
};

export const saveRate = (data) => {
  return request({
    url: "/backend/currency/save",
    method: "post",
    data,
  });
};

export const delRate = (params) => {
  return request({
    url: "/backend/currency/delete",
    method: "post",
    params,
  });
};
