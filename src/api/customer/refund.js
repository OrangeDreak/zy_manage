import { request } from "@/router/axios";

export const getCancelReason = (params) => {
  return request({
    url: "/blade-system/dict/dictionary?code=cancel_reason",
    method: "get",
    params,
  });
};

export const refundList = (data) => {
  return request({
    url: "/afterSale/workOrderList",
    method: "post",
    data,
  });
};
export const addMerchantAfterSale = (data) => {
  return request({
    url: "/afterSale/addMerchantAfterSale",
    method: "post",
    data,
  });
};

export const getLogisticsDetail = (params) => {
  return request({
    url: "/afterSale/getLogisticsDetail",
    method: "post",
    params,
  });
};
export const saveLogistics = (data) => {
  return request({
    url: "/afterSale/saveLogistics",
    method: "post",
    data,
  });
};
export const financeAudit = (data) => {
  return request({
    url: "/afterSale/financeAudit",
    method: "post",
    data,
  });
};
export const financeAuditWd = (data) => {
  return request({
    url: "/afterSale/merchantAudit",
    method: "post",
    data,
  });
};
export const wdOrderConfirmReceipt = (params) => {
  return request({
    url: "/afterSale/merchantConfirmReceipt",
    method: "get",
    params,
  });
};
export const financeConfirm = (data) => {
  return request({
    url: "/afterSale/financeConfirm",
    method: "post",
    data,
  });
};
export const staffConfirm = (data) => {
  return request({
    url: "/afterSale/staffConfirm",
    method: "post",
    data,
  });
};
export const addWorkOrder = (data) => {
  return request({
    url: "/afterSale/addWorkOrder",
    method: "post",
    data,
  });
};
export const getSubOrderList = (params) => {
  return request({
    url: "/afterSale/getOrderDetail",
    method: "get",
    params,
  });
};
export const getLogisticsList = (params) => {
  return request({
    url: "/afterSale/getLogisticsList",
    method: "get",
    params,
  });
};
export const workOrderDetail = (params) => {
  return request({
    url: "/afterSale/workOrderDetail",
    method: "get",
    params,
  });
};
export const getMerchantAfterSaleRefundReason = (params) => {
  return request({
    url: "/afterSale/getMerchantAfterSaleRefundReason",
    method: "get",
    params,
  });
};

export const updateWorkOrderAmount = (data) => {
  return request({
    url: "/afterSale/updateWorkOrderAmount",
    method: "post",
    data,
  });
};

export const warehouseAudit = (data) => {
  return request({
    url: "/afterSale/returnApply",
    method: "post",
    data,
  });
};
export const getPackageNo = (params) => {
  return request({
    url: "/afterSale/queryWarehousePackageId",
    method: "get",
    params,
  });
};
export const staffReject = (data) => {
  return request({
    url: "/afterSale/staffReject",
    method: "post",
    data,
  });
};
export const financeReturn = (data) => {
  return request({
    url: "/afterSale/financeReturn",
    method: "post",
    data,
  });
};
export const updateStatus = (data) => {
  return request({
    url: "/afterSale/updateStatus",
    method: "post",
    data,
  });
};
