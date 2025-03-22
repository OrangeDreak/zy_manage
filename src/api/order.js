import request from '@/utils/request'

// 搜索列表
export const getForwardingList = (data) => {
  return request({
    url: "/admin/tp/order/list",
    method: "post",
    data,
  });
};

export const cancelPackageOrder = (data) => {
  return request({
    url: "/admin/packageOrder/cancel",
    method: "post",
    data,
  });
};

export const getPackageDetail = (params) => {
  return request({
    url: "/admin/packageOrder/detail",
    method: "get",
    params,
  });
};

// 计费重运费计算
export const getTransportOrderEstimatedAmount = (data) => {
  return request({
    url: "/admin/packageOrder/getTransportOrderEstimatedAmount",
    method: "post",
    data,
  });
};

// 提交调整运费金额
export const submitDelivery = (data) => {
  return request({
    url: "/admin/packageOrder/delivery",
    method: "post",
    data,
  });
};

export const getPackageList = (data) => {
  return request({
    url: "/admin/packageOrder/list",
    method: "post",
    data,
  });
};

export const getOrderStatus = (params) => {
  return request({
    url: "/admin/tp/order/getEnums",
    method: "get",
    params,
  });
};
