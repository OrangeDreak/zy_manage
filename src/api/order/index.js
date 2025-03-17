import { request } from "@/router/axios";

export const getCancelReason = (params) => {
  return request({
    url: "/blade-system/dict/dictionary?code=cancel_reason",
    method: "get",
    params,
  });
};
export const getOrderStatus = (params) => {
  return request({
    url: "/order/getEnums",
    method: "get",
    params,
  });
};
export const getList = (data) => {
  return request({
    url: "/order/list",
    method: "post",
    data,
  });
};
export const getDetail = (params) => {
  return request({
    url: "/order/detail",
    method: "get",
    params,
  });
};
export const setRemark = (data) => {
  return request({
    url: "/order/remark",
    method: "post",
    data: { ...data, editCanEmpty: true },
  });
};
export const takeOrder = (data) => {
  return request({
    url: "/order/takeOrder",
    method: "post",
    data,
  });
};
export const toTwicePay = (data) => {
  return request({
    url: "/purchaseOrder/toTwicePay",
    method: "post",
    data,
  });
};
export const bindWdPayOrder = (data) => {
  return request({
    url: "/purchaseOrder/bindWdPayOrder",
    method: "post",
    data,
  });
};

export const purchaseOrder = (data) => {
  return request({
    url: "/order/purchaseOrder",
    method: "post",
    data,
  });
};

export const cancelPurchase = (data) => {
  return request({
    url: "/purchaseOrder/cancelPurchase",
    method: "post",
    data,
  });
};

export const getSubDetail = (params) => {
  return request({
    url: "/order/subDetail",
    method: "get",
    params,
  });
};
export const getContractMerchant = (params) => {
  return request({
    url: "/purchaseOrder/getContractMerchant",
    method: "get",
    params,
  });
};

export const orderMessage = (data) => {
  return request({
    url: "/suborder/message/save",
    method: "post",
    data,
  });
};

export const logisticsTracking = (params) => {
  return request({
    url: "/order/logisticsTracking",
    method: "get",
    params,
  });
};

export const payOrder = (data) => {
  return request({
    url: "/order/payOrder",
    method: "post",
    data,
  });
};
export const cancelOrder = (data) => {
  return request({
    url: "/order/cancel",
    method: "post",
    data,
  });
};

export const confirmOrder = (data) => {
  return request({
    url: "/order/confirm",
    method: "post",
    data,
  });
};

export const getOperatorList = (params) => {
  return request({
    url: "/order/getUserByRoleId",
    method: "get",
    params,
  });
};
export const purchaseList = (data) => {
  return request({
    url: "/purchaseOrder/list",
    method: "post",
    data,
  });
};

export const getWarehouseList = (data) => {
  return request({
    url: "/back/warehouseOrder/list",
    method: "post",
    data,
  });
};
export const getWarehouseDetail = (params) => {
  return request({
    url: "/back/warehouseOrder/detail",
    method: "get",
    params,
  });
};

export const getPackageList = (data) => {
  return request({
    url: "/back/packageOrder/list",
    method: "post",
    data,
  });
};
export const getPackageDetail = (params) => {
  return request({
    url: "/back/packageOrder/detail",
    method: "get",
    params,
  });
};
export const packageOrderEdit = (data) => {
  return request({
    url: "/back/packageOrder/edit",
    method: "post",
    data,
  });
};

export const cancelPackageOrder = (data) => {
  return request({
    url: "/back/packageOrder/cancel",
    method: "post",
    data,
  });
};
export const pushPackageOrder = (data) => {
  return request({
    url: "/back/packageOrder/push",
    method: "post",
    data,
  });
};

export const bindLogisticsNo = (data) => {
  return request({
    url: "/purchaseOrder/artificialSend",
    method: "post",
    data,
  });
};

export const checkTrackingNumberExist = (params) => {
  return request({
    url: "/purchaseOrder/checkTrackingNumberExist",
    method: "get",
    params,
  });
};

// 仓库订单标记产品类型
export const saveTypeLabel = (data) => {
  return request({
    url: "/back/warehouseOrder/saveTypeLabel",
    method: "post",
    data,
  });
};

// 手动获取仓库订单QC照片
export const getWarehouseOrderPhoto = (params) => {
  return request({
    url: "/back/warehouseOrder/updateQcImage",
    method: "get",
    params,
  });
};

export const getForwardingList = (data) => {
  return request({
    url: "/transport/order/list",
    method: "post",
    data,
  });
};

// 修改仓库订单实重
export const updatePackageSize = (data) => {
  return request({
    url: "/back/warehouseOrder/updatePackageSize",
    method: "post",
    data,
  });
};

// 客户子单拆单
export const splitSubOrder = (data) => {
  return request({
    url: "/order/splitOrder",
    method: "post",
    data,
  });
};
// 计费重运费计算
export const getTransportOrderEstimatedAmount = (data) => {
  return request({
    url: "/back/packageOrder/getTransportOrderEstimatedAmount",
    method: "post",
    data,
  });
};
// 提交调整运费金额
export const submitDelivery = (data) => {
  return request({
    url: "/back/packageOrder/delivery",
    method: "post",
    data,
  });
};
// 判断用户是否是风险用户
export const checkIsDangerUser = (params) => {
  return request({
    url: "/back/packageOrder/checkIsDangerUser",
    method: "get",
    params,
  });
};
// 判断QC照片是否已确认
export const updateTakeFinePictures = (params) => {
  return request({
    url: "/back/warehouseOrder/updateTakeFinePictures",
    method: "get",
    params,
  });
};
// 风控包裹详情
export const dangerOrderDetail = (params) => {
  return request({
    url: "/back/danger/packageOrder/detail",
    method: "get",
    params,
  });
};
// 创建换单支付金额
export const createChangeOrder = (data) => {
  return request({
    url: "/back/danger/packageOrder/createChangeOrder",
    method: "post",
    data,
  });
};
// 取消换单充值
export const cancelChangeOrderRecharge = (params) => {
  return request({
    url: "/back/danger/packageOrder/cancelChangeOrderRecharge",
    method: "get",
    params,
  });
};
// 解除风控
export const releaseRiskPackageOrder = (data) => {
  return request({
    url: "/back/danger/packageOrder/releaseRiskPackageOrder",
    method: "post",
    data,
  });
};
// 确定换单
export const confirmChangeOrder = (data) => {
  return request({
    url: "/back/danger/packageOrder/changeOrder",
    method: "post",
    data,
  });
};
// 修改国际物流单号
export const changeInternationalLogisticsTrackingNumber = (params) => {
  return request({
    url: "/back/packageOrder/changeInternationalLogisticsTrackingNumber",
    method: "get",
    params,
  });
};
