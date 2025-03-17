import { request } from "@/router/axios";

export const getList = (data) => {
  return request({
    url: "/member/user/list",
    method: "post",
    data,
  });
};
export const getDetail = (params) => {
  return request({
    url: "/member/user/detail",
    method: "get",
    params,
  });
};
export const toFreeze = (data) => {
  return request({
    url: "/member/user/freeze",
    method: "post",
    data,
  });
};
export const addWhiteList = (data) => {
  return request({
    url: "/member/user/updateUserLabel",
    method: "post",
    data,
  });
};

export const updateRemark = (data) => {
  return request({
    url: "/member/user/updateRemark",
    method: "post",
    data,
  });
};
export const changePromotionPoint = (data) => {
  return request({
    url: "/member/user/changePromotionPoint",
    method: "post",
    data,
  });
};
export const changeMemberPoint = (data) => {
  return request({
    url: "/member/user/changeMemberPoint",
    method: "post",
    data,
  });
};
export const changeMemberGrowth = (data) => {
  return request({
    url: "/member/user/changeMemberGrowth",
    method: "post",
    data,
  });
};
export const listMemberPoint = (data) => {
  return request({
    url: "/member/user/listMemberPoint",
    method: "post",
    data,
  });
};
export const listPromotionPoint = (data) => {
  return request({
    url: "/member/user/listPromotionPoint",
    method: "post",
    data,
  });
};
export const listMemberGrowth = (data) => {
  return request({
    url: "/member/user/listMemberGrowth",
    method: "post",
    data,
  });
};
export const listUserOrder = (data) => {
  return request({
    url: "/member/user/listUserOrder",
    method: "post",
    data,
  });
};

export const commissionList = (data) => {
  return request({
    url: "/user/commission/queryList",
    method: "post",
    data,
  });
};

// 发放优惠券
export const distributeCoupons = (data) => {
  return request({
    url: "/member/user/distributeCoupons",
    method: "post",
    data,
  });
};

// 标记为金牌商家
export const updateUserIdentity = (data) => {
  return request({
    url: "/member/user/updateUserIdentity",
    method: "post",
    data,
  });
};
// 获取金牌商家配置
export const getUserIdentityConfig = (params) => {
  return request({
    url: "/transport/config/getDetailByUserId",
    method: "get",
    params,
  });
};
// 保存金牌商家配置
export const saveUserIdentityConfig = (data) => {
  return request({
    url: "/transport/config/update",
    method: "post",
    data,
  });
};
// 保存金牌商家配置
export const changeUserStatus = (data) => {
  return request({
    url: "/member/user/updateStatus",
    method: "post",
    data,
  });
};
