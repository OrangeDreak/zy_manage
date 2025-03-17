import { request } from "@/router/axios";

// 余额充值申请列表
export const applyList = (data) => {
  return request({
    url: "/user/balance/apply/list",
    method: "post",
    data,
  });
};

//  创建余额充值申请
export const saveApply = (data) => {
  return request({
    url: "/user/balance/apply/save",
    method: "post",
    data,
  });
};
//  余额充值审核
export const balanceApply = (data) => {
  return request({
    url: "/user/balance/apply/apply",
    method: "post",
    data,
  });
};

//  获取申请详情
export const applyDetail = (data) => {
  return request({
    url: "/user/balance/apply/detail",
    method: "get",
    data,
  });
};
// 币种列表
export const getCurrencyList = (data) => {
  return request({
    url: "/user/balance/apply/getSystemApprovalTypes",
    method: "get",
    data,
  });
};

// 提现申请列表
export const withdrawList = (data) => {
  return request({
    url: "/user/balance/apply/withdrawList",
    method: "post",
    data,
  });
};
//  提现审核
export const withdrawApply = (data) => {
  return request({
    url: "/user/balance/apply/withdrawApply",
    method: "post",
    data,
  });
};
